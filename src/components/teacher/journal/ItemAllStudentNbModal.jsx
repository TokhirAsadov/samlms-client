import React from 'react';
import moment from "moment/moment";
import Tooltip from "@mui/material/Tooltip";
import {useSelector} from "react-redux";
import {FaCheckSquare, FaWindowClose} from "react-icons/fa";
import Box from "@mui/material/Box";

function ItemAllStudentNbModal({data, day, time,setDataForAttendance,openModal}) {

    const currentDate = moment();
    const {subjects} = data
    const hours=useSelector(state => state.hourSection)
    const dataAttendanceForSave = useSelector(state => state.AllNbStudentForTeacher?.dataAttendance?.attendances) || [];

    const filterSubjectArr = subjects?.map(item => {
        const date = moment().year(item.year).week(item.week).day(item.day).format('DD.MM.YYYY');
        const hourStart = hours.find(h => h.number === item.section).start;
        return {...item, date, hourStart: moment(hourStart).format("HH:mm")}
    }).filter(item => moment(`${item.date} ${item.hourStart}`, 'DD.MM.YYYY HH:mm').isBefore(currentDate)).sort((a, b) => {
        const dateA = moment(`${a.date} ${a.hourStart}`, 'DD.MM.YYYY HH:mm');
        const dateB = moment(`${b.date} ${b.hourStart}`, 'DD.MM.YYYY HH:mm');
        return dateB.diff(dateA);
    });



    const ss = filterSubjectArr?.map((nb) => {
        if (moment(new Date(time.getFullYear(), time.getMonth(), day)).format("DD.MM.YYYY") === nb?.date) {
            return nb;
        } else {
            return ""
        }
    }).filter(t => typeof t === 'object')



    const handleClick = (value) => {
        setDataForAttendance(value)
        openModal()
    }
    function checkStatistic(arr) {
        const dynamicStatistic = arr?.find(statistic => statistic?.type === 'DYNAMIC');
        if (arr?.length ===0){
            return <FaWindowClose color={'#ff5c5c'}/>;
        }
        return dynamicStatistic ? (dynamicStatistic?.isCome ? <FaCheckSquare color={'#67fd59'} /> : <FaWindowClose color={'#f85e5e'} />) : <FaCheckSquare color={'#67fd59'}/>;
    }

    return (
        <>
            {ss.length !== 0 ? <Tooltip title={ss.map((s, i) => <Box key={i} sx={{display:'flex',gap:1,alignItems:'center'}}>
                <p>{s.section}-section</p>
                <p style={{marginTop:'3px'}} >{checkStatistic(s?.statistics)}</p>
            </Box>)} arrow>
                <td onClick={() => handleClick(ss)} style={{textAlign: "center",cursor:'pointer'}}>
                    {ss?.filter(c=>c?.statistics?.length===0 || c?.statistics?.find(f=>f?.type==='DYNAMIC')?.isCome===false)?.length}
                </td>
            </Tooltip> : <td></td>}
        </>
    );
}

export default ItemAllStudentNbModal;