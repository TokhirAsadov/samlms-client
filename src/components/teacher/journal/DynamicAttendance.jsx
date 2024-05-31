import React, {memo, useEffect, useState} from 'react';
import {Dialog, DialogContent, DialogTitle, Slide} from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {IoMdClose} from "react-icons/io";
import {FaCheck} from "react-icons/fa6";
import moment from "moment";
import axios from "axios";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {useDispatch} from "react-redux";
import {changeAttendanceAll, resetData} from "../../../redux/slice/attendanceJournal/attendanceJournal_slice";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const DynamicAttendance = ({open, handleClose, data3}) => {

    const [isCome, setIsCome] = useState(null)
    const [sectionAndRoomData, setSectionAndRoomData] = useState([])
    const [sectionValue, setSectionValue] = useState('')
    const {headers} = getHeaders()
    const currDate = moment()
    const dispatch = useDispatch()


    const getSectionAndRoom = (eduId, groupId, subjectId, year, week, day) => {
        axios.get(`${BASE_URL}/groupConnect/getSectionsAndRooms/${eduId}/${groupId}?subjectId=${subjectId}&year=${year}&week=${week}&day=${day}`, {headers})
            .then(response => {
                setSectionAndRoomData(response.data[0])
                setSectionValue(`${response.data[0][0]?.room};${response.data[0][0]?.section}`)
            })
            .catch(error => {
                console.log(error)
                setSectionAndRoomData([])
            })
    }

    const handleCloseModal = () => {
        handleClose()
        setIsCome(null)
    }

    const formatData = (arr, section, room, isCome) => {
        if (isCome) {
            const data=arr.flat().filter(sub => sub.section === +(section) && sub.room === room && (sub.statistics.length === 0 || sub.statistics?.find(statistic=>statistic?.type === 'DYNAMIC')?.isCome !==isCome))
                .map(item => ({
                    id: item.statistics.find(statistic=>statistic?.type === 'DYNAMIC')?.nameId || null,
                    studentId: item.studentId,
                    room: item.room,
                    section: item.section,
                    isCome
                }))

            return data;
        } else {
            const data =arr.flat().filter(sub => sub.section === +(section) && sub.room === room && sub.statistics.length > 0 && sub.statistics?.find(statistic=>statistic?.type === 'DYNAMIC')?.isCome !==isCome)
                .map(item => ({
                    id: item.statistics.find(statistic=>statistic?.type === 'DYNAMIC')?.nameId || null,
                    studentId: item.studentId,
                    room: item.room,
                    section: item.section,
                    isCome
                }))

            return data;
        }
    }

    const handleSaveAttendanceRed = () => {
        const [room, section] = sectionValue.split(";")

        setIsCome(() => {
            const body = {
                year: currDate?.year(),
                week: currDate?.week(),
                weekday: currDate?.day(),
                groupId: data3[0].groupId,
                subjectId: data3[0].subjectId,
                attData: formatData(data3?.map(st => st.subjects), section, room, false),
            }
            dispatch(changeAttendanceAll({...body}))
            return false
        })
        handleCloseModal()
    }
    const handleSaveAttendanceGreen = () => {
        const [room, section] = sectionValue.split(";")

        setIsCome(() => {
            const body = {
                year: currDate?.year(),
                week: currDate?.week(),
                weekday: currDate?.day(),
                groupId: data3[0].groupId,
                subjectId: data3[0].subjectId,
                attData: formatData(data3?.map(st => st.subjects), section, room, true),
            }
            dispatch(changeAttendanceAll({...body}))
            return true
        })
        handleCloseModal()
    }

    const handleSaveAttendanceReset = () => {
        dispatch(resetData())
        handleCloseModal()

    }


    useEffect(() => {
        data3.length > 0 && getSectionAndRoom(data3[0]?.educationId, data3[0]?.groupId, data3[0]?.subjectId, currDate.year(), currDate.week(), currDate.day())
    }, [data3]);

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseModal}
        >
            <DialogTitle sx={{pb: 0}}>All</DialogTitle>
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
                        onChange={(e) => setSectionValue(e.target.value)}
                    >
                        {sectionAndRoomData?.map((option, index) => (
                            <MenuItem key={index}
                                      value={option?.room + ";" + option?.section}>{option?.room}; {option?.section}-section</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Box sx={{display: 'flex', gap: 2, justifyContent: 'center', mt: 3}}>
                    <Button
                        onClick={handleSaveAttendanceRed}
                        variant={isCome == null ? 'outlined' : isCome ? 'outlined' : 'contained'}
                        color={'error'}
                    >
                        <IoMdClose size={25}/>
                    </Button>
                    <Button
                        onClick={handleSaveAttendanceGreen}
                        variant={isCome == null ? 'outlined' : !isCome ? 'outlined' : 'contained'}
                        color={'success'}
                    >
                        <FaCheck size={25}/>
                    </Button>
                    <Button
                        onClick={handleSaveAttendanceReset}
                        variant={'contained'}

                    >
                        reset
                    </Button>
                </Box>
            </DialogContent>

        </Dialog>
    );
};

export default memo(DynamicAttendance);