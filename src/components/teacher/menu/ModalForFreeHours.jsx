import React, {memo, useEffect, useState} from 'react';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide} from "@mui/material";
import Button from "@mui/material/Button";
import axios from "axios";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import {useDispatch, useSelector} from "react-redux";
import Typography from "@mui/material/Typography";
import {useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import {IoIosWarning} from "react-icons/io";
import {orange} from "@mui/material/colors";
import {fetchEducationYear} from "../../../redux/actions/educationYear/education_year_actions";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const ModalForFreeHours = () => {
    const {headers}=getHeaders()
    const navigate=useNavigate()
    //const educationYearId=useSelector(state => state.educationYear.educationYear.id);
    const teacherId = useSelector(state => state.teacher?.teacher?.id)
    const [open, setOpen] = React.useState(false);
    const [eduId, setEduId] = useState(null)
    const dispatch=useDispatch()
    const handleClickOpen = () => {
        navigate('/teacher/settings')
    };

    const handleClose = () => {
        setOpen(false);
    };

    const fetchEducationYears = async () => {
        await axios.get(BASE_URL + '/education/educationYearsForSelected', {headers})
            .then(res => {
                setEduId(res?.data?.obj?.[0].id)
                dispatch(fetchEducationYear(res?.data?.obj?.[0]))
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        fetchEducationYears()
    }, []);
    const getTeachersFreeHours=(eduId,id)=>{
     id && eduId && axios.get(`${BASE_URL}/teachersFreeHours/checkerThatExistsTeachersFreeHours/${eduId}/${id}`,{headers})
            .then(res=>{
                console.log(res.data)
                setOpen(!res.data?.success)
            })
            .catch(err => {
                console.log(err)
                setOpen(true)
            })
    }
    useEffect(() => {
       getTeachersFreeHours(eduId,teacherId)
    }, []);
    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle sx={{display:'flex',alignItems:'center',gap:0.5}}>
                <IoIosWarning color={orange[800]} size={25}/>  Warning
            </DialogTitle>
            <DialogContent>
                <Box id="alert-dialog-slide-description">
                    <Typography fontWeight={'bold'} color={'red'}>
                        Ensure you allocate time in your schedule for retakes - it's a must!
                    </Typography>
                   <Typography  component={'i'} fontSize={14}>
                       Setting > Free Time
                   </Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant={'outlined'} onClick={handleClose}>cancel</Button>
                <Button variant={'contained'} onClick={handleClickOpen}>ok</Button>
            </DialogActions>
        </Dialog>
    );
};

export default memo(ModalForFreeHours);