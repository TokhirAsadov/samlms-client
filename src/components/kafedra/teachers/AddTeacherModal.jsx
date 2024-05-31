import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import Autocomplete, {createFilterOptions} from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import axios from "axios";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {extrasmall} from "../../../responsiv";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";

const icon = <CheckBoxOutlineBlankIcon fontSize="small"/>;
const checkedIcon = <CheckBoxIcon fontSize="small"/>;

const AddTeacherModal = ({getAllTeacherStatics, setOpen}) => {
    const departmentId = useSelector(state => state.section?.section?.id)
    const [userOption, setUserOption] = useState([]);
    const [positionOption, setPositionOption] = useState([]);
    const [workTypeOption, setWorkTypeOption] = useState([]);
    const [subjectOption, setSubjectOption] = useState([]);
    const [inputValueUser, setInputValueUser] = useState(null);
    const [inputValuePosition, setInputValuePosition] = useState(null);
    const [inputValueWorkType, setInputValueWorkType] = useState(null);
    const [inputValueSubject, setInputValueSubject] = useState([]);
    const [rate, setRate] = useState(null)

    useEffect(() => {
        axios.get(BASE_URL + "/user/getUserForTeacherSaving", getHeaders())
            .then(res => {
                setPositionOption(res.data.obj?.positions);
                setWorkTypeOption(res.data.obj?.workerStatus);
                setSubjectOption(res.data.obj?.subjects);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    const handleClose = () => {
        setOpen(false);
        setInputValueUser(null);
        setInputValueSubject([]);
        setInputValuePosition(null);
        setInputValueWorkType(null);
        setRate(null);
    }
    const handleSearch = (e) => {
        if (e.length > 4) {
            axios.get(BASE_URL + "/user/getUserForTeacherSavingSearch?keyword=" + e, getHeaders())
                .then(res => {
                    setUserOption(Array.from(new Map(res.data.obj.map(item => [item.login, item])).values()));
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }
    const handleSaveData = () => {
        if (!inputValueUser) {
            toast.warning('Please select a user.');
            return;
        }
        if (!inputValuePosition) {
            toast.warning('Please select a position.');
            return;
        }
        if (!inputValueWorkType) {
            toast.warning('Please select a work type.');
            return;
        }
        if (inputValueSubject.length === 0) {
            toast.warning('Please select at least one subject.');
            return;
        }

        const body = {
            id: null,
            kafedraId: departmentId,
            userId: inputValueUser?.value,
            positionId: inputValuePosition?.value,
            workTypeId: inputValueWorkType,
            lessonDtos: inputValueSubject?.map(item => ({id: item?.value, name: item?.label})),
            rate: rate
        }
        console.log(body)
        axios.post(BASE_URL + "/teacher/save", body, getHeaders())
            .then(response => {
                toast.success("Teacher saved successfully.");
                getAllTeacherStatics();
                handleClose()
            })
            .catch(err => {
                console.log(err);
                toast.error('Error saving')
            })
    }
    const filterOptions = createFilterOptions({
        stringify: (option) => option?.label + option?.login + option?.passport
    });

    return (
        <Container>
            <BoxInputs>
                <Autocomplete
                    options={userOption}
                    onFocus={() => setUserOption([])}
                    getOptionLabel={(option) => option?.label || ''}
                    value={inputValueUser}
                    filterOptions={filterOptions}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    onChange={(event, newValue) => {
                        setInputValueUser(newValue);
                    }}
                    onInputChange={(event, newInputValue) => {
                        event?.type === "change" && handleSearch(newInputValue);
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="User" placeholder="User"/>
                    )}
                />
                <Autocomplete
                    options={positionOption}
                    getOptionLabel={(option) => option?.label || ''}
                    value={inputValuePosition}
                    isOptionEqualToValue={(option, value) => option?.value === value?.value}
                    onChange={(event, newValue) => {
                        setInputValuePosition(newValue);
                    }}
                    onInputChange={(event, newInputValue) => {
                        setInputValuePosition(newInputValue);
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Position" placeholder="Position"/>
                    )}
                />
                <Autocomplete
                    options={workTypeOption}
                    getOptionLabel={(option) => option || ''}
                    value={inputValueWorkType}
                    isOptionEqualToValue={(option, value) => option === value}
                    onChange={(event, newValue) => {
                        setInputValueWorkType(newValue);
                    }}
                    onInputChange={(event, newInputValue) => {
                        setInputValueWorkType(newInputValue);
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Work type" placeholder="Work type"/>
                    )}
                />
                <TextField fullWidth label={'Rate'} type={'number'} value={rate}
                           onChange={e => setRate(e.target.value)}/>
                <Autocomplete
                    multiple
                    options={subjectOption}
                    getOptionLabel={(option) => option.label || ''}
                    value={inputValueSubject}
                    disableCloseOnSelect
                    limitTags={1}
                    isOptionEqualToValue={(option, value) => option?.value === value?.value}
                    onChange={(event, newValue) => {
                        setInputValueSubject(newValue);
                    }}
                    renderOption={(props, option, {selected}) => (
                        <li {...props}>
                            <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{marginRight: 8}}
                                checked={selected}
                            />
                            {option?.label}
                        </li>
                    )}
                    renderInput={(params) => (
                        <TextField {...params} label="Subjects" placeholder="Subjects"/>
                    )}
                />

            </BoxInputs>
            <Box sx={{display: 'flex', justifyContent: 'end'}}>
                <Box sx={{display: 'flex', gap: '20px', mt: '20px'}}>
                    <Button variant={'outlined'} onClick={handleClose}>
                        cancel
                    </Button>
                    <Button variant={'contained'} onClick={handleSaveData}>
                        save
                    </Button>
                </Box>
            </Box>

        </Container>
    );
};

const Container = styled.div`
`;
const BoxInputs = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    ${extrasmall({
        gridTemplateColumns: '1fr',
    })}
}
`;

export default AddTeacherModal;
