import React, {memo, useEffect, useState} from 'react';
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment/moment";
import styled from "styled-components";
import {CalendarPicker, PickersDay} from "@mui/x-date-pickers";
import axios from "axios";
import {BASE_URL, getHeaders} from "../../../../utills/ServiceUrls";
import {useSelector} from "react-redux";
import Box from "@mui/material/Box";
import {Card, CardContent} from "@mui/material";
import Typography from "@mui/material/Typography";
import SelectedDateLessonForStudent from "./SelectedDateLessonForStudent";
import Spinner from "../../../spinner/Spinner";


const StyledCalendarPicker = styled(CalendarPicker)`
    && {
        overflow-x: inherit;
        width: 100%;
        max-height: none;
      

        .MuiDayPicker-header {
            display: grid;
            grid-template-columns: repeat(7, 1fr);

            .MuiTypography-root {
                border: 1px solid #a3a3a3;
                width: 100%;
                margin: 0;
            }
        }

        .PrivatePickersSlideTransition-root {
            overflow-x: inherit;

            .MuiDayPicker-monthContainer {
                position: inherit;
            }

            .MuiDayPicker-weekContainer {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                overflow-x: inherit;
                margin: 0;

                .MuiButtonBase-root {
                    width: 100%;
                    border-radius: 0;
                    border: 1px solid #ccc;
                    margin: 0;
                    min-height: 100px;
                }
            }
        }

    }
`;
const MonthStatistics = () => {
    const [dateValueDay, setDateValueDay] = useState(moment());
    const [dateValueMonth, setDateValueMonth] = useState(moment());
    const groupId = useSelector(state => state.student.student.groupData?.id)
    const [data, setData] = useState([])
    const [monthStatistics, setMonthStatistics] = useState(null)
    const [isLoad, setIsLoad] = useState(false)
    const [isLoad2, setIsLoad2] = useState(false)
    const [clickDay, setClickDay] = useState(false)
    const [selectedDayDate, setSelectedDayDate] = useState([])
    const handleMonthChange = (newMonth) => {
        setDateValueMonth(newMonth);
    };
    const handleDateChange = (newDate) => {
        setDateValueDay(newDate);
    };


    const getMonthStatistics = (groupId, date) => {
        setIsLoad(true)
        axios.get(`${BASE_URL}/student/monitoringByMonth/${groupId}?month=${date.format('YYYY-MM-01')}`, getHeaders())
            .then(res => {

                setData(res.data)
                setMonthStatistics(res.data.map(i => i?.studentMonitoringByDay?.split('/'))?.reduce((acc, subarray) => {
                    subarray.forEach((value, index) => {
                        acc[index] = (acc[index] || 0) + Number(value);
                    });
                    return acc;
                }, []))
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setIsLoad(false)
            })
    }
    const getDayStatistics = (groupId, date) => {
        setIsLoad2(true)
        date && axios.get(`${BASE_URL}/student/monitoringWithTimeTableByDay/${groupId}?year=${date.year()}&week=${date.week()}&day=${date.day()}`, getHeaders())
            .then(res => {
                console.log(res.data)
                setSelectedDayDate(res.data)
            })
            .catch(err => {
                console.log(err)
            })
            .finally(()=>{
                setIsLoad2(false)
            })
    }
    useEffect(() => {
        getMonthStatistics(groupId, dateValueMonth)
    }, [dateValueMonth]);
    const handleClickDayCalendar = (valDay) => {
        setClickDay(true)
        setDateValueDay(valDay)
        getDayStatistics(groupId, valDay)

    }
    const renderDay = (date) => {
        if (!isLoad) {
            const findData = data?.find(item => moment(item.date).format('DD.MM') === date.format('DD.MM'));
            const splitData = findData?.studentMonitoringByDay?.split('/');
            if (findData) {
                return (
                    <PickersDay
                        day={date}
                        key={date}
                        outsideCurrentMonth={!date.isSame(dateValueMonth, 'month')}
                        onDaySelect={handleClickDayCalendar}
                    >
                        <DayBox>
                            {date.format('DD')}
                        </DayBox>
                        {moment().valueOf() >= moment(findData?.date).valueOf() && <Box sx={{
                            width: '60px',
                            display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 0.2
                        }}>
                            <BoxData bg={'#5f67ff'}>
                                {splitData[0] || 0}
                            </BoxData>
                            <Box sx={{display: 'flex', width: '60px', justifyContent: 'center', gap: 0.2,}}>
                                <BoxData bg={'#00bd00'}>
                                    {splitData[1] || 0}
                                </BoxData>
                                <BoxData bg={'#ff3737'}>
                                    {splitData[2] || 0}
                                </BoxData>
                            </Box>

                        </Box>}

                    </PickersDay>
                );


            } else {
                return (
                    <PickersDay
                        day={date}
                        key={date}
                        outsideCurrentMonth={!date.isSame((dateValueDay), 'month')}
                        onDaySelect={(valDay) => console.log(valDay)}
                    >
                        <DayBox>
                            {date.format('DD')}
                        </DayBox>
                    </PickersDay>
                );
            }
        }
    };
    return (
        <>
            <Card sx={{m:'20px 0'}}>
                <CardContent>
                    <LocalizationProvider adapterLocale={'en'} dateAdapter={AdapterMoment}>
                        <StyledCalendarPicker
                            loading={isLoad}
                            renderLoading={() => <Spinner/>}
                            date={dateValueDay}
                            onMonthChange={handleMonthChange}
                            onChange={handleDateChange}
                            renderDay={renderDay}
                        />
                    </LocalizationProvider>
                </CardContent>
            </Card>

            <Card sx={{width: 360}}>
                <CardContent sx={{paddingBottom: '16px !important'}}>
                    <Typography>
                        <b>Month: {dateValueDay.format('MMMM')}</b>
                    </Typography>
                    <Box sx={{marginTop: '20px'}}>
                        <Box sx={{display: 'flex', gap: '20px'}}>
                            <BoxData2 bg={'#00bd00'}>
                                attended the lesson: <b>{monthStatistics && monthStatistics[1] || 0}</b>
                            </BoxData2>
                            <BoxData2 bg={'#ff5454'}>
                                didn't attend classes:<b> {monthStatistics && monthStatistics[2] || 0}</b>
                            </BoxData2>
                        </Box>
                        <BoxData2 bg={'#5f67ff'} style={{marginTop: '20px'}}>
                            total:<b>{monthStatistics && monthStatistics[0] || 0}</b>
                        </BoxData2>
                    </Box>

                </CardContent>
            </Card>
            <SelectedDateLessonForStudent
                isLoad2={isLoad2}
                date={dateValueDay}
                open={clickDay}
                handleClose={() => setClickDay(false)}
                data={selectedDayDate}
            />
        </>
    );
};

const BoxData2 = styled.div`
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
const DayBox = styled.div`
    position: absolute;
    top: 5px;
    left: 5px;
    border-radius: 100%;
    width: 30px;
    height: 30px;
    background: silver;
    display: flex;
    justify-content: center;
    align-items: center;

`
const BoxData = styled.div`
    width: 100%;
    height: 30px;
    display: flex;
    border-radius: 4px;
    color: #ffffff;
    align-items: center;
    justify-content: center;
    background: ${props => props.bg};
`
export default memo(MonthStatistics);