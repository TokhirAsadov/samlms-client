import React, {useEffect, useState} from 'react';
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import {useSelector} from "react-redux";
import styled from "styled-components";
import {extrasmall, small} from "../../../responsiv";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import {TextField} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {DateTimePicker} from "@mui/x-date-pickers";
import {fetchEducationYear} from "../../../redux/actions/educationYear/education_year_actions";
import {toast} from "react-toastify";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: 'background.paper',
    border: 'none',
    outline: 'none',
    boxShadow: 24,
    borderRadius: 1,
    p: 2,
};
const icon = <CheckBoxOutlineBlankIcon fontSize="small"/>;
const checkedIcon = <CheckBoxIcon fontSize="small"/>;

const ModalStatementData = ({open, setOpen, getData, dataForUpdate, setDataForUpdate}) => {
    const kafedraId = useSelector(state => state.section?.section?.id);
    const optionCondition = ["OPEN", "CLOSE"];
    const [optionTeacher, setOptionTeacher] = useState([]);
    const [optionSubject, setOptionSubject] = useState([]);
    const [optionYear, setOptionYear] = useState([]);
    const [optionGroup, setOptionGroup] = useState([]);
    const [teacherValue, setTeacherValue] = useState('');
    const [eduYearValue, setEduYearValue] = useState('');
    const [subjectValue, setSubjectValue] = useState('');
    const [groupValue, setGroupValue] = useState([]);
    const [conditionValue, setConditionValue] = useState('');
    const [deadline, setDeadline] = useState(null);
    const [errors, setErrors] = useState({});

    const initialState = () => {
        setTeacherValue('');
        setEduYearValue('');
        setSubjectValue('');
        setGroupValue([]);
        setConditionValue('');
        setDeadline(null);
    }
    const handleClose = () => {
        setOpen(false);
        initialState()
        setDataForUpdate(null)
    };

    const validate = () => {
        let tempErrors = {};
        tempErrors.teacherValue = teacherValue ? "" : "This field is required.";
        tempErrors.eduYearValue = eduYearValue ? "" : "This field is required.";
        tempErrors.subjectValue = subjectValue ? "" : "This field is required.";
        tempErrors.groupValue = groupValue.length > 0 ? "" : "At least one group is required.";
        tempErrors.conditionValue = conditionValue ? "" : "This field is required.";
        tempErrors.deadline = deadline ? "" : "This field is required.";
        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === "");
    };

    const handleSaveData = (e) => {
        e.preventDefault();
        if (validate()) {
            if (!dataForUpdate?.id) {
                const bodyData = {
                    teacherId: teacherValue,
                    educationYearId: eduYearValue,
                    lessonId: subjectValue,
                    groupsIds: groupValue.map(i => i?.id),
                    condition: conditionValue,
                    deadline: deadline,
                };
                axios.post(`${BASE_URL}/vedimost/createVedimost `, bodyData, getHeaders())
                    .then(response => {
                        toast.success('Success')
                        setOpen(false);
                        getData('all');
                        handleClose()
                    })
                    .catch(error => {
                        console.error("Error saving data", error);
                        toast.error('Error')
                    });
            } else {
                const bodyData = {
                    id: dataForUpdate?.id,
                    teacherId: teacherValue,
                    educationYearId: eduYearValue,
                    lessonId: subjectValue,
                    groupId: groupValue[0]?.id,
                    condition: conditionValue,
                    deadline: deadline,
                };
                if (groupValue.length > 2) return toast.warning('Update only one group')
                axios.put(`${BASE_URL}/vedimost/updateVedimost`, bodyData, getHeaders())
                    .then(response => {
                        toast.success('Success')
                        setOpen(false);
                        getData('all');
                        handleClose()
                    })
                    .catch(error => {
                        console.error("Error saving data", error);
                        toast.error('Error')
                    });
            }

        }
    };

    const getAllTeacher = async () => {
        await axios.get(`${BASE_URL}/kafera-mudiri/getStatistics?id=${kafedraId}`, getHeaders())
            .then(res => {
                setOptionTeacher(res.data.obj);
                setTeacherValue(res.data.obj?.find(user => user?.fullName === dataForUpdate?.teacher)?.id || '');
            })
            .catch(err => {
                console.error(err);
            });
    };

    const getAllSubject = async (userId, eduId) => {
        userId && eduId && await axios.get(`${BASE_URL}/groupConnect/subjectsOfTeacher/${userId}?educationId=${eduId}`)
            .then(response => {
                setOptionSubject(response.data?.obj);
                setSubjectValue(response.data?.obj?.find(sub => sub?.name === dataForUpdate?.lesson)?.id || '');
            })
            .catch(err => {
                console.error(err);
            });
    };

    const getEducationYears = async () => {
        await axios.get(`${BASE_URL}/education/educationYearsForSelected`, getHeaders())
            .then(res => {
                setOptionYear(res?.data?.obj);
                setEduYearValue(res?.data?.obj[0]?.id);
            })
            .catch(err => {
                console.error(err);
            });
    };

    const getGroupsData = (lessonsId, userId, eduId) => {
        lessonsId && userId && eduId && axios.get(`${BASE_URL}/groupConnect/groupsOfTeacher/${userId}?educationId=${eduId}&subjectId=${lessonsId}&eduType=ALL`)
            .then(response => {
                setOptionGroup(response?.data?.obj);
                setGroupValue(response.data?.obj?.filter(gr => gr?.name === dataForUpdate?.groupName) || []);
            })
            .catch(err => {
                console.error("Error getting groups", err);
            });
    };

    useEffect(() => {
        if (dataForUpdate?.id) {
            setConditionValue(dataForUpdate?.condition);
            setDeadline(dataForUpdate?.deadline);
        }
    }, []);
    useEffect(() => {
        getAllTeacher();
        getEducationYears();
    }, []);

    useEffect(() => {
        getAllSubject(teacherValue, eduYearValue);
    }, [teacherValue, eduYearValue]);

    useEffect(() => {
        getGroupsData(subjectValue, teacherValue, eduYearValue);
    }, [subjectValue, teacherValue, eduYearValue]);

    return (
        <Modal
            keepMounted
            open={open}
            onClose={handleClose}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
        >
            <Box sx={style}>
                <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                    {dataForUpdate ? "Update" : "Create"}
                </Typography>

                <form onSubmit={handleSaveData}>
                    <BoxInputs>
                        <FormControl fullWidth error={!!errors.eduYearValue}>
                            <InputLabel id="demo-simple-select-label6">Academic year</InputLabel>
                            <Select
                                labelId="demo-simple-select-label6"
                                id="demo-simple-select"
                                label="Academic year"
                                value={eduYearValue}
                                onChange={e => setEduYearValue(e.target.value)}
                            >
                                {optionYear?.map((item, index) => (
                                    <MenuItem key={index} value={item?.id}>{item?.name}</MenuItem>
                                ))}
                            </Select>
                            {errors.eduYearValue && <Typography color="error">{errors.eduYearValue}</Typography>}
                        </FormControl>

                        <FormControl fullWidth error={!!errors.teacherValue}>
                            <InputLabel id="demo-simple-select-label45">Teacher</InputLabel>
                            <Select
                                labelId="demo-simple-select-label45"
                                id="demo-simple-select"
                                label="Teacher"
                                value={teacherValue}
                                onChange={e => setTeacherValue(e.target.value)}
                            >
                                {optionTeacher?.map((item, index) => (
                                    <MenuItem key={index} value={item?.id}>{item?.fullName}</MenuItem>
                                ))}
                            </Select>
                            {errors.teacherValue && <Typography color="error">{errors.teacherValue}</Typography>}
                        </FormControl>

                        <FormControl fullWidth error={!!errors.subjectValue}>
                            <InputLabel id="demo-simple-select-label12">Subject</InputLabel>
                            <Select
                                labelId="demo-simple-select-label12"
                                id="demo-simple-select"
                                label="Subject"
                                value={subjectValue}
                                onChange={e => setSubjectValue(e.target.value)}
                            >
                                {optionSubject?.map((item, index) => (
                                    <MenuItem key={index} value={item?.id}>{item?.name}</MenuItem>
                                ))}
                            </Select>
                            {errors.subjectValue && <Typography color="error">{errors.subjectValue}</Typography>}
                        </FormControl>

                        <Autocomplete
                            multiple
                            id="checkboxes-tags-demo1"
                            options={optionGroup}
                            disableCloseOnSelect
                            limitTags={1}
                            isOptionEqualToValue={(option, value) => option?.id === value?.id}
                            getOptionLabel={(option) => option?.name}
                            value={groupValue}
                            onChange={(event, newValue) => {
                                setGroupValue(newValue);
                            }}
                            renderOption={(props, option, {selected}) => (
                                <li {...props}>
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        checked={selected}
                                    />
                                    {option?.name}
                                </li>
                            )}
                            fullWidth
                            renderInput={(params) => (
                                <TextField {...params} label="Groups" placeholder="Groups" error={!!errors.groupValue}
                                           helperText={errors.groupValue}/>
                            )}
                        />

                        <FormControl fullWidth error={!!errors.conditionValue}>
                            <InputLabel id="demo-simple-select-label12">Condition</InputLabel>
                            <Select
                                labelId="demo-simple-select-label12"
                                id="demo-simple-select"
                                label="Condition"
                                value={conditionValue}
                                onChange={e => setConditionValue(e.target.value)}
                            >
                                {optionCondition?.map((item, index) => (
                                    <MenuItem key={index} value={item}>{item}</MenuItem>
                                ))}
                            </Select>
                            {errors.conditionValue && <Typography color="error">{errors.conditionValue}</Typography>}
                        </FormControl>

                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DateTimePicker
                                value={deadline}
                                onChange={(newValue) => setDeadline(newValue)}
                                renderInput={(params) => (
                                    <TextField {...params} label="Deadline" error={!!errors.deadline}
                                               helperText={errors.deadline}/>
                                )}
                            />
                        </LocalizationProvider>
                    </BoxInputs>
                    <Box sx={{display: 'flex', justifyContent: 'end'}}>
                        <Box sx={{display: 'flex', gap: 3}}>
                            <Button type="reset" variant="outlined" onClick={handleClose}>Cancel</Button>
                            <Button type="submit" variant="contained">{dataForUpdate ? 'update' : 'save'}</Button>
                        </Box>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};

const BoxInputs = styled.div`
    display: grid;
    margin: 20px 0;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    ${small({
        gridTemplateColumns: 'repeat(2,1fr)'
    })}
    ${extrasmall({
        gridTemplateColumns: 'repeat(2,1fr)'
    })}
`;

export default ModalStatementData;
