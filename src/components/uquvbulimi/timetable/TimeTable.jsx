import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import moment from "moment/moment";
import Button from "@mui/material/Button";
import {BiUpload} from "react-icons/bi";
import {IoSend} from "react-icons/io5";
import Box from "@mui/material/Box";
import {ButtonGroup, Fade} from "@mui/material";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Tooltip from "@mui/material/Tooltip";
import {BASE_URL, getHeaders, TOKEN, TokenType} from "../../../utills/ServiceUrls";
import axios from "axios";
import {toast} from "react-toastify";
import {extrasmall} from "../../../responsiv";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import EduYearModal from "./EduYearModal";
import IconButton from "@mui/material/IconButton";
import {BsPencilSquare} from "react-icons/bs";
import {FaTrash} from "react-icons/fa";
import DataGridCustomize from "../../dataGridCustomize/DataGridCustomize";
import StatisticsSchedule from "./StatisticsSchedule";

const TimeTable = () => {
    const [progress, setProgress] = React.useState(0);
    const yearsData = [2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035]
    const typesDayData = [
        {
            name: "Orientation week",
            shortname: "OW",
            bgColor: "#FFF",
            type: "ORIENTATION_WEEK"
        },
        {
            name: "Theoretical education",
            shortname: "TE",
            bgColor: "#d0ffff",
            type: "THEORETICAL_EDUCATION"
        },
        {
            name: "Final exams",
            shortname: "F",
            bgColor: "#90b5e1",
            type: "FINAL_EXAMS"
        },
        {
            name: "Vacation",
            shortname: "V",
            bgColor: "#e4b7b7",
            type: "VACATION"
        },
        {
            name: "Theoretical/Practical education",
            shortname: "T/P",
            bgColor: "#d0ffff",
            type: "THEORETICAL_PRACTICAL_EDUCATION"
        },
        {
            name: "Self-study/Distancion education",
            shortname: "S/D",
            bgColor: "#d0ffff",
            type: "SELF_STUDY_DISTANCE_EDUCATION"
        },
        {
            name: "Extramural studies",
            shortname: "ES",
            bgColor: "#c5d79e",
            type: "EXTRAMURAL_STUDIES"
        }
    ]
    const eduTypesData = ["KUNDUZGI_KECHKI", "SIRTQI", "MAGISTRATURE"]
    const typeFileData = ["DEFAULT", "MED"]

    const [yearsArr, setYearsArr] = useState([]);

    const [eduYers, seteduYers] = useState("");
    const [type, setType] = useState(typesDayData[0].type);
    const [year, setYear] = useState(yearsData.find(y => y === moment().year()));
    const [typeFile, setTypeFile] = useState(typeFileData[0])
    const [typesDay, setTypesDay] = useState(typesDayData[0].name)
    const [eduTypes, setEduTypes] = useState(eduTypesData[0])
    const [weekNum, setWeekNum] = useState("");
    const [file, setFile] = useState(null)
    const [disabled, setDisabled] = useState(true)

    const [weekData, setWeekData] = useState(`${moment(new Date).year()}-W${moment(new Date()).isoWeek()}`)
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const getSortNumberOfWeek = () => {
        eduYers && axios.get(`${BASE_URL}/education/getSortNumberOfWeek/${yearsArr?.find(y => y?.name === eduYers)?.id}`, getHeaders())
            .then(res => {
                setWeekNum(res.data.obj || 1)
            })
            .catch(err => {
                console.log(err)
            })
    }
    const getEduYearsData = () => {
        axios.get(`${BASE_URL}/education/educationYearsForCRUD`, getHeaders())
            .then(res => {
                setYearsArr(res.data.obj.map((item, index) => ({...item, count: index + 1})))
                seteduYers(res.data?.obj[0]?.name)
            })
            .catch(err => {
                console.log(err)
                setYearsArr([])
                seteduYers("")
            })
    }
    useEffect(() => {
        if (eduYers !== "" && year != "" && file !== null && weekData !== "" && weekNum !== "") {
            setDisabled(false)
        } else {
            setDisabled(true)
        }

    }, [year, file, weekData, weekNum]);

    useEffect(() => {
        getEduYearsData()
    }, [])

    useEffect(() => {
        getSortNumberOfWeek()
    }, [eduYers])


    const handleSub = (e) => {
        e.preventDefault();
        const dataInput = {
            eduYers,
            year,
            type,
            weekedu: weekNum,
            typesDay,
            eduTypes,
            week: {
                weekNumber: moment(weekData).isoWeek(),
                monthName: moment(weekData).format('MMMM'),
                monthNumber: moment(weekData).format('MM'),
                year: moment(weekData).year(),
                monday: moment(weekData).startOf('isoWeek').format('DD'),
                saturday: moment(weekData).startOf('isoWeek').add(5, 'days').format('DD.MM.YYYY'),
            },
            typeFile,
            file
        }

        console.log(dataInput)
        savePhoto(e)


    }


    const savePhoto = (e) => {
        e.preventDefault()
        const url = `${BASE_URL}/attachment/upload/${yearsArr?.find(y => y?.name === eduYers)?.id}/${moment(weekData).isoWeek()}?year=${moment(weekData).year()}&defaultOrMed=${typeFile}&weekNumber=${weekNum}&eduType=${eduTypes}&weekType=${type}&startWeek=${moment(weekData).startOf('isoWeek').format('DD.MM.YYYY')}&endWeek=${moment(weekData).startOf('isoWeek').add(5, 'days').format('DD.MM.YYYY')}`;
        const formData = new FormData();
        formData.append('file', file);
        const token = localStorage.getItem(TOKEN)
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': TokenType + token,
                'Access-Control-Allow-Origin': '*'
            }
        }
        console.log(url, "url");
        console.log(formData);
        axios.post(url, formData, config)
            .then((response) => {
                toast.success(response?.data?.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                })
                setOpen(false)
            })
            .catch(err => {
                toast.error(err?.response?.data?.message, {
                    position: "top-right",
                    autoClose: false,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                })
            })
    }

    LinearProgressWithLabel.propTypes = {
        value: PropTypes.number.isRequired,
    };

    function LinearProgressWithLabel(props) {
        return (
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Box sx={{width: '100%', mr: 1}}>
                    <LinearProgress variant="determinate" {...props} />
                </Box>
                <Box sx={{minWidth: 35}}>
                    <Typography variant="body2" color="text.secondary">{`${Math.round(
                        props.value,
                    )}%`}</Typography>
                </Box>
            </Box>
        );
    }


    return (
        <Container>
            <Box display="flex" justifyContent="end" gap={2} mb={3}>
                <Button variant="contained" onClick={handleOpen}>Add weekly training file</Button>
            </Box>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{backdrop: Backdrop}}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={open}>
                    <Box sx={style} component={styleModal}>
                        <form onSubmit={handleSub}>
                            <WrapperInput>
                                <FormControl>
                                    <InputLabel id="demo-simple-select-label">O'quv yili</InputLabel>
                                    <Select
                                        size="small"
                                        sx={{width: "200px"}}
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={eduYers}
                                        label="O'quv yili"
                                        onChange={e => seteduYers(e.target.value)}
                                    >
                                        {yearsArr.length > 0 && yearsArr.map((item, i) => (
                                            <MenuItem key={i} value={item.name}>{item.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl>
                                    <InputLabel id="demo-simple-select-label1">Year</InputLabel>
                                    <Select
                                        size="small"
                                        sx={{width: "200px"}}
                                        labelId="demo-simple-select-label1"
                                        id="demo-simple-select1"
                                        value={year}
                                        label="Year"
                                        onChange={e => setYear(e.target.value)}
                                    >
                                        {yearsData.map((item, key) => (
                                            <MenuItem value={item} key={key}>{item}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <InputLabel id="demo-simple-select-label1">Type of week</InputLabel>
                                    <Select
                                        size="small"
                                        sx={{width: "200px", borderRadius: "5px"}}
                                        labelId="demo-simple-select-label1"
                                        id="demo-simple-select1"
                                        value={typesDay}
                                        label="Type of week"
                                        onChange={e => setTypesDay(e.target.value)}
                                    >
                                        {typesDayData.map((item, key) => (
                                            <MenuItem value={item.name} key={key} onClick={() => setType(item.type)}>
                                                <Box sx={{
                                                    width: "100%",
                                                    display: "flex",
                                                    gap: "5px",
                                                    alignItems: "center",
                                                }}>
                                                    <Box sx={{
                                                        fontSize: "12px",
                                                        borderRight: "none",
                                                        width: "40px",
                                                        padding: "0 3px",
                                                        height: "100%",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        borderRadius: "5px",
                                                        border: "1px solid silver",
                                                        backgroundColor: `${item.bgColor}`,
                                                        fontWeight: "bold"
                                                    }}>
                                                        {item.shortname}
                                                    </Box>

                                                    <p>{item.name}</p>
                                                </Box>
                                            </MenuItem>
                                        ))}

                                    </Select>
                                </FormControl>

                                <FormControl>
                                    <InputLabel id="demo-simple-select-label1">Type of education</InputLabel>
                                    <Select
                                        size="small"
                                        sx={{width: "200px"}}
                                        labelId="demo-simple-select-label1"
                                        id="demo-simple-select1"
                                        value={eduTypes}
                                        label="Type of education"
                                        onChange={e => setEduTypes(e.target.value)}
                                    >
                                        {eduTypesData.map((item, key) => (
                                            <MenuItem value={item} key={key}>{item}</MenuItem>
                                        ))}

                                    </Select>
                                </FormControl>

                                <TextField
                                    size="small"
                                    value={weekNum}
                                    label="Week of education"
                                    type="number"
                                    sx={{width: "200px"}}
                                    InputProps={{inputProps: {min: 1, max: 53}}}
                                    onChange={e => setWeekNum(e.target.value)}
                                />

                                <TextField
                                    size="small"
                                    label="Date of the week"
                                    type="week"
                                    value={weekData}
                                    sx={{width: "200px"}}
                                    onChange={e => setWeekData(e.target.value)}
                                />
                                <FormControl>
                                    <InputLabel id="demo-simple-select-label1">Data type</InputLabel>
                                    <Select
                                        size="small"
                                        sx={{width: "200px"}}
                                        labelId="demo-simple-select-label1"
                                        id="demo-simple-select1"
                                        value={typeFile}
                                        label="Data type"
                                        onChange={e => setTypeFile(e.target.value)}
                                    >
                                        {typeFileData.map((item, key) => (
                                            <MenuItem value={item} key={key}>{item}</MenuItem>
                                        ))}

                                    </Select>
                                </FormControl>
                                <Button
                                    sx={{width: "200px", overflow: 'hidden'}}
                                    size="sm"
                                    variant="outlined"
                                    component="label"
                                    endIcon={<BiUpload/>}
                                >
                                    <p>{file?.name ? (file.name.length < 13 ? file.name : file.name.substring(0, 13) + "....") : "Choose file "}</p>
                                    <input
                                        onChange={(e) => setFile(e.target.files[0])}
                                        accept="xml,.xml"
                                        type="file"
                                        hidden
                                    />
                                </Button>


                            </WrapperInput>
                            {progress > 0 && <Box sx={{width: '100%', marginTop: "15px"}}>
                                <LinearProgressWithLabel value={progress}/>
                            </Box>}


                            <Box sx={{
                                marginTop: "15px",
                                width: "100%",
                                display: "flex",
                                justifyContent: "end",
                                gap: "15px"
                            }}>
                                <Button
                                    onClick={handleClose}
                                    variant="outlined"
                                >
                                    Cancel
                                </Button>
                                <Tooltip title={disabled ? "Fill in all the fields !" : ""} placement="top">
                                        <span>
                                            <Button
                                                disabled={disabled}
                                                endIcon={<IoSend size={15}/>}
                                                type="submit"
                                                variant="contained"
                                            >
                                        Send
                                    </Button>
                                        </span>
                                </Tooltip>

                            </Box>

                        </form>
                    </Box>
                </Fade>
            </Modal>

             <StatisticsSchedule/>

        </Container>
    );
};

const style = {
    zIndex: 0,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "480px",
    bgcolor: 'background.paper',
    borderRadius: "5px",
    boxShadow: 24,
    p: 2,
};
const styleModal = styled.div`
    ${extrasmall({
        width: "330px !important",
    })}
`
const WrapperInput = styled.div`
    margin-top: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    ${extrasmall({
        gridTemplateColumns: "1fr",
        justifyItems: "center",
    })}
`


const Container = styled.div`
    width: 100%;
    padding: 1rem;

    .MuiDataGrid-columnHeaderTitleContainer {
        justify-content: center;
    }
`;


export default TimeTable;
