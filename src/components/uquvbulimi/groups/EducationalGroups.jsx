import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import axios from "axios";
import {extrasmall} from "../../../responsiv";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import StudentTimeTableOfWeek from "../../student/timeTable/StudentTimeTableOfWeek";
import moment from "moment";

const EducationalGroups = () => {


    const [eduTypes, setEduTypes] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectEduTypeId, setSelectEduTypeId] = useState(null);
    const [selectGroupId, setSelectGroupId] = useState(null);
    const [eduType, setEduType] = useState('');
    const {headers} = getHeaders();

    const [objWeek, setObjWeek] = useState({
        date: moment().format('YYYY-[W]WW'),
        dateFrom: moment().startOf('isoWeek').toDate(),
        dateTo: moment().endOf('isoWeek').toDate(),
        weekNumber: moment().isoWeek(),
    });

    const onChange = (event) => {
        const date=event.target.value
        const weekNumber = moment(date).isoWeek();
        const dateFrom = moment(date).startOf('isoWeek').toDate();
        const dateTo = moment(date).endOf('isoWeek').toDate();

        setObjWeek({
            date,
            dateFrom,
            dateTo,
            weekNumber
        })
    };




    useEffect(() => {

        eduType !== '' && axios.get(BASE_URL + "/faculty/getFacultiesForSelect?educationName=" + eduType, {headers})
            .then(res => {
                setEduTypes(res?.data?.obj);
            })
            .catch(err => {
                console.log(err)
            })

    }, [eduType])

    useEffect(() => {

        if (selectEduTypeId !== undefined) {
            axios.get(BASE_URL + "/faculty/getGroupsForSelect?facultyId=" + selectEduTypeId + "&eduTypeName=" + eduType, {headers})
                .then(res => {
                    setGroups(res?.data?.obj);
                })
                .catch(err => {
                    console.log(err)
                })
        } else {
            setGroups([]);
            setSelectGroupId(null);
        }


    }, [selectEduTypeId])


    const handleChange = (event) => {
        setEduType(event.target.value);
    };

    return (
        <Container>
            <Wrapperinput>
                <Selectbox>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Ta'lim shakli</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={eduType}
                            label="Ta'lim shakli"
                            onChange={handleChange}
                        >
                            <MenuItem value={"KUNDUZGI"}>KUNDUZGI</MenuItem>
                            <MenuItem value={"KECHKI"}>KECHKI</MenuItem>
                            <MenuItem value={"SIRTQI"}>SIRTQI</MenuItem>
                        </Select>
                    </FormControl>
                </Selectbox>
                <Selectbox>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={eduTypes}
                        onChange={(event, newValue) => {
                            setSelectEduTypeId(newValue?.value)
                        }}

                        renderInput={(params) => <TextField {...params} label="Yo'nalish"/>}
                    />
                </Selectbox>
                <Selectbox>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={groups}
                        onChange={(event, newValue) => {

                            setSelectGroupId(newValue?.label)
                        }}

                        renderInput={(params) => <TextField {...params} label="Group"/>}
                    />
                </Selectbox>

                <TextField
                    label="Date of the week"
                    type="week"
                    sx={{width: "200px"}}
                    value={objWeek.date}
                    onChange={onChange}
                />
            </Wrapperinput>
            {
                selectGroupId && <StudentTimeTableOfWeek obj={objWeek} group={selectGroupId} s={true}/>
            }
        </Container>
    );
};



const Selectbox = styled.div`
    width: 250px;
    ${extrasmall({
        width: "80%"
    })}
`
const Wrapperinput = styled.div`

    margin: 15px 15px 0;
    padding: 10px 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 25px;
    ${extrasmall({
        margin: 0,
        justifyContent: "center"
    })}
`

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 1rem;

`

export default EducationalGroups;