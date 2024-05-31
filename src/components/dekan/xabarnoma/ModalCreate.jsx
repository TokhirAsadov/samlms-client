import React, {memo, useEffect, useState} from 'react';
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {IoClose} from "react-icons/io5";
import Autocomplete from "@mui/material/Autocomplete";
import {Stack, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import styled from "styled-components";
import {extrasmall} from "../../../responsiv";
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {useSelector} from "react-redux";
import {toast} from "react-toastify";
import Tooltip from "@mui/material/Tooltip";

const ModalCreate = ({modalCreate, handleCloseModalCreate, getNoticeFOrDean, putData}) => {


    const courseStaticData = [1, 2, 3, 4]
    const eduTypesStaticData = ['SIRTQI']
    const dekanatId = useSelector(state => state.dekanat.dekanat.id)
    const [course, setCourse] = useState('')
    const [eduType, setEduType] = useState(eduTypesStaticData[0])
    const [shortNamesFaculty, setShortNamesFaculty] = useState([])
    const [faculties, setFaculties] = useState([]);
    const [groups, setGroups] = useState([])
    const [selectedGroup, setSelectedGroup] = useState([])
    const [eduYears, setEduYears] = useState([])
    const [valueDate, setValueDate] = useState({
        fromDate: '',
        toDate: '',
    })
    const [dynamicSection, setDynamicSection] = useState('')
    const [eduYearsSelectId, setEduYearseduYearsSelectId] = useState("")
    const {headers} = getHeaders()


    const resetData = () => {
        setCourse('')
        setFaculties([])
        setSelectedGroup([])
        setEduYearseduYearsSelectId("")
        setValueDate({
            fromDate: '',
            toDate: '',
        })
        setDynamicSection('')
    }
    const handleCloseModal = () => {
        handleCloseModalCreate()
        resetData()
    }
    const updateData = () => {
        if (putData) {
            console.log(putData)
            if (putData.course) {
                setCourse(putData.course);
            }
            if (putData?.dynamicSection) {
                setDynamicSection(putData.dynamicSection);
            }
            if (putData.facultyNames) {
                const filteredFaculties = shortNamesFaculty.filter(obj => putData.facultyNames.includes(obj.name));
                setFaculties(filteredFaculties);

            }

            if (putData.educationYear && eduYears) {
                const educationYearId = eduYears.find(item => item.name === putData.educationYear)?.id || "";
                setEduYearseduYearsSelectId(educationYearId);
            }

            if (putData.fromDate && putData.toDate) {
                setValueDate({
                    fromDate: putData.fromDate,
                    toDate: putData.toDate,
                });
            }
        }
    };


    const handleSaveData = () => {
        if (!course || !eduType || !faculties.length || !selectedGroup.length || !valueDate.fromDate || !valueDate.toDate || dynamicSection?.trim() === '') {
            toast.error('Validation failed. Please fill in all the required fields.')
            return;
        }
        const body = {
            dekanatId,
            course,
            educationId: eduYearsSelectId,
            facultiesId: faculties.map(item => item.id),
            groupsId: selectedGroup.map(item => item.id),
            fromDate: valueDate.fromDate.valueOf(),
            toDate: valueDate.toDate.valueOf(),
            dynamicSection
        }
        console.log(body)
        if (!putData) {
            axios.post(BASE_URL + '/notificationOuter/save', body, {headers})
                .then(res => {
                    console.log(res.data)
                    toast.success('Success')
                    handleCloseModal()
                    getNoticeFOrDean()

                })
                .catch(err => {
                    console.log(err)
                    toast.error('Error')
                })
        } else {
            const upDataBody = {...body, id: putData.id}
            axios.put(BASE_URL + '/notificationOuter/update', upDataBody, {headers})
                .then(res => {
                    console.log(res.data)
                    toast.success('Update success')
                    handleCloseModal()
                    getNoticeFOrDean()
                })
                .catch(err => {
                    console.log(err)
                    toast.error(' Update error')
                })
        }

    }
    const handleChangeCourse = (val) => {
        setCourse(val)
        setFaculties([])
        setSelectedGroup([])
    }
    const fetchEducationYears = async () => {
        await axios.get(BASE_URL + '/education/educationYearsForSelected', {headers})
            .then(res => {
                setEduYears(res.data.obj)
            })
            .catch(err => {
                console.log(err);
            })
    }
    const getAllFaculties = () => {
        axios.get(BASE_URL + '/faculty/allFacultiesWithShortName')
            .then(response => {
                setShortNamesFaculty(response.data.obj?.sort((a, b) => {
                    if (a?.name < b?.name) return -1;
                    if (a?.name > b?.name) return 1;
                    return 0;
                }))

            })
            .catch(error => {
                console.log(error)
                setShortNamesFaculty([])
            })
    }
    const getGroups = (cr, et, faculty) => {
        if (cr !== '' && et !== '' && faculty.length !== 0)
            axios
                .get(BASE_URL + `/group/getGroupsByFacultiesIds?course=${cr}&educationType=${et}&facultiesIds=${faculty.map(item => item.id)}`)
                .then(response => {
                    setGroups(response.data.obj?.sort((a, b) => {
                        if (a?.name < b?.name) return -1;
                        if (a?.name > b?.name) return 1;
                        return 0;
                    }))
                    if (putData?.groupNames) {
                        const filteredGroups = response.data.obj.filter(obj => putData.groupNames.includes(obj.name));
                        console.log(filteredGroups, 'fill')
                        setSelectedGroup(filteredGroups);
                    }
                })
                .catch(error => {
                    console.log(error)
                    setGroups([])
                })
    }

    useEffect(() => {
        getAllFaculties()
        fetchEducationYears()
    }, []);

    useEffect(() => {
        getGroups(course, eduType, faculties)
    }, [course, eduType, faculties]);

    useEffect(() => {
        updateData()
    }, [putData]);


    return (
        <Modal
            open={modalCreate}
            onClose={handleCloseModal}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
        >
            <Box sx={styleModalCreate}
                 component={styleAddSm}
            >
                <ModalTitle>
                    <h4> Notice</h4>
                    <CloseBtnModal onClick={handleCloseModal}> <IoClose size={22}/></CloseBtnModal>
                </ModalTitle>
                <Box>
                    <Box
                        sx={{
                            overflowY: 'scroll',
                            marginY: 3,
                            height: '70vh',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                        }}
                    >
                        <FormControl fullWidth sx={{mt: 1}}>
                            <InputLabel id="demo-simple-select-label">Years of education</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={eduYearsSelectId}
                                label="Years of education"
                                onChange={(e) => setEduYearseduYearsSelectId(e.target.value)}
                            >{eduYears.map(item => (
                                <MenuItem value={item?.id} key={item?.id}>{item?.name}</MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                        <Box display={'flex'} gap={3}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Course</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={course}
                                    label="Course"
                                    onChange={(e) => handleChangeCourse(e.target.value)}
                                >{courseStaticData.map(item => (
                                    <MenuItem value={item} key={item}>{item}</MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Edu type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={eduType}
                                    label="Edu type"
                                    disabled
                                    onChange={(e) => setEduType(e.target.value)}
                                >{eduTypesStaticData.map(item => (
                                    <MenuItem value={item} key={item}>{item}</MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box display={'flex'} gap={3}>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                    label="Start date"
                                    value={valueDate.fromDate}
                                    onChange={(newValue) => setValueDate(prev => ({...prev, fromDate: newValue}))}
                                    renderInput={(props) => <TextField {...props} />}
                                    shouldDisableDate={(date) => date <= new Date()}
                                />
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                    label="End date"
                                    value={valueDate.toDate}
                                    onChange={(newValue) => setValueDate(prev => ({...prev, toDate: newValue}))}
                                    renderInput={(props) => <TextField {...props} />}
                                    shouldDisableDate={(date) => date <= new Date()}
                                />
                            </LocalizationProvider>
                        </Box>

                        <Autocomplete
                            multiple
                            limitTags={3}
                            id="faculties-autocomplete"
                            options={shortNamesFaculty || []}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option?.name || ''}
                            renderOption={(props, option, {selected}) => (
                                <li {...props}>
                                    <Checkbox
                                        style={{marginRight: 8}}
                                        checked={selected}
                                    />
                                    {option?.name}
                                </li>
                            )}
                            value={faculties}
                            onChange={(event, newValue) => setFaculties(newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Faculties"
                                    placeholder="Select Faculties"
                                />
                            )}
                        />
                        <Autocomplete
                            multiple
                            limitTags={3}
                            id="faculties-autocomplete654"
                            options={groups || []}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option?.name || ''}
                            renderOption={(props, option, {selected}) => (
                                <li {...props}>
                                    <Checkbox
                                        style={{marginRight: 8}}
                                        checked={selected}
                                    />
                                    {option?.name}
                                </li>
                            )}
                            value={selectedGroup}
                            onChange={(event, newValue) => setSelectedGroup(newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Groups"
                                    placeholder="Select Faculties"
                                />
                            )}
                        />
                        <TextField
                            value={dynamicSection}
                            label={'For what'}
                            onChange={e => setDynamicSection(e.target.value)}
                        />
                    </Box>
                    <Box sx={{display:'flex',justifyContent:'space-between',gap:5}}>
                        <Tooltip title={'dynamic section'}>
                            <Button variant={'outlined'} color={'success'} component={'a'} href={'/assets/noticeExample.png'} download={'img'}>
                                example file
                            </Button>
                        </Tooltip>
                        <Stack direction="row" spacing={2} justifyContent="flex-end"
                               alignItems="center">
                            <Button variant="outlined" onClick={handleCloseModal}>Cancel</Button>
                            <Button variant="contained" onClick={handleSaveData}>
                                {putData ? 'update' : 'save'}
                            </Button>
                        </Stack>
                    </Box>

                </Box>
            </Box>
        </Modal>
    );
};
const ModalTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    h4 {
        color: black;
    }

    h5 {
        color: red;
    }

`
const CloseBtnModal = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
    border-radius: 50%;
    border: none;
    background-color: ${mainColor};
    color: white;
    font-size: 12px;
`
const styleAddSm = styled.div`
    ${extrasmall({
        width: "97% !important"
    })}
`
const styleModalCreate = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    padding: "15px",
    borderRadius: "8px",
};
export default memo(ModalCreate);
