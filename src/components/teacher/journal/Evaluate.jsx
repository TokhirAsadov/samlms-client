import React, {memo, useEffect, useState} from 'react';
import styled from "styled-components";
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import {extrasmall} from "../../../responsiv";
import {AiFillDelete, AiFillFileAdd, AiFillUnlock} from "react-icons/ai"
import moment from "moment";
import Button from "@mui/material/Button";
import {Dialog, DialogActions, DialogContent, DialogTitle, ListItemText, Stack} from "@mui/material";
import TextField from "@mui/material/TextField";
import {useDispatch, useSelector} from "react-redux";
import {HiPencilAlt} from "react-icons/hi";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {IoClose} from "react-icons/io5";
import Typography from "@mui/material/Typography";
import {toast} from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import {IoIosWarning} from "react-icons/io";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import HistoryRetakeScoreModal from "./HistoryRetakeScoreModal";
import MenuItem from "@mui/material/MenuItem";
import {MdDelete, MdOutlineAdd} from "react-icons/md";
import {HiMiniPencilSquare} from "react-icons/hi2";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import {saveData} from "../../../redux/slice/dataForUpdateThemeGrade/dataForUpdateThemeGrade_slice";
import {FaExclamationTriangle} from "react-icons/fa";
import InfoScoreAttendance from "./InfoScoreAttendance";

const Evaluate = ({oneSciencesScore, fetchCoreDataStudents, allThemeData, setThemeModal, getThemeAll}) => {
    const {
        subjectId,
        studentId,
        groupId,
        fullName,
        allGradesForAttendance,
        gradeForAttendance,
    } = oneSciencesScore

    const {id} = useSelector(state => state.teacher.teacher)
    const educationYear = useSelector(state => state?.educationYear?.educationYear)
    const [open, setOpen] = React.useState(false);
    const [openDelete, setOpenDelete] = useState(false)
    const [openChangeEvaluate, setOpenChangeEvaluate] = useState(false)
    const [deleteId, setDeleteId] = useState(null)
    const [configDeadline, setConfigDeadline] = useState(null);
    const initialObj = {
        id: null,
        studentId,
        subjectId,
        educationYearId: educationYear?.id,
        grade: null,
        time: null,
        themeId: null
    }
    const [obj, setObj] = useState(initialObj)
    const {headers} = getHeaders();
    const [data, setData] = useState([]);
    const [rating, setRating] = useState(null);
    const [disabledSavePoint, setDisabledSavePoint] = useState(false)
    const [isRetake, setIsRetake] = useState(false)
    const [isShowRetake, setIsShowRetake] = useState(false);
    const [historyRetakeData, setHistoryRetakeData] = useState([])
    const [isDisabledRetake, setIsDisabledRetake] = useState(false)
    const [evalTheme, setEvalTheme] = useState(false)
    const dispatch = useDispatch()


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setObj(initialObj)
        setOpen(false);
        setIsRetake(false)
    };
    const handleOpenDelete = (id) => {
        setDeleteId(id);
        setOpenDelete(true);
    }
    const handleOpenChangeEvaluate = () => {
        setOpenChangeEvaluate(true);
    }
    const handleCloseDelete = () => {
        setDeleteId(null);
        setOpenDelete(false);
    }

    const handleCloseChangeEvaluate = () => {
        setOpenChangeEvaluate(false);
    }

    const fetchCheckExistsPermission = async () => {
        await axios.get(`${BASE_URL}/permissionForTeacherGrading/checkExistsPermission/${educationYear?.id}?teacherId=${id}&subjectId=${subjectId}&groupId=${groupId}&status=AT_PROCESS`, {headers})
            .then(response => {
                console.log(response, " response p")
                if (response?.data?.success) {
                    toast.warning("You already send a request. Please, wait response of education department..")
                } else {
                    setOpenChangeEvaluate(true);
                }
            })
            .catch(error => {
                console.log(error, "error ")
            })
    }


    const fetchData = async () => {
        await axios.get(`${BASE_URL}/gradeOfStudentByTeacher/getGradesOfStudent/${educationYear?.id}?studentId=${studentId}&subjectId=${subjectId}`, {headers})
            .then(response => {
                setData(response?.data?.obj)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const fetchMiddleGradeData = async () => {
        await axios.get(`${BASE_URL}/gradeOfStudentByTeacher/getMiddleGrade/${educationYear?.id}?studentId=${studentId}&subjectId=${subjectId}&groupId=${groupId}`, {headers})
            .then(response => {
                const sumGrade = response.data?.obj || 0
                setRating(sumGrade)

            })
            .catch(err => {
                console.log(err)
            })
    }

    const fetchCreateEvaluation = async (e) => {
        e.preventDefault()
        const findThemeDataMaxGrade = allThemeData.find(theme => theme.id === obj.themeId)?.maxGrade
        const body = {...obj, time: new Date().getTime(), grade: +(obj.grade)}
        console.log(body)

        if (+(body.grade) >= 0 && +(body.grade) <= findThemeDataMaxGrade) {
            await axios.post(`${BASE_URL}/gradeOfStudentByTeacher/create`, body, {headers})
                .then(response => {
                    // console.log(response)
                    setOpen(false);
                    fetchData();
                    fetchCoreDataStudents()
                    fetchMiddleGradeData();
                    toast.success("Grade was created successfully")
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

    const fetchUpdateEvaluation = async (e) => {
        e.preventDefault()
        const findThemeDataMaxGrade = allThemeData.find(theme => theme.id === obj.themeId)?.maxGrade
        const body = {...obj, time: new Date().getTime()}
        console.log(body)
        if (parseFloat(body.grade) >= 0 && parseFloat(body.grade) <= findThemeDataMaxGrade) {
            obj?.id && obj?.id !== "" && await axios.put(`${BASE_URL}/gradeOfStudentByTeacher/update`, body, {headers})
                .then(response => {

                    setOpen(false);
                    fetchData();
                    fetchCoreDataStudents()
                    fetchMiddleGradeData();
                    toast.success("Grade was updated successfully")
                    setObj(initialObj)
                })
                .catch(err => {
                    console.log(err)
                    toast.error(err?.response?.data?.message)
                })
        } else {
            toast.error(`min:0  max:${findThemeDataMaxGrade || 'empty'}`)
        }
    }
    const fetchRetakeEvaluation = async (e) => {
        e.preventDefault()
        const findThemeDataMaxGrade = allThemeData.find(theme => theme.id === obj.themeId)?.maxGrade
        const data = {...obj, time: new Date().getTime(), failGradeId: obj.id}
        const {id, createdAt, ...body} = data
        console.log(body)
        if (parseFloat(body.grade) >= 0 && parseFloat(body.grade) <= findThemeDataMaxGrade) {
            obj?.id && obj?.id !== "" && await axios.post(`${BASE_URL}/gradeOfStudentByTeacher/retake`, body, {headers})
                .then(response => {
                    setOpen(false);
                    setIsRetake(false)
                    fetchData();
                    fetchCoreDataStudents()
                    fetchMiddleGradeData();
                    toast.success("Grade was updated successfully")
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

    const handleOpenForUpdate = (item) => {
        const grade = item?.retakes.length === 0 ? item?.grade : item?.retakes[item?.retakes.length - 1]?.grade
        setObj(prevState => ({...prevState, ...item, grade}))
        setOpen(true);
        setIsDisabledRetake(!(configDeadline ? (item?.time <= configDeadline) : (isBeforeDeadline(item?.time))))
        setIsRetake(!(configDeadline ? (item?.time <= configDeadline) : (isBeforeDeadline(item?.time))))

    }
    const handleSwitchChange = () => {
        setIsRetake((prevIsRetake) => !prevIsRetake);
    };
    const handleCloseHistoryRetake = () => {
        setIsShowRetake(false)
    }
    const handleOpenHistoryRetake = (item) => {
        setHistoryRetakeData(item)
        setIsShowRetake(true)
    }
    const fetchDelete = () => {
        deleteId && axios.delete(`${BASE_URL}/gradeOfStudentByTeacher/delete/${deleteId}`, {headers})
            .then(response => {
                fetchData();
                handleCloseDelete();
                fetchCoreDataStudents()
                fetchMiddleGradeData();
                toast.warning("Grade was deleted successfully")
            })
            .catch(err => {
                console.log(err)
                toast.error(err?.response?.data?.message)
            })
    }
    const handleGainAccess = () => {
        const data = {
            groupId,
            status: "AT_PROCESS",
            subjectId,
            teacherId: id,
            educationYearId: educationYear?.id,
        }
        axios.post(BASE_URL + '/permissionForTeacherGrading/createPermissionForTeacherGrading', data, {headers})
            .then(res => {
                toast.success('Successfully sent')
                setOpenChangeEvaluate(false)
            })
            .catch(err => {
                console.log(err)
                toast.error('Error')
            })
    }
    const handleChangePoint = (e) => {
        const point = e.target.value;

        if (parseFloat(rating) + parseFloat(point) <= 30) {
            setDisabledSavePoint(false)
            setObj(prevState => ({...prevState, grade: point}))
        } else {
            setDisabledSavePoint(true)
        }
    }
    const fetchPermissions = async () => {
        await axios.get(`${BASE_URL}/permissionForTeacherGrading/getConfirmPermission/${educationYear?.id}?teacherId=${id}&subjectId=${subjectId}&groupId=${groupId}`)
            .then(res => {
                setConfigDeadline(res.data?.obj?.deadline || null)
            })
            .catch(err => {
                console.log(err, "get permissions error")
            })
    }

    const isBeforeDeadline = (date) => {
        const putTime = moment(date);
        const currTime = moment();
        const endTime = moment(date).add(2, 'days');

        return putTime.isBefore(currTime) && currTime.isBefore(endTime);

    }
    const handleUpdateTheme = (data) => {
        dispatch(saveData(data))
        setThemeModal(true)
    }
    const handleDeleteTheme = (data) => {
        axios.delete(`${BASE_URL}/themeOfSubjectForGrading/deleteTheme/${data?.id}`, getHeaders())
            .then(res => {
                console.log(res.data)
                toast.warning('Deleted')
                getThemeAll()
            })
            .catch(err => {
                toast.error(err.response.data.message || 'Error')
            })
    }
    const bgColorData = (number, maxNum) => {
        const numberFormat = parseFloat((number * 100 / maxNum).toFixed(3));
        if (numberFormat >= 0 && numberFormat < 60) {
            return '#FF0000';
        } else if (numberFormat >= 60 && numberFormat <= 84) {
            return 'rgb(215,215,0)';
        } else if (numberFormat >= 85) {
            return '#00bd00';
        }
    }

    useEffect(() => {
        Promise.all([fetchData(), fetchMiddleGradeData(), fetchPermissions()])
    }, [])

    useEffect(() => {
        setIsRetake()
    }, []);

    function getObjectsNotInArray(a, b) {
        const bIds = new Set(b.map(obj => obj.themeId));
        return a.filter(obj => !bIds.has(obj.id));
    }

    return (
        <Container>
            <Title>
                <h4>{fullName}</h4>
                {configDeadline ? <Box
                    sx={{
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        gap: 2,
                    }}>
                    <Button variant={'outlined'} color={'primary'} startIcon={<AiFillUnlock/>}>
                        Grades can be changed until {moment(configDeadline).format('DD.MM.YYYY')}
                    </Button>
                </Box> : <Box
                    sx={{
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        gap: 2,
                    }}>
                    <Tooltip title="The time to change the assessment has passed.">
                        <Button variant={'contained'} color={'inherit'} onClick={fetchCheckExistsPermission}
                                size={'small'}>Access
                            to changes</Button>
                    </Tooltip>
                    <Tooltip title={'Points can be changed within 3 days!'}>
                        <IconButton size={'medium'} color={'warning'}>
                            <IoIosWarning/>
                        </IconButton>
                    </Tooltip>
                </Box>}
            </Title>

            <Box sx={{display: 'flex', justifyContent: 'end', mt: 2}}>
                <Button color={'success'} variant="contained" onClick={handleClickOpen} endIcon={<AiFillFileAdd/>}>
                    evaluation
                </Button>
            </Box>
            <Bodybox>
                <table>
                    <thead>
                    <tr>
                        <th><h5>Theme</h5></th>
                        <th><h5>Score</h5></th>
                        <th><h5>Max score</h5></th>
                        <th><h5>Date</h5></th>
                        <th><h5>Actions</h5></th>
                    </tr>
                    </thead>

                    <tbody>
                    {data.map((item, key) => (
                        <tr key={key}>
                            <td>
                                {item?.theme}
                            </td>
                            <td style={{
                                backgroundColor: bgColorData(item?.grade, item.maxGrade || 6),
                                color: '#fff'
                            }} className={'score'} onClick={() => handleOpenHistoryRetake(item)}>
                                {item?.grade}
                            </td>
                            <td className={'score'} onClick={() => handleOpenHistoryRetake(item)}>
                                {item.maxGrade || 6}
                            </td>
                            <td>
                                {moment(new Date(item?.time)).format('DD-MM-YYYY HH:mm')}
                            </td>
                            <td>
                                <Stack direction={"row"} spacing={2} justifyContent="center">
                                    <IconButton
                                        aria-label="change" color="success"
                                        onClick={() => handleOpenForUpdate(item)}>
                                        <HiPencilAlt/>
                                    </IconButton>
                                    <IconButton
                                        // disabled={!(configDeadline ? (item?.time <= configDeadline) : (isBeforeDeadline(item?.time)))}
                                        aria-label="delete" color="error"
                                        onClick={() => handleOpenDelete(item?.id)}>
                                        <AiFillDelete/>
                                    </IconButton>
                                </Stack>
                            </td>
                        </tr>
                    ))}
                    {getObjectsNotInArray(allThemeData, data).map((item2, index) => (
                        <tr key={index}>
                            <td>{item2?.name}</td>
                            <Tooltip title={"haven't marked"} arrow placement={'left'}>
                                <td><FaExclamationTriangle/></td>
                            </Tooltip>
                            <td>{item2?.maxGrade}</td>
                            <td></td>
                            <td></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Bodybox>

            <InfoScoreAttendance
                allGradesForAttendance={allGradesForAttendance}
                studentId={studentId}
                subjectId={subjectId}
                groupId={groupId}
                gradeForAttendance={gradeForAttendance}
                rating={rating}
                eduId={educationYear?.id}
            />
            {/* modal evaluate */}
            <Dialog
                //fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
                PaperProps={{style: {overflowY: 'visible'}}}
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Evaluate"} {isRetake && '(retake)'}
                </DialogTitle>
                <form>
                    <DialogContent sx={{pt: 0}}>
                        <BoxInput>
                            {obj?.id !== null && (
                                <InputItem style={{display: 'flex', justifyContent: 'end'}}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                //disabled={isDisabledRetake}
                                                checked={isRetake}
                                                onChange={handleSwitchChange}
                                                color="primary"
                                            />
                                        }
                                        label="Retake"
                                        labelPlacement="end"
                                    />
                                </InputItem>
                            )}
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
                                            onChange={(e) => setObj(prevState => ({
                                                ...prevState,
                                                themeId: e.target.value
                                            }))}
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
                                                        {evalTheme && <>
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
                        <Button
                            disabled={disabledSavePoint}
                            variant="contained"
                            onClick={obj?.id == null ? fetchCreateEvaluation : isRetake ? fetchRetakeEvaluation : fetchUpdateEvaluation}
                            type='submit'>
                            {
                                obj?.id === null ? "save" : "update"
                            }
                        </Button>
                    </DialogActions>
                </form>

            </Dialog>

            {/*modal delete*/}
            <Modal
                open={openDelete}
                onClose={handleCloseDelete}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} component={style2}>
                    <ModalTitle>
                        <h5>
                            Delete
                        </h5>
                        <CloseBtnModal onClick={handleCloseDelete}> <IoClose size={22}/></CloseBtnModal>
                    </ModalTitle>
                    <Box>
                        <Stack sx={{height: "100px"}} direction="row" justifyContent="center" alignItems="center">
                            <Typography variant="h6" color="black">
                                Do you want to delete !
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing={2} justifyContent="flex-end"
                               alignItems="center">
                            <Button variant="outlined" onClick={handleCloseDelete}>Cancel</Button>
                            <Button variant="contained" color="error" onClick={fetchDelete}>
                                Ok
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Modal>

            {/*modal change evaluate log */}
            <Modal
                open={openChangeEvaluate}
                onClose={handleCloseChangeEvaluate}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} component={style2}>
                    <ModalTitle>
                        <h5>
                            Access to changes
                        </h5>
                        <CloseBtnModal onClick={handleCloseChangeEvaluate}> <IoClose size={22}/></CloseBtnModal>
                    </ModalTitle>
                    <Box>
                        <Stack sx={{height: "150px"}} direction="row" justifyContent="center" alignItems="center">
                            <Typography variant="h6" color="black">
                                You can only change today's points within 3 days. <br/>
                                Approval of the Department of Education is required for grade changes.
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing={2} justifyContent="flex-end"
                               alignItems="center">
                            <Button variant="outlined" onClick={handleCloseChangeEvaluate}>Cancel</Button>
                            <Button onClick={handleGainAccess} variant="contained">
                                gain access
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Modal>

            {/* modal retake history*/}
            <HistoryRetakeScoreModal data={historyRetakeData} open={isShowRetake}
                                     handleClose={handleCloseHistoryRetake}/>
        </Container>
    );
};

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    padding: "15px",
    borderRadius: "8px",
};
const style2 = styled.div`
    ${extrasmall({
        width: "95% !important",
    })}
`
const CloseBtnModal = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
    border-radius: 50%;
    border: none;
    background-color: ${mainColor};
    color: white;
    font-size: 12px;
`
const ModalTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    h4 {
        color: black;
    }

    h5 {
        color: red;
    }

`


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

const Bodybox = styled.div`
    margin-top: 10px;
    width: 100%;
    overflow-x: scroll;

    table {
        min-width: 500px;
        border-collapse: collapse;
        width: 100%;
        text-align: center;
        border-radius: 5px;
        overflow: hidden;

        td, th {
            border: 1px solid #ddd;
            padding: 8px;
        }

        tr {
            &:nth-child(even) {
                background-color: #f2f2f2;
            }
        }

        th {
            padding: 12px 0;
            background-color: ${mainColor};
            color: white;
        }
    }

    .score {
        &:hover {
            opacity: 0.7;
            cursor: pointer;
        }
    }
`


const Title = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;

    h4 {
        font-size: 18px;
        color: ${mainColor};
        font-weight: bold;

    }

    ${extrasmall({
        justifyContent: "center",
    })}
`

const Container = styled.div`

`
export default memo(Evaluate);