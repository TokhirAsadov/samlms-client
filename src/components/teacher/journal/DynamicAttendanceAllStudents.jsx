import React, {memo, useEffect, useState} from 'react';
import {Dialog, DialogActions, DialogContent, DialogTitle, Slide} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {IoMdClose} from "react-icons/io";
import {FaCheck} from "react-icons/fa6";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import {toast} from "react-toastify";
import moment from "moment";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {
    changeAttendance2
} from "../../../redux/slice/allNbModalForTeacher/allNbModalForTeacher_slice";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});
const DynamicAttendanceAllStudents = ({dataForAttendance, groupId, subjectId, eduId, open, handleCloseModal}) => {
    const [isCome, setIsCome] = useState(null)
    const [sectionAndRoomData, setSectionAndRoomData] = useState([])
    const [sectionValue, setSectionValue] = useState('')
    const {headers} = getHeaders()
    const dispatch = useDispatch()
    const [isDisableBtnRed, setIsDisableBtnRed] = useState(false)
    const [nameIdDynamic, setNameIdDynamic] = useState(null)
    const dataAttendanceForSave = useSelector(state => state.AllNbStudentForTeacher?.dataAttendance?.attendances) || [];
    const dataCoreAttendance = useSelector(state => state.AllNbStudentForTeacher?.data) || [];
    const handleClose = () => {
        setIsCome(null)
        handleCloseModal()
    }
    const getSectionAndRoom = (eduId, groupId, subjectId, year, week, day) => {
        axios.get(`${BASE_URL}/groupConnect/getSectionsAndRooms/${eduId}/${groupId}?subjectId=${subjectId}&year=${year}&week=${week}&day=${day}`, {headers})
            .then(response => {
                setSectionAndRoomData(response.data[0])
                setSectionValue(dataForAttendance[0]?.room + ';' + dataForAttendance[0]?.section)
            })
            .catch(error => {
                console.log(error)
                setSectionAndRoomData([])
            })
    }
    const disableBtnAndActive = (section) => {
        if (section && dataForAttendance && dataForAttendance.length > 0) {
            console.log(dataForAttendance);
            const findSection = dataForAttendance?.find(sec => sec?.section === +(section))?.statistics;
            const findUserData = dataCoreAttendance?.find(u => u?.studentId === dataForAttendance[0]?.studentId)?.subjects?.find(s => s?.day === dataForAttendance[0]?.day &&
                s?.week === dataForAttendance[0]?.week &&
                s?.year === dataForAttendance[0]?.year &&
                s?.section === +(section))?.statistics;
            console.log(findUserData);
            const nameIdForPut = findSection?.find(item => item?.type === "DYNAMIC")?.nameId || null;
            setNameIdDynamic(nameIdForPut);
            setIsDisableBtnRed(() => {
                const d = findUserData?.find(item => item?.type === "DYNAMIC")?.isCome;
                if (d) {
                    return true;
                } else if (d === null) {
                    return null;
                } else if (d === undefined) {
                    if (findUserData?.length > 0) {
                        return true;
                    } else {
                        return false;
                    }
                }
            });
            setIsCome(() => {
                const changeData=dataAttendanceForSave?.find(s=>s?.studentId ===dataForAttendance[0]?.studentId && s?.section===+(section))?.isCome;
                if (typeof changeData === 'boolean') {
                    return changeData;
                }
                else {
                    return null;
                }
            })
        }
    };

    const handleChangeRed = () => {
        const [room, section] = sectionValue.split(";")
        const body = nameIdDynamic ? {
            id: nameIdDynamic,
            type: 'DYNAMIC',
            year: dataForAttendance[0]?.year,
            week: dataForAttendance[0]?.week,
            day: dataForAttendance[0]?.day,
            section: parseFloat(section),
            studentId: dataForAttendance[0]?.studentId,
            room,
        } : {
            id: null,
            type: 'DYNAMIC',
            year: dataForAttendance[0]?.year,
            week: dataForAttendance[0]?.week,
            day: dataForAttendance[0]?.day,
            section: parseFloat(section),
            studentId: dataForAttendance[0]?.studentId,
            room,
        }
        setIsCome(prev => {
            if (typeof prev === "boolean") {
                dispatch(changeAttendance2({...body, isCome: null}))
                return null
            } else {
                dispatch(changeAttendance2({...body, isCome: false}))
                return false
            }
        })
        handleClose()
    }
    const handleChangeGreen = () => {
        const [room, section] = sectionValue.split(";")
        const body = nameIdDynamic ? {
            id: nameIdDynamic,
            type: 'DYNAMIC',
            year: dataForAttendance[0]?.year,
            week: dataForAttendance[0]?.week,
            day: dataForAttendance[0]?.day,
            section: parseFloat(section),
            studentId: dataForAttendance[0]?.studentId,
            room,
        } : {
            id: null,
            type: 'DYNAMIC',
            year: dataForAttendance[0]?.year,
            week: dataForAttendance[0]?.week,
            day: dataForAttendance[0]?.day,
            section: parseFloat(section),
            studentId: dataForAttendance[0]?.studentId,
            room,
        }
        setIsCome(prev => {
            if (typeof prev === "boolean") {
                dispatch(changeAttendance2({...body, isCome: null}))
                return null
            } else {
                dispatch(changeAttendance2({...body, isCome: true}))
                return true
            }
        })
        handleClose()
    }
    const handleChangeSelected = (event) => {
        setSectionValue(event.target.value)
        setIsCome(null)
    }
    useEffect(() => {
        disableBtnAndActive(sectionValue?.split(";")[1])
    }, [sectionValue]);


    useEffect(() => {
        dataForAttendance && getSectionAndRoom(eduId, groupId, subjectId, dataForAttendance[0]?.year, dataForAttendance[0]?.week, dataForAttendance[0]?.day)
        disableBtnAndActive(sectionValue?.split(";")[1])
    }, [dataForAttendance]);

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
        >
            <DialogTitle
                sx={{pb: 0}}>Attendance {dataForAttendance && moment().day(dataForAttendance[0].day).week(dataForAttendance[0].week).year(dataForAttendance[0].year).format('DD.MM.YYYY')}</DialogTitle>
            <DialogContent sx={{
                width: 320,
            }}>
                <FormControl size="small" fullWidth sx={{mt: "20px"}}>
                    <InputLabel id="demo-simple-select-label">Section</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={sectionValue}
                        label="Section"
                        onChange={handleChangeSelected}
                    >
                        {sectionAndRoomData?.map((option, index) => (
                            <MenuItem key={index}
                                      value={option?.room + ";" + option?.section}>{option?.room}; {option?.section}-section</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Box sx={{display: 'flex', gap: 2, justifyContent: 'center', mt: 3}}>
                    <Button
                        //disabled={!isDisableBtnRed}
                        onClick={handleChangeRed}
                        variant={isCome == null ? 'outlined' : isCome ? 'outlined' : 'contained'}
                        color={'error'}
                    >
                        <IoMdClose size={25}/>
                    </Button>
                    <Button
                        //disabled={isDisableBtnRed}
                        onClick={handleChangeGreen}
                        variant={isCome == null ? 'outlined' : isCome ? 'contained' : 'outlined'}
                        color={'success'}
                    >
                        <FaCheck size={25}/>
                    </Button>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant={'outlined'} onClick={handleClose}>cancel</Button>

            </DialogActions>
        </Dialog>
    );
};

export default memo(DynamicAttendanceAllStudents);