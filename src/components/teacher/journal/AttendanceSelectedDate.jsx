import React, {memo} from 'react';
import styled from "styled-components";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import {AiFillCheckCircle, AiFillCloseCircle} from "react-icons/ai";
import moment from "moment";
import {Skeleton, Zoom} from "@mui/material";
import {useSelector} from "react-redux";

const AttendanceSelectedDate = ({data, loadForCalendar, handleMenuAttClick, setDataForChangeAttendance, data2}) => {

    const saveForDataAttendance = useSelector(state => state.attendanceForJournal)

    function findMinTime(arr) {
        const filteredArr = arr.filter(obj => obj.hasOwnProperty('time'));

        if (filteredArr.length === 0) {
            return null;
        }
        const minTime = Math.min(...filteredArr.map(obj => obj.time));

        return minTime;
    }

    const isComeLesson = (arr,studentId,section) => {

        const student = saveForDataAttendance.attendances.find(st => st.studentId ===studentId && st.section === section)
        if (student) {
            return student.isCome
        } else if (arr?.length === 0) {
            return false
        } else {
            const isDynamic = arr.find(i => i.type === "DYNAMIC")
            if (isDynamic) {
                return isDynamic.isCome
            }
            return true
        }
    }
    const isComeTime = (isCome, arr) => {
        if (isCome) {
            const isDynamic = arr?.statistics?.find(i => i.type === "DYNAMIC")
            if (isDynamic) {
                return (<Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 0.5
                }}>
                    <p>section-{isDynamic?.section}</p>
                    <p>{arr?.room}</p>
                    <p>{moment(isDynamic.time).format('HH:mm')}</p>
                </Box>)

            }
            return (<Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 0.5
            }}>
                <p>section-{arr.statistics[0]?.section}</p>
                <p>{arr?.room}</p>
                <p>{moment(findMinTime(arr?.statistics)).format('HH:mm')}</p>
            </Box>)
        }
        return '';
    }


    const handleClickBtn = (event, item, isComeData) => {
        handleMenuAttClick(event)
        const dataChange = {
            id: item?.statistics?.find(st => st?.type === 'DYNAMIC')?.nameId || null,
            year: item.year,
            week: item.week,
            day: item.day,
            studentId: item.studentId,
            subjectId: data2.subjectId,
            educationId: data2.educationId,
            groupId: data2.groupId,
            room: item.room,
            section: item.section,
            isComeData
        }
        setDataForChangeAttendance(dataChange)
        console.log(dataChange)
    }
    return (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
            {loadForCalendar ?
                <Skeleton width={60} height={50} sx={{margin: '0 auto'}}/>
                :
                data?.map((item, index) => (
                    <Tooltip
                        key={index}
                        TransitionComponent={Zoom}
                        title={isComeTime(isComeLesson(item?.statistics), item)}
                        arrow
                        placement="right"
                    >
                        <BoxNb onClick={(event) => handleClickBtn(event, item, isComeLesson(item?.statistics))}
                               color={isComeLesson(item?.statistics,item.studentId,item.section) ? "green" : "red"}>
                            {isComeLesson(item?.statistics,item.studentId,item.section) ? <AiFillCheckCircle size={22}/> : <AiFillCloseCircle size={22}/>}
                        </BoxNb>
                    </Tooltip>
                ))}

        </Box>
    );
};

const BoxNb = styled.div`
    margin: 0 auto;
    width: 40px;
    height: 40px;
    border-radius: 5px;
    border: 1px solid #a6a6e0;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: ${props => props.color ? props.color : "#000"};
    &:hover {
        background-color: rgba(0, 0, 0, 0.2);
    }
`;

export default memo(AttendanceSelectedDate);