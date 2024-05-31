import React, {memo, useEffect, useState} from 'react';
import {Dialog, DialogActions, DialogContent, DialogTitle, Slide} from "@mui/material";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import {toast} from "react-toastify";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const GradeAttendance = ({lessons, eduType, eduId, userId}) => {
    const [open, setOpen] = React.useState(false);
    const {headers} = getHeaders()
    const [groupsData, setGroupsData] = useState([])
    const [selectedLesson, setSelectedLesson] = useState('')
    const [selectedGroups, setSelectedGroups] = useState([])
    const [gradeValue, setGradeValue] = useState('')
    const [creditValue, setCreditValue] = useState('')

    const init = () => {
        setSelectedGroups([])
        setSelectedLesson('')
        setGradeValue('')
        setCreditValue('')
    }
    const getGroupsData = (scien, lessons, userId, eduType, eduId) => {
        scien && lessons?.some(l => l?.name === scien) && axios.get(`${BASE_URL}/groupConnect/groupsOfTeacher/${userId}?educationId=${eduId}&subjectId=${lessons?.find(l => l?.name === scien)?.id}&eduType=${eduType}`)
            .then((response) => {
                setGroupsData(response?.data?.obj);
            })
            .catch((err) => {
                console.log(err, "error getting")
                setGroupsData([])
            })
    }

    const handleClickOpen = () => {
        setOpen(true);
    };


    const handleClose = () => {
        setOpen(false);
        init()
    };
    const handleChangeSubject = (e) => {
        setSelectedLesson(e.target.value);
        setSelectedGroups([])
    }

    useEffect(() => {
        getGroupsData(selectedLesson, lessons, userId, eduType, eduId)
    }, [selectedLesson]);

    const handleSave = () => {
        const body = {
            educationYearId: eduId,
            lessonId: lessons?.find(l => l?.name === selectedLesson)?.id || '',
            groupsIds: selectedGroups.map(g => g.id),
            grade: gradeValue,
            credit:creditValue
        }
        if (body.lessonId !== '' && body.groupsIds.length !== 0 && body.grade !== '' && body.credit !== '') {
            if (parseInt(body.grade) <= 10) {
                console.log(body)
                axios.post(`${BASE_URL}/gradeForAttendance/create`, body, {headers})
                    .then(res => {
                        console.log(res)
                        toast.success(res.data.message)
                        handleClose()
                    })
                    .catch(err => {
                        console.log(err)
                        toast.error("Error")
                    })
            } else {
                toast.warning('maximum 10 points')
            }
        } else {
            toast.warning('Empty fields')
        }
    }
    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                Grade for attendance
            </Button>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
            >
                <DialogTitle>{" Grade for attendance"}</DialogTitle>
                <DialogContent>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        width: 340,
                        mt: 0.8,
                    }}>
                        <FormControl fullWidth size={'small'}>
                            <InputLabel id="fanselect">Subject</InputLabel>
                            <Select
                                labelId="fanselect"
                                id="demo-simple-select2"
                                value={selectedLesson}
                                label="Subject"
                                onChange={handleChangeSubject}
                            >
                                {lessons?.map((item, key) => (
                                    <MenuItem key={item?.id} value={item?.name}>{item?.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Autocomplete
                            size="small"
                            multiple
                            limitTags={2}
                            id="multiple-limit-tags"
                            value={selectedGroups}
                            options={groupsData}
                            getOptionLabel={(option) => option?.name || ''}
                            onChange={(event, newValue) => {
                                setSelectedGroups(newValue);
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Groups" placeholder="Favorites"/>
                            )}
                        />
                        <TextField
                            value={gradeValue}
                            onChange={e => setGradeValue(e.target.value)}
                            size={'small'}
                            label={'Grade'}
                            type={'number'}
                        />
                     <TextField
                            value={creditValue}
                            onChange={e => setCreditValue(e.target.value)}
                            size={'small'}
                            label={'Credit'}
                            type={'number'}
                        />
                    </Box>

                </DialogContent>
                <DialogActions>
                    <Button variant={'contained'} onClick={handleClose}>cancel</Button>
                    <Button variant={'outlined'} onClick={handleSave}>save</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default memo(GradeAttendance);