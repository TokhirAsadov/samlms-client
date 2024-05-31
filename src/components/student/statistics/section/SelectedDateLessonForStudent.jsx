import React, {memo} from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Slide,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import styled from "styled-components";
import Button from "@mui/material/Button";
import EmptyDataImg from "../../../emptyDataImg/EmptyDataImg";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import moment from "moment/moment";
import {IoIosCheckmarkCircle, IoIosCloseCircle} from "react-icons/io";
import Spinner from "../../../spinner/Spinner";


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
const SelectedDateLessonForStudent = ({open, handleClose, data ,date,isLoad2}) => {

    const isComeLesson = (statistics) => {
        if (statistics.length === 0) {
            return <IoIosCloseCircle size={20} color={'red'} />;
        } else {
            const isDynamic = statistics.find(i => i.type === "DYNAMIC");
            if (isDynamic) {
                return isDynamic.isCome ? <IoIosCheckmarkCircle size={20} color={'yellow'} /> : <IoIosCloseCircle size={20} color={'yellow'} />;
            } else {
                return <IoIosCheckmarkCircle size={20} color={'green'} />;
            }

        }
    }
 const isComeLessonTime = (statistics) => {
        if (statistics.length === 0) {
            return '-';
        } else {
            const isDynamic = statistics.find(i => i.type === "DYNAMIC");
            if (isDynamic) {
                return isDynamic.isCome ? moment(isDynamic?.time).format('HH:mm') : '-';
            } else {
                return moment(statistics[0]?.time).format('HH:mm');
            }

        }
    }

    if (open)
        return (
            <Dialog
                open={open}
                maxWidth={'md'}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                component={DialogCom}
            >
                <DialogTitle id="alert-dialog-title">
                    {date.format('DD.MM.YYYY')}
                </DialogTitle>

                <DialogContent sx={{padding:'0 5px'}}>
                    <ThemeProvider theme={themeTable}>
                        <TableContainer component={Paper}>
                            <Table sx={{minWidth: 450}} aria-label="lesson of the selected day">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><b>Section </b></TableCell>
                                        <TableCell><b>Subjects </b></TableCell>
                                        <TableCell><b>Room</b></TableCell>
                                        <TableCell><b>Attendance</b></TableCell>
                                        <TableCell><b>Time</b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {!isLoad2 && data?.length !== 0 && data.map((row, rowIndex) => (
                                        <TableRow key={rowIndex}>
                                            <TableCell>{row?.section}</TableCell>
                                            <TableCell sx={{textAlign: 'start'}}>{row?.subject}</TableCell>
                                            <TableCell>{row?.room}</TableCell>
                                            <TableCell>{isComeLesson(row?.statistics)}</TableCell>
                                            <TableCell>{isComeLessonTime(row?.statistics)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </ThemeProvider>
                    {isLoad2 && <Spinner/>}
                    {!isLoad2 && data?.length === 0 && (
                        <EmptyDataImg w={200} h={180}/>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button size={'small'} variant={'outlined'} onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        );
};
const DialogCom = styled.div`
    .MuiPaper-root{
        width: calc(100% - 24px);
        max-height: calc(100% - 24px);
        margin: 0 auto;
    }
`;
export default memo(SelectedDateLessonForStudent);