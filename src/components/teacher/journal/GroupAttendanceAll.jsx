import React, { memo, useState } from 'react';
import styled from "styled-components";
import Box from "@mui/material/Box";

const GroupAttendanceAll = ({ data }) => {

    const [toggle, setToggle] = useState(false);
    const countAttendances = {};
    data?.forEach(group => {
        group?.forEach(item => {
            if (item.statistics.length === 0 || item.statistics.find(st => st.type === 'DYNAMIC')?.isCome === false) {
                if (!countAttendances[item.section]) {
                    countAttendances[item.section] = 1;
                } else {
                    countAttendances[item.section]++;
                }
            }
        });
    });

    const attendanceArray = Object.entries(countAttendances).map(([section, attendance]) => ({
        section: parseInt(section),
        attendance: attendance
    }));

    const attendanceArray2 = attendanceArray.map(item => ({ ...item, attendance: data.length - item.attendance }));

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!toggle ? attendanceArray.map((attendance, index) => (
                <BoxNb key={index} onClick={() => setToggle(prev => !prev)} color={toggle ? 'green' : 'red'}>
                    {attendance.attendance}
                </BoxNb>
            )) : attendanceArray2.map((attendance, index) => (
                <BoxNb key={index} onClick={() => setToggle(prev => !prev)} color={toggle ? 'green' : 'red'}>
                    {attendance.attendance}
                </BoxNb>
            ))}
        </Box>
    );
};

const BoxNb = styled.div`
    margin: 0 auto;
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 5px;
    border: 1px solid transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    background-color: ${props => props.color};

    &:hover {
        transition: 0.3s;
        opacity: 0.8;
    }
`;

export default memo(GroupAttendanceAll);
