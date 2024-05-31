import React, {memo, useEffect, useState} from 'react';
import {
    AppBar,
    Box,
    Dialog,
    IconButton,
    Paper,
    Slide,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material";
import {IoMdClose} from "react-icons/io";
import axios from "axios";
import moment from "moment";
import {BASE_URL, getHeaders} from "../../../../utills/ServiceUrls";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {RiCloseCircleFill} from "react-icons/ri";
import Button from "@mui/material/Button";
import ExportData from "./ExportData";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const themeTable = createTheme({
    components: {
        MuiTableCell: {
            styleOverrides: {
                root: {
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    border: "1px solid #ccc",
                    padding: '10px'
                },
            },
        },
    },
});

const AllScoreStudentsFullModal = (props) => {
    const {
        allScoreStudentsModal,
        setAllScoreStudentsModal,
        educationYearId,
        lessonId,
        groupId,
        groupName,
        allStudentData
    } = props;
    const {headers} = getHeaders();
    const [dataAllScore, setDataAllScore] = useState([]);

    const handleClose = () => {
        setAllScoreStudentsModal(false);
    };

    const getData = async () => {
        if (educationYearId && lessonId && groupId) {
            try {
                const response = await axios.get(`${BASE_URL}/themeOfSubjectForGrading/getTableOfGroup/${educationYearId}/${lessonId}?groupId=${groupId}`, {headers});
                setDataAllScore(response.data.obj);
            } catch (error) {
                console.error(error.response);
            }
        }
    };

    useEffect(() => {
        if (allScoreStudentsModal) {
            getData();
        }
    }, [allScoreStudentsModal]);

    const formatScore = (num) => parseFloat((num || 0)?.toFixed(3));

    const totalScore = (data, stId) => {
        const allDataStudents = data.map(st => st.students)?.flat()
        const findStudentAttendanceScore=allStudentData.find(student =>student.studentId === stId)?.allGradesForAttendance
        const filterStudent = allDataStudents.filter(scoreData => scoreData.studentId === stId)
        const totalScore = filterStudent.reduce((acc, curr) => acc + (Number(curr.grade) || 0), 0)+parseFloat(findStudentAttendanceScore?.toFixed(3));
        return parseFloat((totalScore).toFixed(3)) || 0;
    }

    return (
        <Dialog
            fullScreen
            open={allScoreStudentsModal}
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            <AppBar sx={{position: 'relative'}}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                        <IoMdClose/>
                    </IconButton>
                    <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                        Group: {groupName || ''}
                    </Typography>
                    <ExportData allStudentsData={allStudentData} dataAllScore={dataAllScore} groupName={groupName}/>
                </Toolbar>
            </AppBar>
            <Box sx={{
                p: 1,
            }}>
                <ThemeProvider theme={themeTable}>
                    <TableContainer component={Paper}>
                        <Table sx={{minWidth: 650}} aria-label="all score">
                            <TableHead>
                                <TableRow>
                                    <TableCell><b>№</b></TableCell>
                                    <TableCell><b>FULL NAME </b></TableCell>
                                    {dataAllScore.map((theme, index) => (
                                        <Tooltip key={index} title={`max score: ${theme.maxGrade}`} arrow>
                                            <TableCell><b>{theme.themeName}</b></TableCell>
                                        </Tooltip>
                                    ))}
                                    <Tooltip title={`max score: ${allStudentData[0]?.maxGradeForAttendance || 0}`} arrow>
                                        <TableCell sx={{background: 'rgba(0,0,0,0.02)'}}><b>ATTENDANCE</b> </TableCell>
                                    </Tooltip>
                                    <TableCell sx={{background: 'rgba(0,0,0,0.08)'}}><b>TOTAL</b> </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allStudentData.map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        <TableCell component="th" scope="row">{rowIndex + 1}</TableCell>
                                        <TableCell sx={{textAlign: 'start'}}>{row.fullName}</TableCell>
                                        {dataAllScore.map((theme, themeIndex) => {
                                            const userScoreItem = theme.students.find(student => student.studentId === row.studentId);
                                            return <Tooltip key={themeIndex}
                                                            title={userScoreItem && `${moment(userScoreItem.time).format('DD.MM.YYYY HH:mm')}`}
                                                            arrow>
                                                <TableCell>
                                                    {(() => {
                                                        return userScoreItem ? formatScore(userScoreItem.grade) :
                                                            <RiCloseCircleFill color={'red'} size={17}/>;
                                                    })()}
                                                </TableCell>
                                            </Tooltip>
                                        })}
                                        <TableCell sx={{background: 'rgba(0,0,0,0.02)'}}>
                                            {row?.allGradesForAttendance || 0}
                                        </TableCell>
                                        <TableCell sx={{background: 'rgba(0,0,0,0.08)'}}>
                                            {totalScore(dataAllScore, row?.studentId)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </ThemeProvider>
            </Box>
        </Dialog>
    );
};

export default memo(AllScoreStudentsFullModal);
