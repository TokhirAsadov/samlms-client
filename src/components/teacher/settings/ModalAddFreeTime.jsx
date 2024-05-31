import React, {useState} from 'react';
import moment from "moment";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import axios from "axios";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";

const ModalAddFreeTime = ({open, handleClose,getData}) => {
    const educationYearId=useSelector(state => state.educationYear?.educationYear?.id)
    const [timesValue, setTimesValue] = useState({weekName: '', start: '', end: ''})
    const {headers} = getHeaders()

    function compareTimes(time1, time2) {
        function timeToMinutes(time) {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        }

        const minutes1 = timeToMinutes(time1);
        const minutes2 = timeToMinutes(time2);
        if (minutes1 < minutes2) {
            return true
        } else if (minutes1 > minutes2) {
            return false
        } else {
            return false;
        }
    }

    const getWeekDaysStartingFromMonday = () => {
        moment.locale('en');
        const weekDays = [];
        const currentDate = moment().startOf('isoWeek');
        for (let i = 0; i < 6; i++) {
            const dayName = currentDate.format('dddd');
            weekDays.push(dayName);
            currentDate.add(1, 'day');
        }
        return weekDays;
    };
    const handleCloseModal = () => {
        handleClose()
        setTimesValue({weekName: '', start: '', end: ''})
    }
    const checkSave = () => {
        return timesValue.start !== '' && timesValue.end !== '' && timesValue.weekName !== '' && compareTimes(timesValue.start, timesValue.end)
    }
    const handleSaveTimeData = () => {
        if (checkSave()) {
            console.log(timesValue)
            const body = {
                educationYearId,
                day: timesValue.weekName,
                schedule: `${timesValue.start}-${timesValue.end}`
            }
            axios.post(`${BASE_URL}/teachersFreeHours/createFreeHour`, body, {headers})
                .then(res => {
                    console.log(res)
                    toast.success('Success saved')
                    getData()
                    handleCloseModal()
                })
                .catch(err => {
                    toast.error('Error saving')
                })
        }

    }


    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Add Free Time
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" sx={{width: '320px', my: 2}}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Select week</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={timesValue.weekName}
                            label="Select week"
                            onChange={e => setTimesValue(prev => ({...prev, weekName: e.target.value}))}
                        >
                            {getWeekDaysStartingFromMonday().map(option => (
                                <MenuItem value={option} key={option}>{option}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Box sx={{display: 'flex', gap: '20px', mt: '20px'}}>
                        <TextField
                            label={'Start time'}
                            value={timesValue.start}
                            onChange={e => setTimesValue(prev => ({...prev, start: e.target.value}))}
                            type={'time'}
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            label={'End time'}
                            value={timesValue.end}
                            onChange={e => setTimesValue(prev => ({...prev, end: e.target.value}))}
                            type={'time'}
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Box>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant={'outlined'} onClick={handleCloseModal}>close</Button>
                <Button
                    disabled={!checkSave()}
                    variant={'contained'}
                    onClick={handleSaveTimeData} autoFocus>
                    save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ModalAddFreeTime;