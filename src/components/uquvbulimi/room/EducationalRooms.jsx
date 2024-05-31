import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {extrasmall} from "../../../responsiv";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import axios from "axios";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import TimeTableForUquvBulim from "../timeTableForRoom/TimeTableForUquvBulim";
import moment from "moment";
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DesktopDatePicker} from "@mui/x-date-pickers";

const EducationalRooms = () => {

    const [rooms, setRooms] = useState([]);
    const [data, setData] = useState([]);
    const [statistics, setStatistics] = useState([]);
    const [room, setRoom] = useState(null);
    const [check, setCheck] = useState(false);
    const [buildings, setBuildings] = useState([]);
    const [building, setBuilding] = useState(null);

    const [objWeek, setObjWeek] = useState({
        date: new Date(),
        dateFrom: null,
        dateTo: null,
        weekNumber: null,
        year: null,
        weekday: null,
    });

    const onChange = (date) => {
        const weekNumber = moment((date).format('YYYY-MM-DD')).isoWeek();
        const weekday = moment((date).format('YYYY-MM-DD')).day();
        const year = moment((date).format('YYYY-MM-DD')).year();
        const dateFrom = moment((date).format('YYYY-MM-DD')).startOf('isoWeek').toDate();
        const dateTo = moment((date).format('YYYY-MM-DD')).endOf('isoWeek').toDate();

        // console.log(day,"==================================================================================")

        setObjWeek({
            date,
            dateFrom,
            dateTo,
            weekNumber,
            year,
            weekday
        })
    }


    const {headers} = getHeaders();

    useEffect(() => {

        //fetch buildings
        axios.get(BASE_URL + "/building/getBuildingsForSelect", {headers})
            .then(res => {
                console.log(res.data, " <- buildings fetch")
                setBuildings(res?.data?.obj)
                setBuilding(res?.data?.obj[0]?.label)
            })
            .catch(err => {
                console.log(err)
            })

        // fetch rooms
        axios.get(BASE_URL + "/room/getRoomsForSelect", {headers})
            .then(res => {
                setRooms(res.data?.obj);
            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    useEffect(() => {
        room && objWeek.weekday && axios.get(BASE_URL + "/timeTableByWeekOfYear/getTimeTableByRoom?r=" + room + "&week=" + objWeek.weekNumber + "&weekday=" + objWeek.weekday + "&year=" + objWeek.year, {headers})
            .then(res => {
                setCheck(true)

                setData(res?.data?.obj)
                setStatistics(res?.data?.secondObj)
            })
            .catch(err => {
                console.log(err)
            })
    }, [room, objWeek])


    const [value, setValue] = React.useState(moment());

    useEffect(() => {
        onChange(value)
    }, [value])


    return (
        <Container>

            <Wrapperinput>

                <SelectBox>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={buildings}
                        defaultValue={buildings[0]}
                        onChange={(event, newValue) => {
                            setBuilding(newValue?.label)
                        }}
                        renderInput={(params) => <TextField {...params} label="Buildings"/>}
                    />
                </SelectBox>

                <SelectBox>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={rooms?.filter(i => i?.label?.startsWith(building?.substring(0, 1)))}
                        onChange={(event, newValue) => {
                            setRoom(newValue?.label)
                        }}

                        sx={{width: 300}}
                        renderInput={(params) => <TextField {...params} label="Auditory"/>}
                    />
                </SelectBox>

                <SelectBox>
                    <LocalizationProvider dateAdapter={AdapterMoment}>

                        <DesktopDatePicker
                            label="Day"
                            inputFormat="DD/MM/YYYY"
                            value={value}
                            onChange={(newValue) => {
                                setValue(newValue);
                            }}
                            renderInput={(params) => <TextField sx={{width: "300px !important"}} {...params} />}
                        />

                    </LocalizationProvider>

                </SelectBox>

            </Wrapperinput>

            {
                check && <TimeTableForUquvBulim data={data} statistics={statistics} weekDay={objWeek.weekday}
                                                week={objWeek.weekNumber}/>
            }

        </Container>
    );
};


const SelectBox = styled.div`
    width: 300px;
    ${extrasmall({
        width: "80%"
    })}
`

const Wrapperinput = styled.div`
    margin: 15px 0 0;
    padding: 10px 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 25px;
    justify-content: start;
    ${extrasmall({
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

export default EducationalRooms;