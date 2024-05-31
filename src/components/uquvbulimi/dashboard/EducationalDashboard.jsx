import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {extrasmall} from "../../../responsiv";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import moment from "moment";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import TimeTableForUquvBulimDashboard from "../timeTableForRoom/TimeTableForUquvBulimDashboard";
import Spinner2 from "../../spinner/Spinner2";
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DesktopDatePicker} from "@mui/x-date-pickers";
import EmptyDataImg from "../../emptyDataImg/EmptyDataImg";

const EducationalDashboard = () => {

    const [check, setCheck] = useState(false);
    const [data, setData] = useState([]);
    const [statistics, setStatistics] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [building, setBuilding] = useState(null);
    const [floor, setFloor] = useState(buildings?.find(i => i?.label === building)?.minFloor || 1);
    const {headers} = getHeaders();
    const [value, setValue] = React.useState(moment());
    const [isError, setError] = useState(false)

    useEffect(() => {
        axios.get(BASE_URL + "/building/getBuildingsForSelect", {headers})
            .then(res => {
                setBuildings(res?.data?.obj)
                setBuilding(res?.data?.obj[0]?.label)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])


    const [objWeek, setObjWeek] = useState({
        date: new Date(),
        dateFrom: moment().startOf('isoWeek').toDate(),
        dateTo: moment().endOf('isoWeek').toDate(),
        weekNumber: moment().isoWeek(),
        year: moment().year(),
        weekday: moment().day(),
    });

    const onChange = (date) => {
        const weekNumber = moment(date.format('YYYY-MM-DD')).isoWeek();
        const weekday = moment(date.format('YYYY-MM-DD')).day();
        const year = moment(date.format('YYYY-MM-DD')).year();
        const dateFrom = moment(date.format('YYYY-MM-DD')).startOf('isoWeek').toDate();
        const dateTo = moment(date.format('YYYY-MM-DD')).endOf('isoWeek').toDate();

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

    useEffect(() => {
        setCheck(false);
        setError(false)
        building && fetchData()
    }, [building, floor, objWeek]);

    useEffect(() => {
        onChange(value)
    }, [value])

    const generateData = (input) => {
        let arr = [];
        input?.forEach(a => {
            a?.forEach(e => {
                const idx = arr?.findIndex(i => i[0]?.room?.trim() === e.room?.trim());
                if (idx + 1) {
                    arr[idx].push(e)
                } else {
                    arr.push([e])
                }
            })
        })
        return arr;
    }


    const fetchData = () => {
        axios.get(BASE_URL + `/timeTableByWeekOfYear/getTimeTableByAllRoomAndWeek?b=${building?.substring(0, 1)}-${floor}&week=${objWeek?.weekNumber}&weekday=${objWeek.weekday}&year=${objWeek.year}&t=true`, {headers})
            .then(res => {
                setData(generateData(res.data.obj));
                console.log(res.data, '111111111')
                console.log(generateData(res.data.obj), '2222222222222')
                setStatistics(generateData(res?.data?.secondObj));
                console.log(generateData(res.data?.secondObj), '3333333333333')
                setCheck(true)
                setError(false)

            })
            .catch(err => {
                console.log(err)
                setError(true)
            })
    }

    const [show, setshow] = useState(false);

    function rangeInt(begin, end) {
        let arr = [];
        for (begin; begin <= end; begin++) {
            arr.push(begin);
        }
        return arr;
    }

    console.log(isError)

    return (
        <Container>
            {
                buildings && buildings?.length > 0 && <WrapperInput>
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
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Floor</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={floor}
                                label="Floor"
                                onChange={(e) => {
                                    setFloor(e.target.value)
                                }}
                            >
                                {
                                    rangeInt(buildings?.find(i => i?.label === building)?.minFloor, buildings?.find(i => i?.label === building)?.maxFloor)?.filter(i => i !== 0)?.map(i => (
                                        <MenuItem value={i}>{i}</MenuItem>))

                                }
                            </Select>
                        </FormControl>
                    </SelectBox>

                    <LocalizationProvider dateAdapter={AdapterMoment}>

                        <DesktopDatePicker
                            label="Day"
                            inputFormat="DD/MM/YYYY"
                            value={value}
                            onChange={(newValue) => {
                                setValue(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />

                    </LocalizationProvider>

                </WrapperInput>
            }

            <div style={{width: "100%", overflowX: "scroll"}}>

                {
                    check ? data?.filter(i => i?.length > 0)?.map((item, index) => {

                                let objStatistics = [];
                                statistics?.map(i => {
                                    if (i?.filter(i2 => (i2?.room?.lastIndexOf('-') === 5 ? i2?.room?.substring(0, 5) : i2?.room) === (item[0]?.room?.trim()?.length === 7 ? item[0]?.room : item[0]?.room?.substring(0, item[0]?.room?.indexOf('-') + 4)))?.length > 0) objStatistics = i?.filter(i2 => i2?.room === item[0]?.room?.trim()?.length == 7 ? item[0]?.room : item[0]?.room?.substring(0, item[0]?.room?.indexOf('-') + 4))
                                    return i;
                                })


                                return (
                                    <TimeTableForUquvBulimDashboard
                                        index={index}
                                        data={item}
                                        statistics={objStatistics}
                                        objWeek={objWeek}
                                    />
                                )
                            }
                        )
                        : isError ? (<EmptyDataImg w={"200"} h={"180"}/>) : <Spinner2/>
                }
            </div>
        </Container>
    );
};


const SelectBox = styled.div`
    width: 300px;
    ${extrasmall({
        width: "80%"
    })}
`

const WrapperInput = styled.div`
    overflow: hidden;
    margin: 15px 0 0;
    padding: 10px 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 25px;
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
export default EducationalDashboard;