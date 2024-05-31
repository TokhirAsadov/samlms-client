import React, {memo, useEffect, useState} from 'react';
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {CalendarPicker, PickersDay} from '@mui/x-date-pickers';
import {Card} from "@mui/material";
import axios from "axios";
import moment from "moment";
import {useSelector} from "react-redux";
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {RiCloseLine} from "react-icons/ri";
import EnterAndOutTimesOfTeacher from "../../userStatistics/EnterAndOutTimesOfTeacher";
import styled from "styled-components";
import {extrasmall, medium, small} from "../../../responsiv";

const StatisticsMonthUser = () => {
    const userId = useSelector(state => state.user.user.id);
    const [data, setData] = useState(null);
    const [selectDate, setSelectDate] = useState(moment());
    const {headers} = getHeaders();
    const [selectedDayData, setSelectedDayData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [timeModal, setTimeModal] = useState(null);

    const handleClose = () => {
        setOpen(false);
    }
    const handleDay = (valDay) => {
        data && setSelectedDayData(Object.values(data?.obj).find(item => item.day === valDay.format('D')));
        setTimeModal(valDay)
        setOpen(true);
    };

    const handleDateChange = (newDate) => {
        setSelectDate(newDate);
    };

    const getData = async (id) => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/kafera-mudiri/getStatisticss?userId=${id}&date=${selectDate.format('YYYY.MM.DD')}`, {headers});
            const resData = res.data;
            const formattedData = {
                id: resData.obj?.id,
                date: resData.obj?.date,
                obj: Object.fromEntries(
                    Object.entries(resData?.obj)
                        .filter(([key]) => key !== 'id' && key !== 'date')
                        .map(([key, value]) => [key, {...value, day: key}])
                ),
            };
            setData(formattedData);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        userId && getData(userId);
    }, [selectDate, userId]);

    const isDateArrived = (date) => {
        const currentDate = new Date().getTime();
        const dayKey = date?.valueOf();
        if (data && moment(selectDate).format('MM') === date.format('MM')) {
            if (currentDate <= dayKey) {
                return 'empty';
            } else {
                const isCome = Object.values(data?.obj).some((item) => {
                    if (item.timeAsc) {
                        return moment(item.timeAsc).format('DD.MM.YYYY') === date.format('DD.MM.YYYY');
                    } else {
                        return false;
                    }
                });
                return isCome;
            }
        }

        return 'empty';
    };

    const handleMonthChange = (newMonth) => {
        setSelectDate(newMonth);
    };

    const renderDayStyles = (isArrived) => ({
        backgroundColor: isArrived === true ? 'green' : isArrived === false ? 'red' : null,
        color: isArrived === true ? '#FFF' : isArrived === false ? '#FFF' : null,
        '&:hover': {
            opacity: '0.5',
            backgroundColor: isArrived === true ? 'green' : isArrived === false ? 'red' : null,
        },
        '&:focus': {
            opacity: '0.5',
            backgroundColor: isArrived === true ? 'green' : isArrived === false ? 'red' : null,
        }
    });

    const renderDay = (date) => {
        const isArrived = isDateArrived(date);
        const disabled = isArrived === 'empty';

        return (
            <PickersDay
                sx={renderDayStyles(isArrived)}
                day={date}
                key={date}
                outsideCurrentMonth={!date.isSame((selectDate), 'month')}
                disabled={disabled}
                onDaySelect={(valDay) => handleDay(valDay)}
            />
        );
    };

    return (
        <Card sx={{width: '340px'}}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <CalendarPicker
                    loading={isLoading}
                    onMonthChange={handleMonthChange}
                    onChange={handleDateChange}
                    renderDay={renderDay}
                />
            </LocalizationProvider>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={styleTable} component={Stylemodal}>
                    <CloseMyButtonForChild onClick={handleClose}><RiCloseLine/></CloseMyButtonForChild>
                    <EnterAndOutTimesOfTeacher time={timeModal} item={selectedDayData}/>
                </Box>
            </Modal>

        </Card>
    );
};
const CloseMyButtonForChild = styled.button`
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    color: ${mainColor};
    font-size: 26px;
    border: none;
    position: absolute;
    top: 10px;
    right: 10px;
`;
const styleTable = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "50vw",
    minHeight: "50vh",
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 3,
    p: 4,
};

const Stylemodal = styled.div`
    ${medium({
        width: "70vw !important",
    })}
    ${small({
        width: "70vw !important",
    })}
    ${extrasmall({
        width: "90vw !important",
        minHeight: "70vh !important",
    })}
`
export default memo(StatisticsMonthUser);
