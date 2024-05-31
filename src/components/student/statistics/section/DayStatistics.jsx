import React, {useEffect, useState} from 'react';
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {Card, CardContent, Stack, TextField} from "@mui/material";
import moment from "moment";
import axios from "axios";
import {BASE_URL, getHeaders} from "../../../../utills/ServiceUrls";
import {useSelector} from "react-redux";
import styled from "styled-components";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {extrasmall} from "../../../../responsiv";
import Spinner from "../../../spinner/Spinner";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import SelectedDateLessonForStudent from "./SelectedDateLessonForStudent";

const DayStatistics = ({setSelectedSection}) => {
    const groupId = useSelector(state => state.student.student.groupData?.id)
    const eduId = useSelector(state => state.educationYear?.educationYear?.id)
    const [calendarValue, setCalendarValue] = useState(moment())
    const [data, setData] = useState(null)
    const [isLoad, setIsLoad] = useState(false)
    const navigate = useNavigate()
    const [modalSelectedDayLesson, setModalSelectedDayLesson] = useState(false)

    const getMonitoringForStudent = (groupId, eduId, date) => {
        setIsLoad(true)
        axios.get(`${BASE_URL}/student/monitoring/${groupId}/${eduId}?year=${date.year()}&week=${date.week()}&day=${date.day()}`, getHeaders())
            .then(response => {
                console.log(response.data.obj)
                setData(response.data.obj)
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => {
                setIsLoad(false)
            })
    }
    useEffect(() => {
        getMonitoringForStudent(groupId, eduId, calendarValue)
    }, [calendarValue]);
    return (
        <div style={{marginTop: '1rem'}}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                    label="Date"
                    value={calendarValue}
                    onChange={(newValue) => setCalendarValue(newValue)}
                    renderInput={(props) => <TextField {...props} size={'small'} sx={{backgroundColor: '#fff'}}/>}
                    shouldDisableDate={(date) => date >= new Date()}
                />
            </LocalizationProvider>
            {isLoad && <Spinner/>}
            {!isLoad && <WrappingBox>
                <Card>
                    <CardContent sx={{paddingBottom: '16px !important'}}>
                        <Typography>
                            <b>{calendarValue.format('DD.MM.YYYY')}</b>
                        </Typography>
                        <Box sx={{marginTop: '20px'}}>
                            <Box sx={{display: 'flex', gap: '20px'}}>
                                <BoxData bg={'#00bd00'}>
                                    attended the lesson:<b> {data?.studentMonitoringByDay?.split('/')[1]}</b>
                                </BoxData>
                                <BoxData bg={'#ff5454'}>
                                    didn't attend lesson:<b> {data?.studentMonitoringByDay?.split('/')[2]}</b>
                                </BoxData>
                            </Box>
                            <BoxData bg={'#5f67ff'} style={{marginTop: '20px'}}>
                                total:<b> {data?.studentMonitoringByDay?.split('/')[0]}</b>
                            </BoxData>
                        </Box>
                        <Box sx={{display: 'flex', justifyContent: 'end'}}>
                            <Button onClick={() => setModalSelectedDayLesson(true)} variant={'outlined'}
                                    sx={{mt: '10px'}}>more</Button>
                        </Box>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent sx={{paddingBottom: '16px !important'}}>
                        <Typography>
                            <b> Week:{calendarValue.week()}</b>
                        </Typography>
                        <Box sx={{marginTop: '20px'}}>
                            <Box sx={{display: 'flex', gap: '20px'}}>
                                <BoxData bg={'#00bd00'}>
                                    attended the lesson: <b>{data?.studentMonitoringByWeek?.split('/')[1]}</b>
                                </BoxData>
                                <BoxData bg={'#ff5454'}>
                                    didn't attend classes:<b> {data?.studentMonitoringByWeek?.split('/')[2]}</b>
                                </BoxData>
                            </Box>
                            <BoxData bg={'#5f67ff'} style={{marginTop: '20px'}}>
                                total:<b> {data?.studentMonitoringByWeek?.split('/')[0]}</b>
                            </BoxData>
                        </Box>
                        <Box sx={{display: 'flex', justifyContent: 'end'}}>
                            <Button onClick={() =>setSelectedSection('week')} variant={'outlined'}
                                    sx={{mt: '10px'}}>more</Button>
                        </Box>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Typography>
                            <b> Education semester </b>
                        </Typography>
                        <Box sx={{marginTop: '20px'}}>
                            <Box sx={{display: 'flex', gap: '20px'}}>
                                <BoxData bg={'#00bd00'}>
                                    attended the lesson: <b>{data?.studentMonitoringByEducationYear?.split('/')[1]}</b>
                                </BoxData>
                                <BoxData bg={'#ff5454'}>
                                    didn't attend classes:<b> {data?.studentMonitoringByEducationYear?.split('/')[2]}</b>
                                </BoxData>
                            </Box>
                            <BoxData bg={'#5f67ff'} style={{marginTop: '20px'}}>
                                total:<b> {data?.studentMonitoringByEducationYear?.split('/')[0]}</b>
                            </BoxData>
                        </Box>
                        <Box sx={{display: 'flex', justifyContent: 'end'}}>
                            <Button onClick={() =>setSelectedSection('semester')} variant={'outlined'}
                                    sx={{mt: '10px'}}>more</Button>
                        </Box>
                    </CardContent>
                </Card>
            </WrappingBox>}

            <SelectedDateLessonForStudent
                date={calendarValue}
                open={modalSelectedDayLesson}
                handleClose={() => setModalSelectedDayLesson(false)}
                data={data?.timeTableOfToday}
            />
        </div>
    );
};

const BoxData = styled.div`
    width: 100%;
    height: 50px;
    font-size: 14px;
    padding: 5px;
    border-radius: 5px;
    background-color: ${props => props.bg};
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
`
const WrappingBox = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
    margin-top: 1rem;
    ${extrasmall({
        gridTemplateColumns: "1fr",
    })}
`

export default DayStatistics;