import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import styled from "styled-components";
import {extrasmall} from "../../../responsiv";
import {BsFillFileEarmarkTextFill, BsImages, BsLink45Deg} from "react-icons/bs";
import Button from "@mui/material/Button";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {IoClose, IoDocumentSharp, IoSaveSharp} from 'react-icons/io5'
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import ModalUploadeFile from "./ModalUploadFile";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import {FiEdit} from "react-icons/fi";
import {AiFillDelete, AiFillFileText, AiFillFileZip} from "react-icons/ai";
import {BiArrowBack} from "react-icons/bi";
import {Card, CardContent, Stack} from "@mui/material";
import {MdQuiz} from "react-icons/md";
import {FaEdit, FaFilePdf, FaFilePowerpoint, FaFileUpload, FaFileWord} from "react-icons/fa";
import {useSelector} from "react-redux";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import {RiFileExcel2Fill} from "react-icons/ri";
import MessagesTeacherAndStudents from "../../student/subject/MessagesTeacherAndStudents";


const TeacherOneScience = () => {
    const {fan, groupsId} = useParams()

    const navigate = useNavigate()
    const [checked, setChecked] = React.useState(false);
    const handleChange = () => {
        setChecked((prev) => !prev);
    };
    const handleChangeAt = (event, newValue) => {
        console.log(newValue, "new values")

        oldObj?.themeId === null
            ?
            setObj(prevState => ({...prevState, oldThemeId: newValue?.themeId}))
            :
            setOldObj(prevState => ({...prevState, oldThemeId: newValue?.themeId}))
    };


    const [data, setData] = useState([])

    const [lineId, setLineId] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [openMesg, setOpenMesg] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [btnTheme, setBtnTheme] = useState(true)
    const handleOpen = (id) => {
        setLineId(id);
        setOpen(true);
    }
    const handleOpen2 = () => setOpen2(true);
    const handleOpenDelete = () => setOpenDelete(true);
    const handleClose = () => setOpen(false);
    const handleClose2 = () => {
        setOldObj({
            themeId: null,
            themeName: null,
            isMulti: null,
            lineId: null,
            oldThemeId: null,
            isUpdate: btnTheme,
        })
        setOpen2(false);
        setBtnTheme(true);
    }
    const handleCloseDelete = () => setOpenDelete(false);
    const {headers} = getHeaders();
    const forLessonData = useSelector(state => state.lessonsTeacherSlice.forLessonsData)
    const [options, setOptions] = useState([])
    const [scroll, setScroll] = useState('paper');
    const [obj, setObj] = useState({
        isCreate: btnTheme,
        newTheme: null,
        oldThemeId: null,
        planId: groupsId,
        queue: data?.length === 0 ? 1 : data?.[data?.length - 1].queue + 1
    })
    const [oldObj, setOldObj] = useState({
        themeId: null,
        themeName: null,
        isMulti: null,
        lineId: null,
        oldThemeId: null,
        isUpdate: btnTheme,
    })
    const handleClickOpen = (scrollType) => () => {
        setOpenMesg(true);
        setScroll(scrollType);
    };
    const handleNewTheme = () => {
        setBtnTheme(true)
    }
    const handleOldTheme = () => {
        setBtnTheme(false)
    }

    function typeFileIcon(fileData, typeUrl, fileName) {

        if (fileData === ".doc" || fileData === ".docx") {
            return <> <FaFileWord size={20} color="white"/>
                <p>{fileName.substring(0, fileName.indexOf("_"))}</p>
            </>
        }
        if (fileData === ".jpg" || fileData === ".jpeg" || fileData === ".png") {
            return <> <BsImages size={20} color={"#FFF"}/>
                <p>{fileName.substring(0, fileName.indexOf("_"))}</p>
            </>
        }
        if (fileData === ".xls" || fileData === ".xlsx") {
            return <> <RiFileExcel2Fill size={20} color={"#FFF"}/>
                <p>{fileName.substring(0, fileName.indexOf("_"))}</p></>
        }
        if (fileData === ".txt") {
            return <> <AiFillFileText size={20} color={"#FFF"}/> <p>{fileName.substring(0, fileName.indexOf("_"))}</p>
            </>
        }
        if (fileData === ".ppt" || fileData === ".pptx") {
            return <> <FaFilePowerpoint size={20} color={"#FFF"}/>
                <p>{fileName.substring(0, fileName.indexOf("_"))}</p></>
        }
        if (fileData === ".pdf") {
            return <> <FaFilePdf size={20} color={"#FFF"}/> <p>{fileName.substring(0, fileName.indexOf("_"))}</p>
            </>
        }
        if (fileData === ".zip") {
            return <> <AiFillFileZip size={20} color={"#FFF"}/> <p>{fileName.substring(0, fileName.indexOf("_"))}</p>
            </>
        }
        if (typeUrl === "URL") {
            return <> <BsLink45Deg size={20} color={"#FFF"}/> <p>{fileName.substring(0, fileName.indexOf("_"))}</p>
            </>
        }
        return <> <IoDocumentSharp size={20} color={"#FFF"}/> <p>{fileName.substring(0, fileName.indexOf("_"))}</p>
        </>
    }

    useEffect(() => {
        if (data.length === 0) {
            setChecked(true)
        }

        fetchData();
    }, [])

    useEffect(() => {
        !btnTheme && fetchOldThemes();
        oldObj?.themeId === null
            ?
            setObj(prevState => ({...prevState, isCreate: btnTheme}))
            :
            setOldObj(prevState => ({...prevState, isUpdate: btnTheme}))
    }, [btnTheme])

    useEffect(() => {
        setObj(prevState => ({...prevState, queue: data?.length === 0 ? 1 : data?.[data?.length - 1].queue + 1}))
    }, [data])


    const fetchData = async () => {
        await axios.get(`${BASE_URL}/line/getLinesByPlanId/${groupsId}`, {headers})
            .then(response => {
                // console.log(response, "get lines successfully")
                setData(response?.data?.obj)
            })
            .catch(err => {
                console.log(err, "get lines err")
            })
    }

    const fetchOldThemes = async () => {
        await axios.get(`${BASE_URL}/line/getOldThemes/${forLessonData?.groupData?.lessonId}`, {headers})
            .then(response => {
                // console.log(response,"get lines successfully")
                setOptions(response?.data?.obj)
            })
            .catch(err => {
                console.log(err, "get lines err")
            })
    }

    const fetchCreateLine = async (e) => {
        e.preventDefault();
        console.log(obj, "create line obj")
        await axios.post(`${BASE_URL}/line/createLineAndTheme`, {...obj, planId: groupsId}, {headers})
            .then(response => {
                console.log(response, "create line successfully")
                // setOptions(response?.data?.obj)
                fetchData();
                handleClose2();
            })
            .catch(err => {
                console.log(err, "create lines err")
            })
    }


    const fetchDownloadFile = async (fileName) => {

        console.log(fileName, "file name")
        await axios.get(`${BASE_URL}/topicFile/uploadFromSystem?fileName=${fileName}&subject=${fan}`, {headers})
            .then(response => {

                // fetchData();
                window.location.href = `${BASE_URL}/topicFile/uploadFromSystemUser?fileName=${fileName}&subject=${fan}`

            })
            .catch(err => {
                console.log(err, "create lines err")
            })
    }

    const saveOrUpdate = (e) => {
        e.preventDefault();
        if (oldObj?.themeId === null) {
            fetchCreateLine(e);
        } else {
            if (oldObj?.isMulti && btnTheme) {
                if (window.confirm('Are you sure? Because this theme used somewhere')) {
                    fetchUpdateLineAndTheme({...oldObj, isUpdate: btnTheme})
                }
            } else {
                fetchUpdateLineAndTheme({...oldObj, isUpdate: btnTheme})
            }
        }
    }

    const fetchUpdateLineAndTheme = async (object) => {
        await axios.put(`${BASE_URL}/line/updateLineAndTheme`, object, {headers})
            .then(response => {
                fetchData();
                handleClose2();
            })
            .catch(err => {
                console.log(err, "create lines err")
            })
    }

    useEffect(() => {
        if (oldObj?.themeId !== null && oldObj?.isMulti === null) {
            fetchCheckIsMultiUsedTheme(oldObj?.themeId)
        }
    }, [oldObj])


    const fetchCheckIsMultiUsedTheme = async (id) => {
        await axios.get(`${BASE_URL}/line/isMultiUsedTheme/${id}`, {headers})
            .then(response => {
                // console.log(response,"response check")
                setOldObj(prevState => ({...prevState, isMulti: response?.data}))
                handleOpen2();
            })
            .catch(err => {
                console.log(err, "err")
            })
    }

    return (
        <Container>
            <TitleMain>
                <p>{fan}</p>

                <Button onClick={() => navigate(-1)} variant="outlined" startIcon={<BiArrowBack/>}>
                    Back
                </Button>
            </TitleMain>
            <Card sx={{mt:3}}>
                <CardContent>
                    <Box sx={{display: "flex", justifyContent: "end", gap: "10px"}}>
                        <FormControlLabel
                            control={<Switch checked={checked} onChange={handleChange}/>}
                            label={<h6>Edit</h6>}/>
                    </Box>


                    {data?.map((item, index) => (
                        <MainCardBody key={index}>
                            <TitleTheme>
                                <IconHiden>
                                    <BsFillFileEarmarkTextFill/>
                                </IconHiden>
                                <p>
                                    {item.queue}-Mavzu:{item.theme.name}
                                </p>
                                {checked && (
                                    <>
                                        <IconButton aria-label="edit" color="success"
                                                    onClick={() => setOldObj(prevState => ({
                                                        ...prevState,
                                                        lineId: item?.id,
                                                        themeId: item?.theme?.id,
                                                        themeName: item?.theme?.name,
                                                    }))}
                                        >
                                            <FiEdit/>
                                        </IconButton>
                                        <IconButton aria-label="edit" onClick={handleOpenDelete}>
                                            <AiFillDelete color={`#ef5350`}/>
                                        </IconButton>
                                    </>)}
                            </TitleTheme>
                            <CardFile>
                                {item?.files?.map((file, key) => (
                                    <CardFileWrapper key={key}>
                                        {file.type !== "URL" ? (
                                            <CardFileItem onClick={() => fetchDownloadFile(file?.name)}>
                                                {typeFileIcon(file?.fileType, file?.type, file?.name)}
                                            </CardFileItem>
                                        ) : (
                                            <CardFileItem href={file?.url !== null && file?.url} target="_blank">
                                                {typeFileIcon(file?.fileType, file?.type, file?.name)}
                                            </CardFileItem>
                                        )}

                                        {checked && (
                                            <>
                                                <IconButton onClick={handleOpen} aria-label="edit" color="success">
                                                    <FiEdit/>
                                                </IconButton>
                                                <IconButton aria-label="delete" onClick={handleOpenDelete}>
                                                    <AiFillDelete color={`#ef5350`}/>
                                                </IconButton>
                                            </>)}

                                    </CardFileWrapper>
                                ))}

                                {checked &&
                                    <>
                                        <Button endIcon={<FaFileUpload/>} sx={{width: "200px"}} variant="outlined"
                                                onClick={() => handleOpen(item?.id)}>
                                            Upload file</Button>
                                        <Button endIcon={<MdQuiz/>} sx={{width: "200px"}} variant="outlined"
                                                onClick={() => navigate(`${item.id}`)}>
                                            Create test</Button>
                                    </>
                                }
                            </CardFile>

                        </MainCardBody>
                    ))}
                    {checked && <BoxNewTheme>
                        <Button sx={{width: "200px"}} variant="outlined" onClick={handleOpen2}>ADD THEME</Button>
                    </BoxNewTheme>}
                </CardContent>
            </Card>


            { /*Modal Upload File*/}

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} component={style2}>
                    <ModalTitle>
                        <h4>
                            Upload file
                        </h4>
                        <CloseBtnModal onClick={handleClose}> <IoClose size={22}/></CloseBtnModal>
                    </ModalTitle>
                    <ModalUploadeFile lineId={lineId} handleClose={handleClose} fetchData={fetchData}/>
                </Box>
            </Modal>

            {/*modal add theme*/}
            <Modal
                open={open2}
                onClose={handleClose2}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} component={style2}>
                    <ModalTitle>
                        <h4>
                            {
                                oldObj?.themeId !== null ? "Update theme" : "Add theme"
                            }
                        </h4>
                        <CloseBtnModal onClick={handleClose2}> <IoClose size={22}/></CloseBtnModal>
                    </ModalTitle>
                    <Box>
                        <Stack
                            sx={{mt: "25px"}}
                            direction="row"
                            justifyContent="start"
                            alignItems="center"
                            spacing={4}>
                            <Button variant={!btnTheme ? "outlined" : "contained"} color="success"
                                    onClick={handleNewTheme}>
                                {
                                    oldObj?.themeId === null ? "New topic" : "Update topic"
                                }
                            </Button>
                            <Button variant={btnTheme ? "outlined" : "contained"} color="error"
                                    onClick={handleOldTheme}>
                                {
                                    oldObj?.themeId === null ? "Old theme" : "Change old topic"
                                }
                            </Button>
                        </Stack>

                        <form onSubmit={saveOrUpdate}>
                            <Box sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "8px",
                                margin: "30px 0"
                            }}>
                                {
                                    oldObj?.themeId === null && <Box sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: "40px",
                                        border: "1px solid silver",
                                        borderRadius: "5px",
                                        padding: "10px"
                                    }}>
                                        {data?.length === 0 ? 1 : data?.[data?.length - 1].queue + 1}
                                    </Box>
                                }

                                {
                                    btnTheme ?
                                        <TextField
                                            type="text"
                                            required
                                            value={
                                                oldObj?.themeId === null ? obj?.newTheme : oldObj?.themeName
                                            }
                                            onChange={(e => oldObj?.themeId === null ?
                                                    setObj(prevState => ({
                                                        ...prevState,
                                                        newTheme: e.target.value
                                                    }))
                                                    :
                                                    setOldObj(prevState => ({
                                                        ...prevState,
                                                        themeName: e.target.value
                                                    }))
                                            )}
                                            sx={{width: "100%"}}
                                            id="outlined-basic"
                                            label="Theme"
                                            variant="outlined"
                                            name="newTheme"
                                            size="small"/>
                                        :
                                        <Autocomplete
                                            id="grouped-demo"
                                            onChange={handleChangeAt}
                                            options={options}
                                            getOptionLabel={(option) => option?.themeName}
                                            sx={{width: "100%"}}
                                            size="small"
                                            renderInput={(params) => <TextField {...params} label="Theme" required/>}
                                        />
                                }


                            </Box>

                            <BtnBox>
                                <Button
                                    variant={'contained'}
                                    endIcon={oldObj?.themeId === null ? <IoSaveSharp size={18}/> : <FaEdit size={18}/>}
                                    type="submit"
                                >
                                    {
                                        oldObj?.themeId === null ? "Save" : "Update"
                                    }
                                </Button>
                            </BtnBox>
                        </form>


                    </Box>
                </Box>
            </Modal>


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
                            <Button variant="contained" color="error">
                                Ok
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Modal>

            {/* message modal */}
            <MessagesTeacherAndStudents open={openMesg} setOpen={setOpenMesg} scroll={scroll}/>

        </Container>
    );
};

const BtnBox = styled.div`
    display: flex;
    justify-content: center;
`;

const BtnSave = styled.button`
    padding: 5px 20px;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    color: ${mainColor};
    border: 1px solid ${mainColor};
    background-color: #ffffff;

    :hover {
        background-color: ${mainColor};
        color: #ffffff;
    }
`

const BoxNewTheme = styled.div`
    display: flex;
    justify-content: center;
`;
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
const CardFile = styled.div`
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
`
const CardFileWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`
const CardFileItem = styled.a`
    width: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    padding: 10px;
    border-radius: 5px;
    background-color: #0a62af;
    opacity: 0.8;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    font-weight: bold;

    :hover {
        opacity: 1;
        color: #fff;
    }

    :focus {
        color: #fff;
    }
`
const IconHiden = styled.div`
    ${extrasmall({
        display: "none",
    })}

`
const TitleTheme = styled.div`
    margin-top: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #053767;

    p {
        font-size: 18px;
        font-weight: bold;
        ${extrasmall({
            fontSize: "15px",
        })}
    }
`;

const MainCardBody = styled.div`
    margin-bottom: 50px;
`
const MainCard = styled.div`
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;

`;
const TitleMain = styled.h1`
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    p {
        color: ${mainColor};
        font-size: 30px;
        font-weight: bold;
        ${extrasmall({
            textAlign: "center",
            fontSize: "20px",
        })}
    }
`;


const Container = styled.div`
    width: 100%;
    padding: 1rem;
`;

export default TeacherOneScience;
