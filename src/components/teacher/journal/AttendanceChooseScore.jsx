import React, {memo, useEffect, useState} from 'react';
import axios from "axios";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import {
    Badge,
    Card,
    CardContent,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import moment from "moment";
import styled from "styled-components";
import Typography from "@mui/material/Typography";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {IoIosCheckmarkCircle, IoIosCloseCircle} from "react-icons/io";
import Spinner from "../../spinner/Spinner";
const themeTable = createTheme({
    components: {
        MuiTableCell: {
            styleOverrides: {
                root: {
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    border: "1px solid #ccc",
                    padding: '8px'
                },
            },
        },
    },
});
const AttendanceChooseScore = ({data,load}) => {


    const formatDate = (year, week, day) => moment().year(year).isoWeek(week).day(day);

    const isComeLesson = (statistics,date) => {

        if (moment(date).valueOf()>moment().valueOf()) {
            return '';
        }
        if (statistics.length === 0) {
            return <IoIosCloseCircle size={23} color={'#ff0000'} />;
        } else {
            const isDynamic = statistics.find(i => i.type === "DYNAMIC");
            if (isDynamic) {
                return isDynamic.isCome ? <IoIosCheckmarkCircle size={23} color={'#caca00'} /> : <IoIosCloseCircle size={23} color={'#caca00'} />;
            } else {
                return <IoIosCheckmarkCircle size={23} color={'#008000'} />;
            }

        }
    }
    return (
                <ThemeProvider theme={themeTable}>
                    <TableContainer component={Paper} sx={{maxHeight:300}}>
                        <Table stickyHeader  sx={{minWidth: 300}} >
                            <TableHead>
                                <TableRow>
                                    <TableCell><b>№</b></TableCell>
                                    <TableCell><b>Date </b></TableCell>
                                    <TableCell><b>Section </b></TableCell>
                                    <TableCell><b>Room</b></TableCell>
                                    <TableCell><b>Attendance</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {!load && data?.length !== 0 && data.map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        <TableCell>{rowIndex+1}</TableCell>
                                        <TableCell>{formatDate(row.year, row.week, row.day).format('DD.MM.YYYY')}</TableCell>
                                        <TableCell>{row?.section}</TableCell>
                                        <TableCell>{row?.room}</TableCell>
                                        <TableCell>{isComeLesson(row?.statistics,formatDate(row.year, row.week, row.day))}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {load && <Spinner/>}
                    </TableContainer>

                </ThemeProvider>
    );
};


export default memo(AttendanceChooseScore);