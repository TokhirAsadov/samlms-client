import React, {memo} from 'react';
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { resetDataScore } from "../../../redux/slice/multipartScore/multipartScore_slice";
import { toast } from "react-toastify";
import axios from "axios";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";

const ButtonSaveScore = ({ setBtnToggle2, fetchCoreDataStudents }) => {
    const {headers}=getHeaders()
    const saveMultipartScore = useSelector(state => state.dataScoreMultipart);
    const dispatch = useDispatch();

    const handleNoSave = () => {
        setBtnToggle2(false);
        dispatch(resetDataScore());
    };

    const handleSaveData = () => {
        const { themeId, maxGrade, grades } = saveMultipartScore;
        if (themeId !== null && maxGrade !== null) {
            const validGrades = grades.every(gr => gr.grade >= 0 && gr.grade <= maxGrade);

            if (validGrades) {
                const bodyForCreate = {
                    ...saveMultipartScore,
                    time: new Date().getTime(),
                    grades: grades.filter(item => item.gradeId===null)
                };

                const bodyForUpdate = grades
                    .filter(item => item.gradeId!==null)
                    .map(gradeItem => ({ id: gradeItem.gradeId, grade: gradeItem.grade }));

                console.log(bodyForCreate);
                console.log(bodyForUpdate);

                const requests = [];

                if (bodyForCreate.grades.length > 0) {
                    requests.push(
                        axios.post(`${BASE_URL}/themeOfSubjectForGrading/createThemeWithGrade`, bodyForCreate, { headers })
                    );
                }

                if (bodyForUpdate.length > 0) {
                    requests.push(
                        axios.put(`${BASE_URL}/gradeOfStudentByTeacher/multipleUpdate`, bodyForUpdate, { headers })
                    );
                }

                Promise.all(requests)
                    .then(responses => {
                       toast.success('Saved successfully')
                        fetchCoreDataStudents();
                        handleNoSave();
                    })
                    .catch(err => {
                        console.error(err);
                        toast.error(err.response?.data?.message || 'An error occurred');
                    });
            } else {
                toast.warning(`Grade must be between 0 and ${maxGrade || 6}`);
            }
        } else {
            toast.warning('Error description field');
        }
    };


    return (
        saveMultipartScore.grades.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'end', mt: 2 }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button variant={'contained'} color={"error"} onClick={handleNoSave}>Don't Save</Button>
                    <Button variant={'contained'} onClick={handleSaveData}>Save Points</Button>
                </Box>
            </Box>
        )
    );
};

export default memo(ButtonSaveScore);
