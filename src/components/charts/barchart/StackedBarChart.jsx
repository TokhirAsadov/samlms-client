import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {BASE_URL, mainColor, STUDENT} from "../../../utills/ServiceUrls";
import axios from "axios";
import {Skeleton, TextField} from "@mui/material";
import {toast} from "react-toastify";
import {extrasmall, large, medium, small} from "../../../responsiv";
import history from '../../../utills/kuitimgs/history-book.png';
import mechatronics from '../../../utills/kuitimgs/Mechatronics.png';
import Boshlangichtalim from '../../../utills/kuitimgs/boshlang‘ich-ta’lim.png';
import Elektrotexnika from '../../../utills/kuitimgs/Elektrotexnika.png';
import Englisheducation from '../../../utills/kuitimgs/english-education.png';
import Koreanphilology from '../../../utills/kuitimgs/korean-philology.png';
import Maxsuspedagogika from '../../../utills/kuitimgs/maxsus-pedagogika.png';
import Maktabgachatalim from '../../../utills/kuitimgs/Maktabgachata_lim.png';
import electric_car from '../../../utills/kuitimgs/electric_car.png';
import Civil from '../../../utills/kuitimgs/Civil_Engineering.png';
import InformationSystem from '../../../utills/kuitimgs/Information_System_Engineering.png';
import Renewable_Energy2 from '../../../utills/kuitimgs/Renewable_Energy2.png';
import trafic_management from '../../../utills/kuitimgs/trafic_management.png';
import accounting from '../../../utills/kuitimgs/accounting2.png';
import finance from '../../../utills/kuitimgs/finance.png';
import banking from '../../../utills/kuitimgs/banking.png';
import tourizm from '../../../utills/kuitimgs/tourizm.png';
import business_management from '../../../utills/kuitimgs/business_management.png';
import painting from '../../../utills/kuitimgs/painting.png';
import International_Economic_Relations from '../../../utills/kuitimgs/International_Economic_Relations.png';
import beauty_aesthetics from "../../../utills/kuitimgs/beauty_aesthetics.png";
import dentistry from "../../../utills/kuitimgs/dentistry.png";
import fashion_design from "../../../utills/kuitimgs/fashion_design.png";
import general_medicine from "../../../utills/kuitimgs/general_medicine.png";
import marketing from "../../../utills/kuitimgs/marketing.png";
import lift from "../../../utills/kuitimgs/lift.png";
import translation from "../../../utills/kuitimgs/TRANSLATION_STUDIES.png";
import architecture from "../../../utills/kuitimgs/ARCHITECTURE.png";
import spaceTechnology from "../../../utills/kuitimgs/rocket.png"
import Box from "@mui/material/Box";
import SchoolTabs from "../../rektor/student/SchoolTabs";
import ButtonMui from "@mui/material/Button";
import {FaFilter} from "react-icons/fa";

const StackedBarChart = (props) => {

    const courseLevelData = [1, 2, 3, 4]
    const eduTypeData = ['KUNDUZGI', 'KECHKI', 'SIRTQI']
    const dayTypeData = ['day', 'week', 'duration']

    const [course, setCourse] = useState(courseLevelData[0]);


    const [schools, setSchools] = useState([]);

    const [eduType, setEduType] = useState(eduTypeData[0]);
    const [typeOfTime, setTypeOFTime] = useState(dayTypeData[0]);
    const [isDuration, setIsDuration] = useState(false);

    const [duringStartTime, setDuringStartTime] = useState("");
    const [duringEndTime, setDuringEndTime] = useState("");
    const [load, setLoad] = useState(false)

    const [startDate, setStartDate] = useState(new Date());
    const [time, setTime] = useState({
        startTime: '',
        endTime: ''
    });


    const [checked, setChecked] = useState(false);

    const dataphoto = [
        {name: 'INTERNATIONAL MARKETING', photo: marketing},
        {name: 'HISTORY (BY COUNTRIES AND DIRECTIONS)', photo: history},
        {name: 'TRANSLATION STUDIES (WITH CHINESE AND ENGLISH LANGUAGE)', photo: translation},
        {name: 'TOURISM', photo: tourizm},
        {name: 'BANKING', photo: banking},
        {name: 'DENTISTRY', photo: dentistry},
        {name: 'TRAFFIC MANAGEMENT', photo: trafic_management},
        {name: 'LIFT ENGINEERING', photo: lift},
        {name: 'ACCOUNTING', photo: accounting},
        {name: 'BEAUTY AESTHETICS', photo: beauty_aesthetics},
        {name: 'SPECIAL PEDAGOGY', photo: Maxsuspedagogika},
        {name: 'FINANCE', photo: finance},
        {name: 'BUSINESS MANAGEMENT', photo: business_management},
        {name: 'ARCHITECTURE And URBAN DESIGN', photo: architecture},
        {name: 'GENERAL MEDICINE', photo: general_medicine},
        {name: 'CIVIL ENGINEERING', photo: Civil},
        {name: 'RENEWABLE ENERGY', photo: Renewable_Energy2},
        {name: 'ENGLISH EDUCATION (MATHEMATICS/PHYSICS; ARTS)', photo: Englisheducation},
        {name: 'PRESCHOOL EDUCATION', photo: Maktabgachatalim},
        {name: 'PRIMARY EDUCATION', photo: Boshlangichtalim},
        {name: 'ELECTRICAL ENGINEERING', photo: Elektrotexnika},
        {name: 'KOREAN PHILOLOGY', photo: Koreanphilology},
        {name: 'PAINTING', photo: painting},
        {name: 'MECHATRONICS SYSTEMS ENGINEERING', photo: mechatronics},
        {name: 'INFORMATION SYSTEMS ENGINEERING', photo: InformationSystem},
        {name: 'FASHION DESIGN', photo: fashion_design},
        {name: 'INTERNATIONAL ECONOMIC RELATIONS', photo: International_Economic_Relations},
        {name: 'MECHANICAL ENGINEERING', photo: electric_car},
        {name: 'SPACE TECHNOLOGY', photo: spaceTechnology},
    ]


    const dateFormatAux = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        let date2 = new Date();
        let hours = '' + date2.getHours();
        let minutes = '' + date2.getMinutes();

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

    useEffect(() => {
        console.log(schools, "set schools")
    }, [schools])

    useEffect(() => {
        setLoad(true)
        let date1 = dateFormatAux(startDate);
        let date2 = startDayAux(startDate);
        let date3 = endDayAux(startDate);

        time.endTime = date3;
        time.startTime = date2;


        axios.post(BASE_URL + STUDENT.GET_FACULTY_AND_COMING_COUNT_WITH_ALL_BY_GROUP_LEVEL + "?endTime=" + time.endTime + "&level=" + course + "&startTime=" + time.startTime + "&eduType=" + eduType)
            .then(res => {
                setChecked(() => true)

                setSchools(res.data.obj?.map((item) => (
                            {
                                ...item,
                                allData: item?.allData?.map(item2 => ({
                                        ...item2,
                                        name: item2.name?.substring(item2.name.indexOf(")", 1) + 1).trim()
                                    })
                                ).map(t1 => {
                                        return {...t1, ...dataphoto.find(t2 => t2.name === t1.name)}
                                    }
                                )
                            }
                        )
                    )
                )
                setLoad(false)
            })
            .catch(err => {
                console.log(err)
                setLoad(false)
            })
    }, [])

    useEffect(() => {
        setLoad(true)
        let date1 = dateFormatAux(startDate);
        let date2 = startDayAux(startDate);
        let date3 = endDayAux(startDate);

        time.endTime = date3;
        time.startTime = date2;


        axios.post(BASE_URL + STUDENT.GET_FACULTY_AND_COMING_COUNT_WITH_ALL_BY_GROUP_LEVEL + "?endTime=" + time.endTime + "&level=" + course + "&startTime=" + time.startTime + "&eduType=" + eduType)
            .then(res => {
                setChecked(() => true)

                setSchools(res.data.obj?.map((item) => (
                            {
                                ...item,
                                allData: item?.allData?.map(item2 => ({
                                        ...item2,
                                        name: item2.name?.substring(item2.name.indexOf(")", 1) + 1).trim()
                                    })
                                ).map(t1 => {
                                        return {...t1, ...dataphoto.find(t2 => t2.name === t1.name)}
                                    }
                                )
                            }
                        )
                    )
                )
                setLoad(false)
            })
            .catch(err => {
                console.log(err)
                setLoad(false)
            })
    }, [eduType])

    const handleTime = (value) => {
        setTypeOFTime(() => value);
        if (value === "") {
            setIsDuration(() => false);
            toast.warning("Please,Choose Type Of Time.");
        } else if (value === "duration") {
            setTypeOFTime(() => value);
            setIsDuration(() => true);
        }

    }


    const dateFormat = () => {
        setChecked(false);
        setLoad(true)
        if (typeOfTime === "") {
            toast.warning("Please,Choose Type Of Time.");
        }
        if (typeOfTime === "duration") {
            if (duringEndTime !== "" && duringStartTime !== "") {

                const dataEnd = endDayAux(duringEndTime);
                const dateStart = startDayAux(duringStartTime);

                axios.post(BASE_URL + STUDENT.GET_FACULTY_AND_COMING_COUNT_WITH_ALL_BY_GROUP_LEVEL + "?endTime=" + dataEnd + "&level=" + course + "&startTime=" + dateStart + "&eduType=" + eduType)
                    .then(res => {
                        setChecked(() => true)

                        setSchools(res.data.obj?.map((item) => (
                                    {
                                        ...item,
                                        allData: item?.allData?.map(item2 => ({
                                                ...item2,
                                                name: item2.name?.substring(item2.name.indexOf(")", 1) + 1).trim()
                                            })
                                        ).map(t1 => {
                                                return {...t1, ...dataphoto.find(t2 => t2.name === t1.name)}
                                            }
                                        )
                                    }
                                )
                            )
                        )
                        setLoad(false)
                    })
                    .catch(err => {
                        console.log(err);
                        setLoad(false)
                    })
            } else {
                toast.warning("Please, Choose start date or end date.");
                setLoad(false)
            }

        }
    }


    const handleCourse = (data) => {
        setCourse(data);
    }

    useEffect(() => {

        if (typeOfTime === "") {
            setIsDuration(() => false);
            toast.warning("Please,Choose Type Of Time.");
        }
        if (typeOfTime === "duration") {
            setLoad(true)
            if (duringEndTime !== "" && duringStartTime !== "") {
                const dataEnd = endDayAux(duringEndTime);
                const dateStart = startDayAux(duringStartTime);

                axios.post(BASE_URL + STUDENT.GET_FACULTY_AND_COMING_COUNT_WITH_ALL_BY_GROUP_LEVEL + "?endTime=" + dataEnd + "&level=" + course + "&startTime=" + dateStart + "&eduType=" + eduType)
                    .then(res => {
                        setChecked(() => true)
                        setSchools(res.data.obj?.map((item) => (
                                    {
                                        ...item,
                                        allData: item?.allData?.map(item2 => ({
                                                ...item2,
                                                name: item2.name?.substring(item2.name.indexOf(")", 1) + 1).trim()
                                            })
                                        ).map(t1 => {

                                                return {...t1, ...dataphoto.find(t2 => t2.name === t1.name)}
                                            }
                                        )
                                    }
                                )
                            )
                        )
                        setLoad(false)
                    })
            } else {
                toast.warning("Please, Choose start date or end date.");
                setLoad(false)
            }

        }
        if (typeOfTime === "day") {
            setLoad(true)
            setStartDate(new Date());
            setIsDuration(() => false);


            let date2 = startDayAux(startDate);
            let date3 = endDayAux(startDate);

            time.endTime = date3;
            time.startTime = date2;


            axios.post(BASE_URL + STUDENT.GET_FACULTY_AND_COMING_COUNT_WITH_ALL_BY_GROUP_LEVEL + "?endTime=" + time.endTime + "&level=" + course + "&startTime=" + time.startTime + "&eduType=" + eduType)
                .then(res => {
                    setChecked(() => true)

                    setSchools(res.data.obj?.map((item) => (
                                {
                                    ...item,
                                    allData: item?.allData?.map(item2 => ({
                                            ...item2,
                                            name: item2.name?.substring(item2.name.indexOf(")", 1) + 1).trim()
                                        })
                                    ).map(t1 => {
                                            return {...t1, ...dataphoto.find(t2 => t2.name === t1.name)}
                                        }
                                    )
                                }
                            )
                        )
                    )
                    setLoad(false)
                })
                .catch(err => {
                    console.log(err)
                    setLoad(false)
                })
        }
        if (typeOfTime === "week") {
            setLoad(true)
            setStartDate(new Date());
            setIsDuration(() => false);

            axios.get(BASE_URL + STUDENT.GET_FACULTY_AND_COMING_COUNT_WITH_ALL_BY_GROUP_LEVEL_AND_WEEK_OR_MONTH + "?level=" + course + "&weekOrMonth=-6" + "&eduType=" + eduType)
                .then(res => {
                    setChecked(() => true)

                    setSchools(res.data.obj?.map((item) => (
                                {
                                    ...item,
                                    allData: item?.allData?.map(item2 => ({
                                            ...item2,
                                            name: item2.name?.substring(item2.name.indexOf(")", 1) + 1).trim()
                                        })
                                    ).map(t1 => {

                                            return {...t1, ...dataphoto.find(t2 => t2.name === t1.name)}
                                        }
                                    )
                                }
                            )
                        )
                    )
                    setLoad(false)
                })
                .catch(err => {
                    console.log(err)
                    setLoad(false)
                })
        }
    }, [course, typeOfTime]);


    return (
        <Container>

            <ChartHeader>
                <Select
                    isDuration={isDuration}
                    placeholder={"select"}
                    onChange={e => setEduType(e.target.value)}>
                    {eduTypeData.map(type => (
                        <option value={type}>{type}</option>
                    ))}
                </Select>
                <Select isDuration={isDuration} onChange={e => handleCourse(e.target.value)}>
                    {courseLevelData.map(courseLevel => (
                        <option value={courseLevel}>Course - {courseLevel}</option>
                    ))}
                </Select>
                <Select
                    isDuration={isDuration}
                    placeholder={"select"}
                    onChange={e => handleTime(e.target.value)}>
                    {dayTypeData.map(item => (
                        <option value={item}>{item}</option>
                    ))}
                </Select>
                {
                    isDuration &&
                    <>
                        <WrapperDuring>
                            <TextField
                                sx={{mt: 2}}
                                fullWidth
                                InputLabelProps={{shrink: true, required: true}}
                                label={'Start date'}
                                type='date'
                                id='start'
                                size='small'
                                onChange={e => setDuringStartTime(new Date(e.target.value))}/>
                        </WrapperDuring>
                        <WrapperDuring>
                            <TextField
                                sx={{mt: 2}}
                                fullWidth
                                InputLabelProps={{shrink: true, required: true}}
                                label={'End date'}
                                type='date'
                                id='end'
                                size='small'
                                onChange={e => setDuringEndTime(new Date(e.target.value))}/>
                        </WrapperDuring>
                        <ButtonMui
                            sx={{mt: 2}}
                            variant={'contained'}
                            endIcon={<FaFilter/>}
                            onClick={dateFormat}>Filter</ButtonMui>
                    </>

                }
            </ChartHeader>

            {
                checked ?
                    <Wrapper>
                        {
                            schools && <SchoolTabs load={load} schools={schools}/>
                        }

                    </Wrapper>
                    :
                    <Box sx={{width: "100%", height: "250px"}}>
                        <Skeleton animation="wave" height={"100%"}/>
                    </Box>
            }


        </Container>
    )
};




const WrapperDuring = styled.div`
    width: 235px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    ${extrasmall({
        marginTop: "5px"
    })}
`;




const Select = styled.select`
    width: 250px;
    height: 50px;
    background: white;
    padding-left: 5px;
    font-size: 14px;
    font-weight: bold;
    border-radius: 7px;
    cursor: pointer;
    border: 1px solid ${mainColor};
    color: ${mainColor};
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

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

`;




const Container = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 95%;
    margin-bottom: 50px !important;
    ${extrasmall({
        marginTop: " 10px",
    })}
`;


const ChartHeader = styled.div`
    margin-top: 10px;
    margin-bottom: 30px;
    width: 100%;
    display: grid;
    gap: 20px;
    grid-template-columns: 1fr 1fr 1fr;
    justify-items: center;
    ${large({
        gridTemplateColumns: '1fr 1fr'
    })}
    ${medium({
        gridTemplateColumns: '1fr 1fr'
    })}
    ${small({
        gridTemplateColumns: '1fr'
    })}
    ${extrasmall({
        gridTemplateColumns: '1fr '
    })}
`;


export default StackedBarChart;