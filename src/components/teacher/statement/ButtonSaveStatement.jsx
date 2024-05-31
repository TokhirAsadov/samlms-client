import React from 'react';
import { Box, Button } from '@mui/material';
import { IoMdSend } from 'react-icons/io';
import {useSelector} from "react-redux";
import axios from "axios";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import {toast} from "react-toastify";

const ButtonSaveStatement = ({ data, loadData,getVedimostInfo,handleClose }) => {
   const vedimostData= useSelector(state => state.vedimostSlice?.data?.obj);
    const formatScore = (item) => parseFloat(((item?.allSumGrade || 0) + (item?.allGradesForAttendance || 0)).toFixed(3));



    const handleSaveData = () => {
        if (vedimostData?.deadline< new Date().getTime()) return toast.warning("Time's up!")
        const bodyForSave = {
            vedimostId: vedimostData?.id,
            data: data?.map(user => ({
                studentId: user.studentId,
                grade: formatScore(user),
            }))
        };
        axios.post(`${BASE_URL}/finalGrade/createFinalGrades`,bodyForSave,getHeaders())
            .then(res=>{
                toast.success('Success')
                getVedimostInfo()
                handleClose()
            })
            .catch(err => {
                toast.error('Error')
                console.log(err)
            })
        console.log(bodyForSave)
    };

    if (!data?.length || loadData || vedimostData?.id==null ) return null;

    return (
            <Button size={'small'} variant="contained" onClick={handleSaveData} endIcon={<IoMdSend />}>
                Send
            </Button>
    );
};

export default ButtonSaveStatement;
