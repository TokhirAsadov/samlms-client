import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {BASE_URL, mainColor, STUDENT} from "../../../utills/ServiceUrls";
import axios from "axios";
import {toast} from "react-toastify";
import {extrasmall, medium, small} from "../../../responsiv";
import Tooltip from "@mui/material/Tooltip"
import {FaFilter, FaLayerGroup} from "react-icons/fa"
import {Card, CardContent, Skeleton, TextField} from "@mui/material";
import ButtonMui from "@mui/material/Button";
import Box from "@mui/material/Box";
import EmptyDataImg from "../../emptyDataImg/EmptyDataImg";
import ExportToExcelGroups from "./ExportToExcelGroups";


const DirectionStackedBarChart = (props) => {
    const [course, setCourse] = useState(1);
    const [faculties, setFaculties] = useState([]);
    const [faculty, setFaculty] = useState("");
    const [typeOfTime, setTypeOFTime] = useState("");
    const [isDuration, setIsDuration] = useState(false);
    const [loadData, setLoadData] = useState(false)


    const [startDate, setStartDate] = useState();
    const [time, setTime] = useState({
        startTime: '',
        endTime: ''
    });

    const [duringStartTime, setDuringStartTime] = useState("");
    const [duringEndTime, setDuringEndTime] = useState("");
    const [allgroup, setallgroup] = useState([])
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
        time.startTime = [yearMonthDay, 'T', hours, ':', minutes].join('');
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
        setLoadData(true)
        course !== "" && axios.get(BASE_URL + STUDENT.GET_FACULTY_BY_COURSE_LEVEL + course)
            .then(res => {
                setFaculties(res.data.obj)
                setFaculty(res.data.obj[0]);
                setLoadData(false)
            })
            .catch(err => {
                console.log(err)
                setLoadData(false)
            })
    }, [course]);

    const handleTime = (value) => {

        if (value === "") {
            setIsDuration(() => false);
            toast.warning("Please,Choose Type Of Time.");
        } else if (value === "duration") {
            setTypeOFTime(value);
            setIsDuration(true);
        } else {
            setTypeOFTime(value);
            setStartDate(new Date());
            setIsDuration(false);
        }

    }

    const dateFormat = () => {
        setLoadData(true)
        if (typeOfTime === "duration") {
            const dataEnd = endDayAux(duringEndTime);
            const dateStart = startDayAux(duringStartTime);
            axios.post(BASE_URL + STUDENT.GET_GROUPS_STATISTIC_BY_FACULTY_NAME_AND_GROUP_LEVEL + "?endTime=" + dataEnd + "&facultyName=" + faculty + "&level=" + course + "&startTime=" + dateStart)
                .then(res => {
                    setallgroup(res.data.obj)
                    setLoadData(false)
                })
                .catch(err => {
                    console.log(err)
                    setLoadData(false)
                })

        }

    }

    useEffect(() => {
        if (typeOfTime === "day") {
            setLoadData(true)
            axios.get(BASE_URL + STUDENT.GET_STUDENTS_BY_TIME_INTERVAL_AND_FACULTY_NAME + "?facultyName=" + faculty + "&level=" + course + "&timeInterval=0")
                .then(res => {
                    setallgroup(res.data.obj)
                    setLoadData(false)
                })
                .catch(err => {
                    console.log(err)
                    setLoadData(false)
                })

        } else if (typeOfTime === "week") {
            setLoadData(true)
            axios.get(BASE_URL + STUDENT.GET_STUDENTS_BY_TIME_INTERVAL_AND_LEVEL_AND_FACULTY_NAME + "?facultyName=" + faculty + "&level=" + course + "&timeInterval=-7")
                .then(res => {
                    setallgroup(res.data.obj)
                    setLoadData(false)
                })
                .catch(err => {
                    console.log(err)
                    setLoadData(false)
                })

        }
    }, [typeOfTime, faculty, course]);

    useEffect(() => {
        setLoadData(true)
        axios.get(BASE_URL + STUDENT.GET_FACULTY_BY_COURSE_LEVEL + 1)
            .then(res => {
                setFaculties(res.data.obj)
                setLoadData(false)
            })
            .catch(err => {
                console.log(err)
                setLoadData(false)
            })
        setTypeOFTime("day")

    }, [])


    useEffect(() => {
        setLoadData(true)
        axios.get(BASE_URL + STUDENT.GET_STUDENTS_BY_TIME_INTERVAL_AND_LEVEL_AND_FACULTY_NAME + "?facultyName=" + faculties[0] + "&level=" + 1 + "&timeInterval=0")
            .then(res => {
                setallgroup(res.data.obj)
                setLoadData(false)
            })
            .catch(err => {
                console.log(err)
                setLoadData(false)
            })
    }, [])

    function pres(a, b) {
        if (!a || !b) return 0
        return Math.ceil(b * 100 / a)
    }

    function pres2(a) {
        return 100 - a
    }

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
                    onChange={(e) => setFaculty(e.target.value)}
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
                <Select
                    onChange={e => handleTime(e.target.value)}>
                    <option value="" disabled>Select Type Of Time</option>
                    <option value="day">DAY</option>
                    <option value="week">WEEK</option>
                    <option value="duration">DURATION</option>
                </Select>
                {isDuration &&
                    <>
                        <TextField
                            component={styleTextField}
                            sx={{width: "250px"}}
                            InputLabelProps={{shrink: true, required: true}}
                            label={'Start date'}
                            type='date'
                            id='start'
                            size='medium'
                            onChange={e => setDuringStartTime(new Date(e.target.value))}
                        />

                        <TextField
                            component={styleTextField}
                            sx={{width: "250px"}}
                            InputLabelProps={{shrink: true, required: true}}
                            label={'End date'}
                            type='date'
                            id='end'
                            size='medium'
                            onChange={e => setDuringEndTime(new Date(e.target.value))}
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
                <Cardcore>
                    {loadData && Array.from({length: 5}).map((_, i) => (
                        <Carditem key={i}>
                            <Box sx={{width: "100%"}}>
                                <Skeleton/>
                                <Skeleton animation="wave"/>
                                <Skeleton animation={false}/>
                            </Box>
                        </Carditem>
                    ))}
                    {!loadData && allgroup.map((item, key) => (
                        <Carditem key={key}>
                            <Rigthbox>
                                <Titlecard>
                                    <FaLayerGroup/> {item.name}
                                </Titlecard>
                                <Numberbox>
                                    <Numstudent color={'#9cd365'}>{item.allCount}</Numstudent>
                                    <Numstudent color={mainColor}>{pres(item.allCount, item.comeCount)}%</Numstudent>
                                </Numberbox>
                                <Progres>
                                    <Tooltip title={`kelgan:${item.comeCount}`}>
                                        <Progresitem bgcolor={mainColor}
                                                     width={`${pres(item.allCount, item.comeCount)}%`}/>
                                    </Tooltip>
                                    <Tooltip title={`kelmagan:${item.allCount - item.comeCount}`}>
                                        <Progresitem bgcolor={"red"}
                                                     width={`${pres2(pres(item.allCount, item.comeCount))}%`}/>
                                    </Tooltip>
                                </Progres>
                            </Rigthbox>
                        </Carditem>
                    ))}
                </Cardcore>
                {
                    allgroup?.length >0 && <Box display={'flex'} justifyContent={'end'} sx={{width:'100%',mt:3}}>
                        <ExportToExcelGroups direction={faculty} dataToExcel={allgroup}/>
                    </Box>
                }
                {!loadData && allgroup.length === 0 &&
                    <Box sx={{width:"100%"}}>
                        <Card>
                            <CardContent>
                                <EmptyDataImg w={200} h={180}/>
                            </CardContent>
                        </Card>
                    </Box>
                }
            </Wrapper>

        </Container>
    )
};


const Progresitem = styled.div`
  width: ${props => props.width};
  height: 100%;
  background-color: ${props => props.bgcolor};
`
const Progres = styled.div`
  display: flex;
  width: 100%;
  overflow: hidden;
  height: 8.5px;
  border-radius: 5px;
`

const Numstudent = styled.h6`
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${props => props.color};
`
const Numberbox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`
const Titlecard = styled.h6`
  font-size: 14px;
`
const Rigthbox = styled.div`
  width: 100%;
`

const Carditem = styled.div`
  width: 100%;
  padding: 12px;
  background-color: #fff;
  display: flex;
  align-items: center;
  margin: 0 auto;
  gap: 10px;
  border-radius: 5px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  cursor: pointer;
  transition: 0.06s;

  &:hover {
    transform: scale(1.05);
  }
`
const Cardcore = styled.div`
  width: 100%;
  min-width: 300px;
  display: grid;
  grid-template-columns: auto auto auto;
  gap: 40px;
  ${small({
    gridTemplateColumns: "auto auto",
  })}
  ${extrasmall({
    gridTemplateColumns: "auto",
  })}
`

const WrapperDuring = styled.div`
  margin-bottom: 15px;
  width: 235px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Label = styled.label`
  color: ${mainColor};
  cursor: pointer;


`;

const Input = styled.input.attrs({type: 'date'})`
  width: 150px;
  height: 35px;
  background: white;
  padding-left: 5px;
  font-size: 14px;
  padding-right: 10px;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid ${mainColor};
  color: ${mainColor};

  &:focus {
    outline: none;
  }
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
  })}
`;
const styleTextField = styled.div`
  ${extrasmall({
    width: "80% !important",
  })}
`
const Button = styled.button`
  width: 200px;
  height: 45px;
  background: ${mainColor};
  padding-left: 5px;
  font-size: 14px;
  padding-right: 10px;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid ${mainColor};
  color: #fff;
  transition: all 0.2s ease;
  margin-bottom: 10px;

  &:focus {
    transform: scale(0.95);
  }
`;

const FilterContainer = styled.div`
  width: 100%;
  margin-top: 10px;
  margin-bottom: 30px;
  display: grid;
  grid-template-columns:repeat(3, 1fr);
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
  })}
`;

const Container = styled.div`
    padding: 1rem;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;

`;

const Wrapper = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  margin-bottom: 50px !important;
`;

export default DirectionStackedBarChart;