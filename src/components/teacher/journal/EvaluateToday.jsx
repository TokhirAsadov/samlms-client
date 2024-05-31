import React, {memo, useEffect, useState} from 'react';
import {Dialog, DialogActions, DialogContent, DialogTitle, ListItemText} from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import styled from "styled-components";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import axios from "axios";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import {HiMiniPencilSquare} from "react-icons/hi2";
import Tooltip from "@mui/material/Tooltip";
import {MdDelete, MdOutlineAdd} from "react-icons/md";
import {saveData} from "../../../redux/slice/dataForUpdateThemeGrade/dataForUpdateThemeGrade_slice";
import {extrasmall} from "../../../responsiv";

const EvaluateToday = ({
                           setTodayGrade,
                           openEvaluateToday,
                           setOpenEvaluateToday,
                           oneSciencesScore,
                           allThemeData,
                           setThemeModal,
                           getThemeAll
                       }) => {
    const theme = useTheme();

    const educationYear = useSelector(state => state?.educationYear?.educationYear)
    const [disabledSavePoint, setDisabledSavePoint] = useState(false)
    const initialObj = {
        studentId: oneSciencesScore?.studentId,
        subjectId: oneSciencesScore?.subjectId,
        educationYearId: educationYear?.id,
        grade: null,
        time: null,
        themeId: null
    }
    const [obj, setObj] = useState(initialObj)
    const [evalTheme, setEvalTheme] = useState(false)
    const handleClose = () => {
        setOpenEvaluateToday(false);
    }
    const {headers} = getHeaders();
    const dispatch = useDispatch()

    const fetchCreateEvaluation = async (e) => {
        e.preventDefault()
        const findThemeDataMaxGrade = allThemeData.find(theme => theme.id === obj.themeId)?.maxGrade
        const body = {...obj, time: new Date().getTime(), grade: +(obj.grade)}

        if (+(body.grade) >= 0 && +(body.grade) <= findThemeDataMaxGrade) {
             await axios.post(`${BASE_URL}/gradeOfStudentByTeacher/create`, body, {headers})
                 .then(response => {
                     setTodayGrade(prevState => ({...prevState, id: oneSciencesScore?.studentId, grade: +(obj?.grade)}))
                     toast.success(response.data?.message)
                     setOpenEvaluateToday(false);
                     setObj(initialObj)
                 })
                 .catch(err => {
                     console.log(err)
                     toast.error("Error evaluation")
                 })
        } else {
            toast.error(`min:0  max:${findThemeDataMaxGrade || 'empty'}`)
        }
    }

    const handleChangePoint = (e) => {
        const point = e.target.value;
        const rating = oneSciencesScore?.sumGrade || 0;
        if (parseFloat(rating) + parseFloat(point) <= 30) {
            setDisabledSavePoint(false)
            setObj(prevState => ({...prevState, grade: point}))
        } else {
            setDisabledSavePoint(true)
        }
    }
    const handleUpdateTheme = (data) => {
        dispatch(saveData(data))
        setThemeModal(true)
    }
    const handleDeleteTheme = (data) => {
        axios.delete(`${BASE_URL}/themeOfSubjectForGrading/deleteTheme/${data?.id}`,getHeaders())
            .then(res => {
                console.log(res.data)
                toast.warning('Deleted')
                getThemeAll()
            })
            .catch(err => {
                toast.error(err.response.data.message || 'Error')
            })
    }
    useEffect(() => {
        setObj({
            studentId: oneSciencesScore?.studentId,
            subjectId: oneSciencesScore?.subjectId,
            educationYearId: educationYear?.id,
            grade: null,
            time: null,
            themeId: null
        })
    }, [oneSciencesScore]);

    return (
        <Dialog
            open={openEvaluateToday}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title">
                {"Evaluate"}
            </DialogTitle>
            <form >
                <DialogContent>
                    <BoxInput>
                        <InputItem>
                            <Box sx={{display: 'grid', gridTemplateColumns: '1fr 62px', alignContent: 'stretch',}}>
                                <FormControl fullWidth>
                                    <InputLabel id="theme-label">Theme</InputLabel>
                                    <Select
                                        labelId="theme-label"
                                        open={evalTheme}
                                        onOpen={() => setEvalTheme(true)}
                                        onClose={() => setEvalTheme(false)}
                                        value={obj.themeId}
                                        onChange={(e) => setObj(prevState => ({...prevState, themeId: e.target.value}))}
                                        id="theme"
                                        label="Theme"
                                        sx={{borderRadius: "4px 0 0 4px"}}
                                        fullWidth
                                    >
                                        {allThemeData?.map((item, index) => (
                                            <MenuItem key={index} value={item?.id}>
                                                <Box
                                                    sx={{
                                                        width: "100%",
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        gap: '5px'
                                                    }}>
                                                    <ListItemText
                                                        primary={`${item?.name}, max grade:${item?.maxGrade}`}/>
                                                    {evalTheme &&   <>
                                                        <IconButton
                                                            onClick={() => handleUpdateTheme(item)}
                                                            size={'small'}
                                                        >
                                                            <HiMiniPencilSquare/>
                                                        </IconButton>
                                                        <IconButton
                                                            onClick={() => handleDeleteTheme(item)}
                                                            size={'small'}
                                                        >
                                                            <MdDelete/>
                                                        </IconButton>
                                                    </>}
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Tooltip title={'Add a new theme'} arrow>
                                    <Button onClick={() => setThemeModal(true)}
                                            sx={{width: 35, height: '100%', borderRadius: " 0 4px 4px 0",}}
                                            variant={'outlined'}>
                                        <MdOutlineAdd size={20}/>
                                    </Button>
                                </Tooltip>
                            </Box>

                        </InputItem>
                        <InputItem>
                            <TextField
                                fullWidth
                                type='number'
                                value={obj.grade}
                                onChange={(e) => handleChangePoint(e)}
                                label="Grade"
                            />
                        </InputItem>
                    </BoxInput>
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" type='reset' onClick={handleClose}>cancel</Button>
                    <Button disabled={disabledSavePoint} onClick={fetchCreateEvaluation} variant="contained" type='submit'>save</Button>
                </DialogActions>
            </form>

        </Dialog>
    );
};
const InputItem = styled.div`

`
const BoxInput = styled.div`
    width: 400px;
    margin-top: 10px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
    ${extrasmall({
        width: "300px !important",
    })}
`

export default memo(EvaluateToday);
