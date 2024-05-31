import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {extrasmall} from "../../../responsiv";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import axios from "axios";
import TeacherTimeTableOfWeek from "../../teacher/timeTable/TeacherTimeTableOfWeek";
import moment from "moment";
import 'moment/locale/ru';

const EducationalTeachers = () => {

    const [eduTypes, setEduTypes] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [selectEduTypeId, setSelectEduTypeId] = useState(null);
    const [selectTeacherId, setSelectTeacherId] = useState(null);
    const {headers} = getHeaders();

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [statistics, setStatistics] = useState(null);


    const getDaysOfWeek = (weekNumber, year) => {
        moment.locale('ru');
        const startDate = moment().year(year).isoWeek(weekNumber).startOf('isoWeek');
        const daysOfWeek = [];
        for (let i = 0; i < 6; i++) {
            daysOfWeek.push(startDate.clone().add(i, 'days').toDate());
        }
        return daysOfWeek;
    };
    const [objWeek, setObjWeek] = useState({
        date: moment().format('YYYY-[W]WW'),
        dateFrom: moment().startOf('isoWeek').toDate(),
        dateTo: moment().endOf('isoWeek').toDate(),
        weekNumber: moment().isoWeek(),
        daysOfWeek: getDaysOfWeek(moment().isoWeek(), moment().year()),
    });

    const onChange = (event) => {
        const date=event.target.value
        const weekNumber = moment(date).isoWeek();
        const dateFrom = moment(date).startOf('isoWeek').toDate();
        const dateTo = moment(date).endOf('isoWeek').toDate();
        const dateYear = moment(date).year()

        setObjWeek({
            date,
            dateFrom,
            dateTo,
            weekNumber,
            daysOfWeek: getDaysOfWeek(weekNumber, dateYear)
        })
    }

    useEffect(() => {
        fetchKafedra()
    }, [])

    const fetchKafedra = () => {
        axios.get(BASE_URL + "/kafedra/getKafedrasForSelect", {headers})
            .then(res => {
                setEduTypes(res?.data?.obj)
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        selectEduTypeId && axios.get(BASE_URL + "/kafedra/getTeachersForSelectByKafedraId?kafedraId=" + selectEduTypeId, {headers})
            .then(res => {
                setTeachers(res?.data?.obj)
            })
            .catch(err => {
                console.log(err)
            })
    }, [selectEduTypeId])

    useEffect(() => {

        setIsLoading(true)
        selectTeacherId && axios.get(BASE_URL + "/timeTableByWeekOfYear/getTeacherTimeTable?t=" + selectTeacherId + "&week=" + objWeek?.weekNumber + "&year=" + moment(objWeek?.date).format("YYYY"), {headers})
            .then(res => {
                const resultData = res?.data?.obj

                const convertDate = [];

                const showGroups = {};

                resultData?.forEach((item) => {
                    item.shows.forEach((show) => {
                        const key = show.daysName;
                        if (!showGroups[key]) {
                            showGroups[key] = {
                                teacherData: item.teacherData,
                                shows: [],
                            };
                        }
                        showGroups[key].shows.push(show);
                    });
                });

                for (const key in showGroups) {
                    convertDate.push(showGroups[key]);
                }

                console.log(convertDate);
                setData(convertDate)
                setIsLoading(false)
            })
            .catch(err => {
                console.log(err)
            })

        selectTeacherId != null && fetchStatistics(selectTeacherId);

    }, [selectTeacherId, objWeek])

    const fetchStatistics = (teacherId) => {

        axios.get(BASE_URL + "/user/getTeacherStatisticsForTimeTableByWeek?teacherId=" + teacherId + "&week=" + objWeek?.weekNumber + "&year=" + moment(objWeek?.date).format("YYYY"), {headers})
            .then(res => {
                setStatistics(res?.data?.obj);

            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <Container>
            <Wrapperinput>
                <Selectbox>

                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={eduTypes}
                        onChange={(event, newValue) => {
                            setSelectEduTypeId(newValue?.value)
                        }}

                        sx={{width: 300}}
                        renderInput={(params) => <TextField {...params} label="Kafedra"/>}
                    />
                </Selectbox>
                <Selectbox>

                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={teachers}
                        onChange={(event, newValue) => {

                            setSelectTeacherId(newValue?.value)
                        }}

                        sx={{width: 300}}
                        renderInput={(params) => <TextField {...params} label="Teacher"/>}
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
            {selectTeacherId &&
                <TeacherTimeTableOfWeek isLoading={isLoading} obj={objWeek} data={data} statistics={statistics}/>}
        </Container>
    );
};


const Selectbox = styled.div`
    width: 300px;
    ${extrasmall({
        width: "80%"
    })}
`
const Wrapperinput = styled.div`

    padding: 10px 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 25px;
    overflow: hidden;
    margin: 15px 15px 0;

    ${extrasmall({
        margin: "15px 0 0 0",
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


export default EducationalTeachers;