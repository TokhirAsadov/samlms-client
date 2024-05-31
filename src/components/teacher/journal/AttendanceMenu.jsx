import React, {memo, useEffect, useState} from "react";
import {Menu} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {IoMdClose} from "react-icons/io";
import {FaCheck} from "react-icons/fa6";
import {useDispatch, useSelector} from "react-redux";
import {changeAttendance} from "../../../redux/slice/attendanceJournal/attendanceJournal_slice";

function AttendanceMenu({anchorEl, open, handleClose, data}) {
    const [isCome, setIsCome] = useState(null)
    const saveForDataAttendance = useSelector(state => state.attendanceForJournal)
    const dispatch = useDispatch()
    const closeMenu = () => {
        handleClose()
        setIsCome(null)
    }

    const isActiveButton = () => {
        const student = saveForDataAttendance?.attendances.find(st => st?.studentId === data?.studentId && st?.section === data?.section)
        if (student) {
            return student.isCome
        } else {
            return null
        }
    }

    useEffect(() => {
        setIsCome(isActiveButton)
    }, [data,saveForDataAttendance]);


    const handleUpdateDataRed = () => {
        setIsCome(prev => {
            if (typeof prev === "boolean") {
                dispatch(changeAttendance({...data, isCome: null}))
                return null
            } else {
                dispatch(changeAttendance({...data, isCome: false}))
                return false
            }
        })
    }
    const handleUpdateDataGreen = () => {
        setIsCome(prev => {
            if (typeof prev === "boolean") {
                dispatch(changeAttendance({...data, isCome: null}))
                return null
            } else {
                dispatch(changeAttendance({...data, isCome: true}))
                return false
            }
        })
    }
    return (
        <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={closeMenu}
            onClick={closeMenu}
            PaperProps={{
                elevation: 0,
                sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                        width: 40,
                        height: 40,
                    },
                    '&::before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 75,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                    },
                },
            }}
            transformOrigin={{horizontal: 'center', vertical: 'top'}}
            anchorOrigin={{horizontal: 'center', vertical: 'bottom'}}
        >
            <Box sx={{display: 'flex', gap: 2, justifyContent: 'center', p: 1}}>
                <Button
                    disabled={!data?.isComeData}
                    size="small"
                    onClick={handleUpdateDataRed}
                    variant={isCome == null ? 'outlined' : isCome ? 'outlined' : 'contained'}
                    color={'error'}
                >
                    <IoMdClose size={20}/>
                </Button>
                <Button
                    disabled={data?.isComeData}
                    size="small"
                    onClick={handleUpdateDataGreen}
                    variant={isCome == null ? 'outlined' : !isCome ? 'outlined' : 'contained'}
                    color={'success'}
                >
                    <FaCheck size={20}/>
                </Button>
            </Box>
        </Menu>
    )
}

export default memo(AttendanceMenu)