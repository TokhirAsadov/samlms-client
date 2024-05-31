import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import axios from "axios";
import {BASE_URL} from "../../../utills/ServiceUrls";
import {toast} from "react-toastify";
import {getAllStudentData} from "../../../redux/actions/allNbModalForTeacher/allNbModalForTeacher_action";
import {resetAttendance} from "../../../redux/slice/allNbModalForTeacher/allNbModalForTeacher_slice";

const SaveNbAllStudentsBtn = ({exportToExcel,confData,dataStudents}) => {
    const dataAttendanceForSave = useSelector(state => state.AllNbStudentForTeacher?.dataAttendance?.attendances) || [];
    const dispatch=useDispatch();

    const handleDontSave = () => {
        dispatch(resetAttendance())
        dispatch(getAllStudentData(confData))
    }
    const handleSaveAttendance = () => {
        console.log(dataAttendanceForSave);
        const dataCreate = dataAttendanceForSave.filter(item => item.id === null);
        const dataUpdate = dataAttendanceForSave.filter(item => item.id !== null);
        const requests = [];

        if (dataCreate.length > 0) {
            requests.push(axios.post(`${BASE_URL}/dynamicAttendance/createMultiDynamicAttendance3`,dataCreate,confData.headers));
        }

        if (dataUpdate.length > 0) {
            requests.push(axios.put(`${BASE_URL}/dynamicAttendance/updateMultiDynamicAttendance3`,dataUpdate,confData.headers));
        }

        if (requests.length > 0) {
            Promise.all(requests)
                .then(responses => {
                    responses.forEach(response => {
                        console.log(response.data);
                    });
                    toast.success('Success');
                    handleDontSave()
                })
                .catch(error => {
                    console.log(error);
                    toast.error('Error saving');
                });
        }
    };


    return (
        <Box sx={{display: 'flex', justifyContent: 'end', mt: 2}}>
            <Box sx={{display: "flex", gap: 2}}>
                {dataAttendanceForSave.length > 0 && (<>
                    <Button variant={'contained'} color={"error"} onClick={handleDontSave}>Don't Save</Button>
                    <Button variant={'contained'} onClick={handleSaveAttendance}>Save</Button></>)}
                {dataStudents?.length>0 && <Button onClick={exportToExcel} variant={'outlined'}>Export</Button>}
            </Box>
        </Box>
    );
};

export default SaveNbAllStudentsBtn;