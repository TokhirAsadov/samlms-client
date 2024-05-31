import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {BASE_URL, mainColor, STUDENT} from "../../../utills/ServiceUrls";
import axios from "axios";
import {toast} from "react-toastify";
import {DataGrid, GridToolbar} from '@mui/x-data-grid';
import {extrasmall, medium, small} from "../../../responsiv";
import {FaFilter} from "react-icons/fa";
import {Card, CardContent, TextField} from "@mui/material";
import ButtonMui from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";


const GroupStackedBarChart = () => {
    const [course, setCourse] = useState(1);
    const [faculties, setFaculties] = useState([]);
    const [faculty, setFaculty] = useState("");
    const [group, setGroup] = useState("");
    const [groups, setGroups] = useState([]);
    const [loadData, setLoadData] = useState(false)
    const [isOtherDay, setIsOtherDay] = useState(false);
    const [typeOfTime, setTypeOFTime] = useState("");
    const [otherDay, setOtherDay] = useState("");
    const [data, setData] = useState([])
    const [startDate, setStartDate] = useState(new Date());
    const [time, setTime] = useState({
        startTime: '',
        endTime: ''
    });


    const startDayAux = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        let hours = '00';
        let minutes = '00';

        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }
        if (hours.length < 2) {
            hours = '0' + hours;
        }
        if (minutes.length < 2) {
            minutes = '0' + minutes;
        }

        let yearMonthDay = [year, month, day].join('-');
        return [yearMonthDay, 'T', hours, ':', minutes].join('');
    }

    const endDayAux = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        let date2 = new Date();
        let hours = '';
        let minutes = '';

        if (
            date.getDate() === date2.getDate()
            && date.getMonth() === date2.getMonth()
            && date.getFullYear() === date2.getFullYear()
        ) {
            hours = '' + date2.getHours();
            minutes = '' + date2.getMinutes();
        } else {
            day = '' + d.getDate();
            hours = '23';
            minutes = '59';
        }

        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }
        if (hours.length < 2) {
            hours = '0' + hours;
        }
        if (minutes.length < 2) {
            minutes = '0' + minutes;
        }

        let yearMonthDay = [year, month, day].join('-');
        return [yearMonthDay, 'T', hours, ':', minutes].join('');
    }

    const findAllFaculties = (value) => {
        setCourse(value);
    }

    useEffect(() => {

        if (course !== "") {
            axios.get(BASE_URL + STUDENT.GET_FACULTY_BY_COURSE_LEVEL + course)
                .then(res => {
                    setFaculties(prevState => [...res.data.obj])
                    setFaculty(() => res.data.obj[0])
                    setLoadData(false)
                })
                .catch(err => {
                    console.log(err)
                })
        }

    }, [course]);
    const findGroups = (value) => {

        value = value.trim();
        setGroups([]);
        setGroup("");
        setFaculty(value);
    }
    useEffect(() => {
        if (faculty !== "") {
            axios.get(BASE_URL + STUDENT.GET_GROUPS_BY_LEVEL_AND_FACULTY_NAME + course + "?facultyName=" + faculty)
                .then(res => {
                    setGroups(() => [...res.data.obj]);
                    setGroup(() => res.data.obj[0])
                })
                .catch(res => {
                    toast.error(res.data);
                })
        }
    }, [faculty]);

    const handleChangeGroup = (value) => {
        setGroup(value);

    }

    const handleTime = (value) => {

        if (value === "") {
            setIsOtherDay(() => false);
        } else if (value === "OTHER_DAY") {
            setTypeOFTime(() => value);
            setIsOtherDay(() => true);
        }
        if (value === "TODAY") {
            setTypeOFTime(() => value);
            setStartDate(new Date());
            setIsOtherDay(() => false);
        }
    }

    const dateFormat = () => {

        setData(() => [])

        if (typeOfTime === "OTHER_DAY") {
            setLoadData(true)
            let date2 = startDayAux(otherDay);
            let date3 = endDayAux(otherDay);

            time.endTime = date3;
            time.startTime = date2;
            axios.post(BASE_URL + STUDENT.GET_STUDENT_WITH_RFID + "?endTime=" + time.endTime + "&groupName=" + group + "&startTime=" + time.startTime)
                .then(res => {
                    res.data.obj.map(async (user) => {
                        if (user.dateAsc !== null)
                            user.dateAsc = new Date(user.dateAsc);
                        if (user.dateDesc !== null)
                            user.dateDesc = new Date(user.dateDesc);
                        return user;
                    });

                    setData(() => [...res.data.obj]);
                    setLoadData(false)
                })
                .catch(err => {
                    console.log(err)
                    setLoadData(false)
                })
        }
    }


    const columns = [
        {field: 'id', headerName: 'ID', width: 40, editable: false},
        {field: 'fullName', headerName: 'Full Name', width: 180, editable: false},
        {field: 'cardNo', headerName: 'Card Number', width: 180, editable: false},
        {
            field: 'dateAsc',
            headerName: 'Come In',
            type: 'dateTime',
            width: 180,
            editable: false,
            renderCell: (cellValues) => {
                return cellValues.formattedValue !== "" ? <p>{cellValues.formattedValue}</p> : <p>kelmagan</p>
            }
        },
        {
            field: 'dateDesc',
            headerName: 'Come Out',
            type: 'dateTime',
            width: 180,
            editable: false,
            renderCell: (cellValues) => {
                return cellValues.formattedValue !== "" ? <p>{cellValues.formattedValue}</p> : <p>kelmagan</p>
            }
        }
    ];


    useEffect(() => {
        axios.get(BASE_URL + STUDENT.GET_FACULTY_BY_COURSE_LEVEL + course)
            .then(res => {
                setFaculties(res.data.obj)
                setFaculty(res.data.obj[0])
            })
            .catch(error => {
                console.log(error)

            })

    }, [course])

    useEffect(() => {
        axios.get(BASE_URL + STUDENT.GET_GROUPS_BY_LEVEL_AND_FACULTY_NAME + course + "?facultyName=" + faculty)
            .then(res => {
                setGroups(() => [...res.data.obj]);
                setGroup(() => res.data.obj[0])
                setLoadData(false)
            })
            .catch(err => {
                console.log(err)
            })
    }, [faculty, course])

    useEffect(() => {
        setLoadData(true)
        axios.get(BASE_URL + STUDENT.GET_STUDENT_WITH_RFID_FOR_TODAY + group)
            .then(res => {
                res.data.obj?.map((user) => {
                    if (user.dateAsc !== null)
                        user.dateAsc = new Date(user.dateAsc);
                    if (user.dateDesc !== null)
                        user.dateDesc = new Date(user.dateDesc);
                    return user;
                });
                setData(res.data.obj);
                setLoadData(false)
            })

    }, [group])

    return (
        <Container>

            <FilterContainer>
                <Select onChange={e => findAllFaculties(e.target.value)}>
                    <option value="" disabled>Select Course</option>
                    <option value="1">Course - 1</option>
                    <option value="2">Course - 2</option>
                    <option value="3">Course - 3</option>
                    <option value="4">Course - 4</option>
                </Select>

                <Select
                    value={faculty}
                    onChange={(e) => findGroups(e.target.value)}
                >

                    {
                        faculties &&
                        faculties.map(item => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))
                    }
                </Select>
                <Select value={group}
                        onChange={e => handleChangeGroup(e.target.value)}
                >
                    {
                        groups &&
                        groups.map((item, index) => (
                            <option key={index} value={item}>
                                {item}
                            </option>
                        ))
                    }
                </Select>
                <Select
                    isOtherDay={isOtherDay}
                    onChange={e => handleTime(e.target.value)}>
                    <option value="" disabled>Time</option>
                    <option value="TODAY">TODAY</option>
                    <option value="OTHER_DAY">OTHER DAY</option>
                </Select>
                {
                    isOtherDay &&
                    <>
                        <TextField
                            component={styleTextField}
                            sx={{width: "250px"}}
                            InputLabelProps={{shrink: true, required: true}}
                            label={'Date'}
                            type='date'
                            id='end'
                            size='medium'
                            onChange={e => setOtherDay(new Date(e.target.value))}
                        />
                        <ButtonMui
                            component={styleTextField}
                            sx={{width: "250px"}}
                            variant={'contained'}
                            endIcon={<FaFilter/>}
                            onClick={dateFormat}
                            size='large'
                        >
                            Filter
                        </ButtonMui>
                    </>
                }
            </FilterContainer>

            <Wrapper>
                <Card style={{width: "100%"}}>
                    <CardContent>
                        {loadData && <Box sx={{width: "100%"}}>
                            <LinearProgress/>
                        </Box>}
                        <DataGrid
                            style={{width: "100%", minHeight: "300px!important"}}
                            columns={columns}
                            rows={data || []}
                            components={{Toolbar: GridToolbar}}/*** print and excel ****/
                            loading={loadData}
                            autoHeight/>

                    </CardContent>
                </Card>

            </Wrapper>
        </Container>
    )
};


const styleTextField = styled.div`
    ${extrasmall({
        width: "80% !important",
    })}
`

const Select = styled.select`
    width: 250px;
    height: 50px;
    background: white;
    font-size: 14px;
    border-radius: 7px;
    padding: 5px;
    cursor: pointer;
    border: 1px solid ${mainColor};
    color: ${mainColor};
    box-shadow: rgba(149, 157, 165, 0.2) 0 8px 24px;

    &:focus {
        outline: none;
    }

    option {
        color: black;
        background: white;
        font-weight: 300;
        display: flex;
        white-space: pre;
        min-height: 20px;
        padding: 0px 2px 1px;
    }

    ${extrasmall({
        width: "80%"
    })}`;


const FilterContainer = styled.div`
    width: 100%;
    margin-top: 10px;
    margin-bottom: 30px;
    display: grid;
    grid-template-columns:repeat(4, 1fr);
    gap: 30px;
    justify-items: center;
    align-items: center;
    ${medium({
        gridTemplateColumns: 'repeat(2,1fr)',
    })}
    ${small({
        gridTemplateColumns: 'repeat(1,1fr)',
    })}
    ${extrasmall({
        gridTemplateColumns: 'repeat(1,1fr)',
    })}`;

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
`;

const Wrapper = styled.div`
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    min-height: 380px;
    margin-bottom: 50px !important;
`;

export default GroupStackedBarChart;