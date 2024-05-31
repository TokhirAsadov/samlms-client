import React, {memo, useState} from 'react';
import styled from "styled-components";
import moment from "moment";
import Box from "@mui/material/Box";
import PdfTabel from "../../utills/pdfFiles/PdfTabel";
import {useSelector} from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import EmptyDataImg from "../../components/emptyDataImg/EmptyDataImg";
import ModalChangeDay from "./ModalChangeDay";
import {mainColor} from "../../utills/ServiceUrls";


const DataTable = memo((departmentId) => {

    const {data, isLoading, isError} = useSelector(state => state.tableData);
    const [selectedDay, setSelectedDay] = useState({
        personId: '',
        day: '',
        hourValue:''
    })
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const getSundayInMonth = (date) => {
        const targetDate = moment(date);
        const targetMonth = targetDate.month();
        const targetYear = targetDate.year();
        const lastDayOfMonth = targetDate.endOf('month').format('D');
        const sundaysArray = [];

        const firstDayOfMonth = moment({year: targetYear, month: targetMonth});
        let firstSunday = null;

        for (let day = 0; day < firstDayOfMonth.daysInMonth(); day++) {
            const currentDay = firstDayOfMonth.clone().startOf('isoWeek').add(day, 'days');
            if (currentDay.month() === targetMonth && currentDay.isoWeekday() === 7) {
                firstSunday = parseInt(currentDay.format('D'));
                break;
            }
        }

        if (firstSunday !== null) {
            sundaysArray.push(...Array.from({length: Math.ceil((lastDayOfMonth - firstSunday + 1) / 7)}, (_, index) => firstSunday + index * 7));
        }

        return sundaysArray;
    };

    const sundaysInMonth = getSundayInMonth(data[0]?.date);
    function abbreviateMiddleNames(name) {
        const words = name.split(' ').slice(0,3);
        if (words.length > 1) {
            const sliceWord = words.map((item, index) => {
                if (index > 0) {
                    if(item){
                        if((item[0]=='S' && item[1]=='H') || (item[0]=='C' && item[1]=='H') ){
                            return item[0]+item[1]+"."
                        }
                        return item[0]+".";
                    }
                } else {
                    return item;
                }
            }).filter(Boolean).join(" ");
            return sliceWord;
        } else {
            return name;
        }
    }

    const workHours = (arr) => {
        const filterArr = arr.filter(item => typeof item?.hourValue === "number" && item?.hourValue !== 0);
        const summHours = filterArr?.reduce((prev, curr) => {
            return { hourValue: (prev?.hourValue || 0) + curr?.hourValue };
        }, { hourValue: 0 });

        return summHours?.hourValue || 0;
    };


    const handleClickDay = (person, day) => {
        if (!sundaysInMonth.includes(day.day)){
            handleOpen()
            setSelectedDay({personId: person.id, day: day.day,hourValue: day.hourValue})
        }
    }

    return (
        <Container>
            {!isLoading ? (
                !isError ? (
                    data.length > 0 ? <>
                        <table>
                            <thead>
                            <tr>
                                <th rowSpan={2}>№</th>
                                <th rowSpan={2}>F.I.O</th>
                                <th rowSpan={2}>Position</th>
                                <th colSpan={data[0]?.monthly?.length}>Attendance and absence notes by day of the
                                    month
                                </th>
                                <th colSpan={2}>Worked for the month</th>
                            </tr>
                            <tr>
                                {data[0]?.monthly?.map((item) => (
                                    <td style={{minWidth: 25}} key={item?.day}>{item?.day}</td>
                                ))}
                                <td>days</td>
                                <td>hours</td>
                            </tr>
                            </thead>
                            <tbody>
                            {data?.map((person, index) => (
                                <tr key={index}>
                                    <th>{index + 1}</th>
                                    <th style={{textAlign: 'start'}}>{abbreviateMiddleNames(person?.fullName?.toUpperCase())}</th>
                                    <th>{person?.userPosition?.label} {person?.rate ? `(${person?.rate})` : ''}</th>
                                    {person?.monthly?.map((item) => (
                                        <td
                                            style={{
                                                background: (item?.hourValue ===0 || typeof item?.hourValue==='string') && `rgba(255, 0, 0, 0.8)`,
                                                color:(item?.hourValue ===0 || typeof item?.hourValue==='string') && `#FFF`
                                            }}
                                            key={item?.day}
                                            className={'td_item'}
                                            onClick={() => handleClickDay(person, item)}
                                        >
                                            {item?.hourValue}
                                        </td>
                                    ))}
                                    <td>
                                        {person?.monthly?.filter(item => typeof item?.hourValue === "number" && item?.hourValue !== 0 )?.length}
                                    </td>
                                    <td>
                                        {workHours(person?.monthly)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <Box sx={{mt: '1.5rem', display: 'flex', justifyContent: 'end', gap: '1.5rem'}}>
                            <PdfTabel
                                departmentId={departmentId}
                                data={data}
                            />
                        </Box>
                    </> : (
                        <EmptyDataImg w={200} h={180}/>
                    )
                ) : (
                    <h4>error</h4>
                )
            ) : (
                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <CircularProgress/>
                </Box>
            )}
            <ModalChangeDay
                selectedDay={selectedDay}
                open={open}
                handleClose={handleClose}
            />
        </Container>
    );
});

const Container = styled.div`

    table {
        min-width: 900px;
        border-collapse: collapse;
        width: 100%;
        font-size: 10px;
        font-weight: bold;
        overflow: hidden;

        td, th {
            border: 1px solid #bebcbc;
            padding: 7px;
            font-size: 12px;
            text-align: center;
        }

        th {
            background: ${mainColor};
        }
    }

    .td_item {
        &:hover {
            background-color: rgba(0, 0, 0, 0.25)!important;
            cursor: pointer;
        }
    }

`
export default DataTable;