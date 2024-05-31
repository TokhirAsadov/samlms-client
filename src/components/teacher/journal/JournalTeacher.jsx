import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {extrasmall} from "../../../responsiv";
import Modal from "@mui/material/Modal";
import {RiCloseLine} from "react-icons/ri";
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import Evaluate from "./Evaluate";
import {useDispatch, useSelector} from "react-redux";
import {fetchEducationYear} from "../../../redux/actions/educationYear/education_year_actions";
import {educationYearStatisticsFetching} from "../../../redux/slice/educationYear/education_year_statistics_slice";
import axios from "axios";
import moment from "moment";
import LinearProgress from "@mui/material/LinearProgress";
import {AiFillInfoCircle} from "react-icons/ai";
import StudentsNbModal from "./StudentsNbModal";
import StudentToday from "./StudentToday";
import SubjectStatistics from "./SubjectStatistics";
import Button from "@mui/material/Button";
import {BiArrowBack} from "react-icons/bi";
import EvaluateToday from "./EvaluateToday";
import EmptyDataImg from "../../emptyDataImg/EmptyDataImg";
import IconButton from "@mui/material/IconButton";
import {FaRegCalendarAlt, FaRegCalendarCheck, FaSortDown, FaSortUp} from "react-icons/fa";
import {FormGroup, ListItemIcon, Menu, Skeleton, TextField} from "@mui/material";
import {BsThreeDotsVertical} from "react-icons/bs";
import Tooltip from "@mui/material/Tooltip";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import AllStudentsNbModal from "./AllStudentsNbModal";
import FileStatement from "./FileStatement";
import GradeAttendance from "./GradeAttendance";
import DynamicAttendance from "./DynamicAttendance";
import AttendanceMenu from "./AttendanceMenu";
import ButtonSaveAttendance from "./ButtonSaveAttendance";
import {resetData} from "../../../redux/slice/attendanceJournal/attendanceJournal_slice";
import GradeToday from "./GradeToday";
import DescriptionInputForTable from "./DescriptionInputForTable";
import ButtonSaveScore from "./ButtonSaveScore";
import {resetDataScore} from "../../../redux/slice/multipartScore/multipartScore_slice";
import GroupAttendanceAll from "./GroupAttendanceAll";
import AddNewTheme from "./AddNewTheme";
import ScoreData from "./ScoreData";
import AllScoreStudentsFullModal from "./AllSCoreData/AllScoreStudentsFullModal";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {MdClose} from "react-icons/md";
import AttendanceSelectedDate from "./AttendanceSelectedDate";
import {GoChecklist} from "react-icons/go";
import {LuClipboardEdit} from "react-icons/lu";
import error from "../../error/Error";
import AlertForJournal from "../statement/AlertForJournal";
import ButtonSaveStatement from "../statement/ButtonSaveStatement";

const JournalTeacher = () => {

    const eduTypes = [
        "ALL",
        "KUNDUZGI_KECHKI",
        "SIRTQI",
        "MAGISTRATURE"
    ]
    const [eduType, setEduType] = useState(eduTypes[0]);
    const [scien, setScien] = useState("");
    const [groupSelect, setGroupSelect] = useState("");

    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [open4, setOpen4] = useState(false);
    const [oneSciencesNb, setOneSciencesNb] = useState({});
    const [oneSciencesScore, setOneSciencesScore] = useState([]);
    const [todayGrade, setTodayGrade] = useState({
        id: null,
        grade: null
    });
    const {headers} = getHeaders();
    const [lessons, setLessons] = useState([]);
    const [groups, setGroups] = useState([]);
    const [eduYears, setEduYears] = useState([]);
    const user = useSelector(state => state?.user?.user) || null;
    const educationYear = useSelector(state => state?.educationYear?.educationYear) || null;
    const dispatch = useDispatch();
    const [allDataStudents, setAllDataStudents] = useState([]);
    const [loadData, setLoadData] = useState(false);
    const [loadAttendance, setLoadAttendance] = useState(false)
    const [studentData, setStudentData] = useState(null)
    const [scoresContainer, setScoresContainer] = useState(false)
    const [btnToggle, setBtnToggle] = useState(false)
    const [btnToggle2, setBtnToggle2] = useState(false)
    const [openEvaluateToday, setOpenEvaluateToday] = useState(false)
    const [sortedFullNames, setSortedFullNames] = useState(false)
    const [sortedScore, setSortedScore] = useState(false)
    const [sortedAttendance, setSortedAttendance] = useState(false)
    const [selectedColumnSort, setSelectedColumnSort] = useState('fullNames')
    const [showAttendance, setShowAttendance] = useState(false)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openTableSetting = Boolean(anchorEl);
    const [maxScoreForAttendance, setMaxScoreForAttendance] = useState(null)
    const [dataForChangeAttendance, setDataForChangeAttendance] = useState(null)
    const [modalDynamicAttendance, setModalDynamicAttendance] = useState(false)
    const [anchorElAttendance, setAnchorElAttendance] = React.useState(null);
    const attendanceMenuOpen = Boolean(anchorElAttendance);
    const hours = useSelector(state => state.hourSection)
    const [allThemeData, setAllThemeData] = useState([])
    const [themeModal, setThemeModal] = useState(false)
    const [allScoreStudentsModal, setAllScoreStudentsModal] = useState(false)
    const [clickedCalendar, setClickedCalendar] = useState(false)
    const [calendarValue, setCalendarValue] = useState(moment());
    const [loadForCalendar, setLoadForCalendar] = useState(false);
    const [anchorElAtt, setAnchorElAtt] = React.useState(false);

    const handleClickAttSetting = (event) => {
        setAnchorElAtt(event.currentTarget);
    };
    const handleCloseAttSetting = () => {
        setAnchorElAtt(false);
    };

    const handleMenuAttClick = (event) => {
        setAnchorElAttendance(event.currentTarget);
    };
    const handleMenuAttClose = () => {
        setAnchorElAttendance(null);
    };


    const handleCloseDynamicAttendance = () => setModalDynamicAttendance(false)
    const handleOpenDynamicAttendance = () => setModalDynamicAttendance(true)
    const handleClickTableSetting = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseTableSetting = () => {
        setAnchorEl(null);
    };

    const dateFormat = (year, week, day) => {
        const momentObject = moment().year(year).isoWeek(week).day(day);

        if (momentObject.isValid) {
            return momentObject.format('DD.MM.YYYY');
        } else {
            return 'Invalid Date';
        }
    };
    const handleChange = (event) => {
        event.target.value !== educationYear?.name && dispatch(educationYearStatisticsFetching())
        dispatch(fetchEducationYear(eduYears?.find(i => i?.name === event.target.value)))
        // setsemestrData(event.target.value);
    };

    const fetchEducationYears = () => {
        axios.get(BASE_URL + '/education/educationYearsForSelected', {headers})
            .then(res => {
                // console.log(res?.data?.obj,"education years res come")
                setEduYears(res?.data?.obj);
                dispatch(fetchEducationYear(res?.data?.obj?.[0]))
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        fetchEducationYears();
    }, [])


    const fetchLessons = async () => {
        educationYear && await axios.get(`${BASE_URL}/groupConnect/subjectsOfTeacher/${user?.id}?educationId=${educationYear?.id}`)
            .then((response) => {
                setLessons(response.data?.obj);
                setScien(response.data?.obj[0].name)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    const getThemeAll = async (scien, lessons, eduId) => {
        if (groupSelect !== "") {
            scien && lessons?.some(l => l?.name === scien) && await axios.get(`${BASE_URL}/themeOfSubjectForGrading/getThemes/${lessons?.find(l => l?.name === scien)?.id}/${groups?.find(g => g?.name === groupSelect)?.id}?educationYearId=${eduId}`, {headers})
                .then(res => {
                    setAllThemeData(res.data.obj)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
    const getDataSelectedDate = (science, lessons, date) => {
        const year = date.year();
        const week = date.isoWeek();
        const day = date.day();

        if (groupSelect !== '' && clickedCalendar) {
            setLoadForCalendar(true)
            const subjectId = lessons?.find(l => l?.name === science)?.id;
            const groupId = groups?.find(g => g?.name === groupSelect)?.id;

            axios.get(`${BASE_URL}/groupConnect/getStatisticsOfGroupForTeacherByDay/${subjectId}/${groupId}?year=${year}&week=${week}&day=${day}`, {headers})
                .then(res => {
                    const resData = res.data;
                    const selectedDate = Array.isArray(resData) && resData.length > 0 ? resData[0] : [];

                    setAllDataStudents(prevState => prevState.map(item => ({
                        ...item,
                        selectedDate: selectedDate.filter(fl => fl.studentId === item.studentId)
                    })));
                })
                .catch(err => {
                    console.error(err.response || err);
                })
                .finally(() => {
                    setLoadForCalendar(false)
                });
        }
    };
    const getGroupsData = (scien, lessons, userId, eduType, eduId) => {
        scien && lessons?.some(l => l?.name === scien) && axios.get(`${BASE_URL}/groupConnect/groupsOfTeacher/${userId}?educationId=${eduId}&subjectId=${lessons?.find(l => l?.name === scien)?.id}&eduType=${eduType}`)
            .then((response) => {
                setGroups(response?.data?.obj);
                //setGroupSelect(response?.data?.obj[0]?.name)
            })
            .catch((err) => {
                console.log(err, "error getting")
            })
    }


    useEffect(() => {

        setGroupSelect("")

        getGroupsData(scien, lessons, user?.id, eduType, educationYear?.id)

    }, [scien, eduType]);

    const fetchCoreDataStudents = () => {
        handleCloseCalendarHeader();
        dispatch(resetDataScore());
        if (groupSelect !== "") {
            if (!showAttendance) {
                setLoadData(true)
                axios.get(`${BASE_URL}/groupConnect/getStatisticsOfGroupForTeacherForTodayWithMax/${educationYear?.id}/${groups?.find(g => g?.name === groupSelect)?.id}?subjectId=${lessons?.find(l => l?.name === scien)?.id}&year=${moment(new Date).year()}&week=${moment(new Date).week()}&day=${moment(new Date).day()}`, {headers})
                    .then(response => {
                        setAllDataStudents(response.data?.[0][0].students)
                        setMaxScoreForAttendance([response.data?.[0][0].students[0]?.maxGradeForAttendance, response.data?.[0][0].students[0]?.gradeForAttendance])
                        setLoadData(false)
                    })
                    .catch(err => {
                        console.log(err)
                        setLoadData(false)
                    })
            } else {
                setLoadAttendance(true)
                axios.get(`${BASE_URL}/groupConnect/getStatisticsOfGroupForTeacher/${educationYear?.id}/${groups?.find(g => g?.name === groupSelect)?.id}?subjectId=${lessons?.find(l => l?.name === scien)?.id}`, {headers})
                    .then(response => {
                        const formatData = response.data[0][0]?.students.map(allInfo => {
                            const subjectNb = allInfo?.subjects.filter(item => item?.statistics.length === 0 || item.statistics?.some(i => i?.isCome === false))?.map(item => {
                                const date = moment().year(item.year).week(item.week).day(item.day).format('DD.MM.YYYY')
                                const hourStart = hours.find(h => h.number === item.section).start
                                return {...item, date, hourStart: moment(hourStart).format("HH:mm")}
                            }).filter(item => moment(`${item.date} ${item.hourStart}`, 'DD.MM.YYYY HH:mm').isSameOrBefore(moment(), 'minute')).length
                            return {...allInfo, subjectNb}
                        })
                        setAllDataStudents(formatData)
                        setMaxScoreForAttendance([response.data?.[0][0].students[0]?.maxGradeForAttendance, response.data?.[0][0].students[0]?.gradeForAttendance])
                        setLoadAttendance(false)
                    })
                    .catch(err => {
                        console.log(err)
                        setLoadAttendance(false)
                    })
            }

        }
    }

    useEffect(() => {
        fetchCoreDataStudents()
        //getAllGrades(lessons)
        getThemeAll(scien, lessons, educationYear?.id)
    }, [groupSelect, btnToggle, showAttendance])

    useEffect(() => {
        getDataSelectedDate(scien, lessons, calendarValue)
    }, [groupSelect, clickedCalendar, calendarValue]);

    useEffect(() => {
        fetchLessons()
    }, [educationYear])


    const handleOpen = (data) => {
        setOneSciencesNb(data)
        setOpen(true)
    };
    const handleOpen4 = () => {
        setOpen4(true)
    };
    const handleClose2 = () => setOpen2(false);
    const handleClose3 = () => setOpen3(false);
    const handleClose4 = () => setOpen4(false);
    const handleOpen3 = (data) => {
        setOpen3(true)
        setStudentData(data)

    };
    const handleOpen2 = (item) => {
        setScoresContainer(true)
        console.log(item)
        setOneSciencesScore(item)
    };
    const handleOpenEvaluateToday = (item) => {
        setOneSciencesScore(item)
    }
    useEffect(() => {
        oneSciencesScore !== null && btnToggle && setOpenEvaluateToday(true)
    }, [oneSciencesScore])

    useEffect(() => {
        !openEvaluateToday && setOneSciencesScore(null)
    }, [openEvaluateToday])

    useEffect(() => {
        setBtnToggle(btnToggle)
        setShowAttendance(showAttendance)
    }, [])
    const handleClose = () => setOpen(false);

    const handleChange1 = (event) => {
        setScien(event.target.value);

    };
    const handleChange2 = (event) => {
        setGroupSelect(event.target.value);
        setShowAttendance(false)
    };


    const sortedData = (a, b) => {

        if (selectedColumnSort === 'fullNames') {
            if (!sortedFullNames) {
                //a-z
                if (a.fullName > b.fullName) return 1;
                else if (a.fullName < b.fullName) return -1;
                return 0
            } else if (sortedFullNames) {
                //z-a
                if (a.fullName < b.fullName) return 1;
                else if (a.fullName > b.fullName) return -1;
                return 0
            }
        }
        if (selectedColumnSort === 'attendance') {
            if (!sortedAttendance) {
                //a-z
                if (a.subjectNb > b.subjectNb) return 1;
                else if (a.subjectNb < b.subjectNb) return -1;
                return 0
            } else if (sortedAttendance) {
                //z-a
                if (a.subjectNb < b.subjectNb) return 1;
                else if (a.subjectNb > b.subjectNb) return -1;
                return 0
            }
        }

        if (selectedColumnSort === 'score') {
            const formatScore1 = parseFloat(((a?.allSumGrade || 0) + (a?.allGradesForAttendance || 0))?.toFixed(3))
            const formatScore2 = parseFloat(((b?.allSumGrade || 0) + (b?.allGradesForAttendance || 0))?.toFixed(3))
            if (!sortedScore) {
                //a-z
                if (formatScore1 > formatScore2) return 1;
                else if (formatScore1 < formatScore2) return -1;
                return 0
            } else if (sortedScore) {
                //z-a
                if (formatScore1 < formatScore2) return 1;
                else if (formatScore1 > formatScore2) return -1;
                return 0
            }
        }
        if (selectedColumnSort === 'evaluate') {
            if (!sortedScore) {
                //a-z
                if (a.todayGrade > b.todayGrade) return 1;
                else if (a.todayGrade < b.todayGrade) return -1;
                return 0
            } else if (sortedScore) {
                //z-a
                if (a.todayGrade < b.todayGrade) return 1;
                else if (a.todayGrade > b.todayGrade) return -1;
                return 0
            }
        }


    }
    const handleToggle = (event) => {
        setBtnToggle(event.target.checked)
    }
    const handleToggle2 = (event) => {
        setBtnToggle2(event.target.checked);
        dispatch(resetDataScore())
    }
    const handleShowAttendance = (event) => {
        setShowAttendance(event.target.checked)
    }

    const handleSortNameClick = () => {
        setSortedFullNames(prev => !prev)
        setSelectedColumnSort('fullNames')
    }
    const handleSortAttendanceClick = () => {
        setSortedAttendance(prev => !prev)
        setSelectedColumnSort('attendance')
    }
    const handleSortScoreClick = () => {
        setSortedScore(prev => !prev)
        setSelectedColumnSort('score')
    }
    const handleSortEvaluateClick = () => {
        setSortedScore(prev => !prev)
        setSelectedColumnSort('evaluate')
    }
    const handleNoSave = () => {
        dispatch(resetData());
        dispatch(resetDataScore());
    };
    const handleCloseCalendarHeader = () => {
        dispatch(resetData());
        setClickedCalendar(false)
        setCalendarValue(moment())
    }

    useEffect(() => {
        todayGrade?.id && todayGrade?.grade && setAllDataStudents([...allDataStudents?.filter((i) => i?.studentId !== todayGrade?.id), {
            ...allDataStudents?.find((i) => i?.studentId === todayGrade?.id),
            todayGrade: todayGrade?.grade
        }])
    }, [todayGrade])

    return (
        <Container>
            {scoresContainer &&
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'end',
                }}>
                    <Button onClick={() => setScoresContainer(false)} variant="outlined" startIcon={<BiArrowBack/>}>
                        Back
                    </Button>
                </Box>}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: "30px",
                }}>

                <CardInput>
                    <Box sx={{minWidth: 180, background: "#fff"}}>
                        <FormControl size={'small'} fullWidth>
                            <InputLabel htmlFor='semestr'>Academic year</InputLabel>
                            <Select
                                labelId="semestr"
                                id="demo-simple-select"
                                value={educationYear?.name}
                                onChange={handleChange}
                                label="Academic year"
                                disabled={scoresContainer}
                            >
                                {eduYears?.map((item, key) => (
                                    <MenuItem key={item?.id} value={item?.name}>{item?.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{width: 200, background: "#fff"}}>
                        <FormControl size={'small'} fullWidth>
                            <InputLabel id="fanselect">Subject</InputLabel>
                            <Select
                                labelId="fanselect"
                                id="demo-simple-select2"
                                value={scien}
                                label="Subject"
                                onChange={handleChange1}
                                disabled={scoresContainer}
                            >
                                {lessons?.map((item, key) => (
                                    <MenuItem key={item?.id} value={item?.name}>{item?.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{width: 200, background: "#fff"}}>
                        <FormControl size={'small'} fullWidth>
                            <InputLabel id="demo-simple-select-label">Education type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={eduType}
                                label="Education type"
                                onChange={(e) => setEduType(e.target.value)}
                                disabled={scoresContainer}
                            >
                                {eduTypes?.map((item, key) => (
                                    <MenuItem key={key} value={item}>{item}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{width: 200, background: "#fff"}}>
                        <FormControl size={'small'} fullWidth>
                            <InputLabel id="demo-simple-select-label1">Group</InputLabel>
                            <Select
                                labelId="demo-simple-select-label1"
                                id="demo-simple-select1"
                                value={groupSelect}
                                label="Group"
                                onChange={handleChange2}
                                disabled={scoresContainer}
                            >
                                {groups
                                    ?.map((item, key) => (
                                        <MenuItem key={item?.id} value={item?.name}>{item?.name}</MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <GradeAttendance lessons={lessons} userId={user?.id} eduType={'ALL'} eduId={educationYear?.id}/>
                </CardInput>
            </Box>
            {!scoresContainer ? (
                <Cardstudents>
                    <GroupTitle>
                        <h5>Group: {groupSelect}</h5>
                        <AlertForJournal
                            data={allDataStudents}
                            loadData={loadData}
                            eduId={educationYear?.id}
                            groupId={groups?.find(g => g?.name === groupSelect)?.id}
                            subjectId={lessons?.find(l => l?.name === scien)?.id}
                        />
                    </GroupTitle>
                    <Box className={'maxScoreForAtt'}>
                        <Button
                            disabled
                            variant={'contained'}
                            size={'small'}
                        >
                            maximum score for attendance : {maxScoreForAttendance && maxScoreForAttendance[0] || 0}
                        </Button>
                        <Button
                            disabled
                            variant={'contained'}
                            size={'small'}
                        >
                            admission to each lesson
                            earns: {maxScoreForAttendance && maxScoreForAttendance[1] || 0} points
                        </Button>
                        {allDataStudents?.length > 0 && <Button
                            variant={'contained'}
                            size={'small'}
                            onClick={() => setAllScoreStudentsModal(true)}
                        >
                            View Grades
                        </Button>}
                        {
                            allScoreStudentsModal && <AllScoreStudentsFullModal
                                educationYearId={educationYear?.id}
                                allStudentData={allDataStudents}
                                groupId={groups?.find(g => g?.name === groupSelect)?.id}
                                groupName={groupSelect}
                                lessonId={lessons?.find(l => l?.name === scien)?.id}
                                allScoreStudentsModal={allScoreStudentsModal}
                                setAllScoreStudentsModal={setAllScoreStudentsModal}
                            />
                        }
                    </Box>

                    <Bodybox>
                        <table>
                            <thead>
                            <tr>
                                <th>№</th>
                                <th>
                                    <Box display='flex' gap={"8px"} alignItems={'center'} justifyContent={'center'}>
                                        <p>Full name</p>
                                        <IconButton size={'small'}
                                                    onClick={handleSortNameClick}>{!sortedFullNames ?
                                            <FaSortDown/> : <FaSortUp/>}</IconButton>
                                    </Box>
                                </th>
                                {!clickedCalendar && <th>
                                    <Box sx={{display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center'}}>
                                        Attendance
                                        <Tooltip title={'Setting'}>
                                            <IconButton onClick={handleClickAttSetting}>
                                                <BsThreeDotsVertical size={20} color={'#3c3c3c'}/>
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </th>}
                                {clickedCalendar && <th>
                                    <StylesCalendar>
                                        <LocalizationProvider sx={{width: 50}} dateAdapter={AdapterMoment}>
                                            <DatePicker
                                                label="Date"
                                                value={calendarValue}
                                                onChange={(newValue) => {
                                                    dispatch(resetData());
                                                    setCalendarValue(newValue)
                                                }}
                                                renderInput={(props) => <TextField {...props} />}
                                                shouldDisableDate={(date) => date >= new Date()}
                                            />
                                        </LocalizationProvider>
                                        <IconButton onClick={handleCloseCalendarHeader}>
                                            <MdClose color={'red'}/>
                                        </IconButton>
                                    </StylesCalendar>
                                </th>}
                                {showAttendance &&
                                    <>

                                        <th><Box display='flex' gap={"8px"} alignItems={'center'}
                                                 justifyContent={'center'}>
                                            <p> All attendance</p>
                                            <IconButton size={'small'}
                                                        onClick={handleSortAttendanceClick}>{!sortedAttendance ?
                                                <FaSortDown/> : <FaSortUp/>}</IconButton>
                                        </Box></th>
                                    </>}
                                <th>
                                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2}}>
                                        {!btnToggle ? (
                                            <Box display='flex' gap={"8px"} alignItems={'center'}
                                                 justifyContent={'center'}>
                                                <p>Score</p>
                                                <IconButton size={'small'}
                                                            onClick={handleSortScoreClick}>{!sortedScore ?
                                                    <FaSortDown/> : <FaSortUp/>}</IconButton>
                                            </Box>
                                        ) : (
                                            <Box display='flex' gap={"8px"} alignItems={'center'}
                                                 justifyContent={'center'}>
                                                <p>Evaluate</p>
                                                <IconButton size={'small'}
                                                            onClick={handleSortEvaluateClick}>{!sortedScore ?
                                                    <FaSortDown/> : <FaSortUp/>}</IconButton>
                                            </Box>
                                        )}
                                        <Tooltip title={'Setting'}>
                                            <IconButton onClick={handleClickTableSetting}>
                                                <BsThreeDotsVertical size={20} color={'#3c3c3c'}/>
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </th>
                                {
                                    btnToggle2 && (
                                        <th style={{backgroundColor: '#fff'}}>
                                            <DescriptionInputForTable
                                                groupId={groups?.find(g => g?.name === groupSelect)?.id}
                                                subjectId={lessons?.find(l => l?.name === scien)?.id}
                                                educationId={educationYear?.id}
                                                allThemeData={allThemeData}
                                                getThemeAll={() => getThemeAll(scien, lessons, educationYear?.id)}
                                                setThemeModal={setThemeModal}/>
                                        </th>
                                    )
                                }
                                {!btnToggle2 && <th>Info</th>}

                            </tr>
                            </thead>
                            <tbody>
                            {!loadData && allDataStudents?.sort(sortedData).map((item, key) => (
                                <tr key={key}>
                                    <td style={{textAlign: "center"}}>{key + 1}</td>
                                    <td><p>{item?.fullName}</p></td>
                                    <td>
                                        {clickedCalendar ?
                                            <AttendanceSelectedDate
                                                handleMenuAttClick={handleMenuAttClick}
                                                setDataForChangeAttendance={setDataForChangeAttendance}
                                                loadForCalendar={loadForCalendar}
                                                data2={item}
                                                data={item?.selectedDate}
                                            />
                                            :
                                            <StudentToday
                                                data={item?.subjects}
                                                data2={item}
                                                handleMenuAttClick={handleMenuAttClick}
                                                setDataForChangeAttendance={setDataForChangeAttendance}
                                            />}
                                    </td>

                                    {showAttendance && <>
                                        <td>
                                            {loadAttendance ?
                                                <Skeleton sx={{margin: '0 auto'}} width={100} height={50}/> :
                                                <BoxNb onClick={() => handleOpen(item)}>
                                                    {item?.subjectNb}
                                                </BoxNb>}
                                        </td>
                                    </>}

                                    {!btnToggle ? (
                                        <td>
                                            <ScoreData item={item} handleOpen2={() => handleOpen2(item)}/>
                                        </td>
                                    ) : (
                                        <td>
                                            <BoxNb onClick={() => handleOpenEvaluateToday(item)}>
                                                {(parseFloat((item?.todayGrade || 0).toFixed(3)))}
                                            </BoxNb>
                                        </td>
                                    )}
                                    {
                                        btnToggle2 && (
                                            <td>
                                                <GradeToday data={item}/>
                                            </td>
                                        )
                                    }
                                    {!btnToggle2 && <td>
                                        <BoxNb onClick={() => handleOpen3(item)}>
                                            <AiFillInfoCircle/>
                                        </BoxNb>
                                    </td>}

                                </tr>
                            ))}
                            {!loadData && allDataStudents?.length > 0 && <tr>
                                <td></td>
                                <td>
                                    <b>ATTENDANCE</b>
                                </td>
                                <td>
                                    {!showAttendance && <GroupAttendanceAll
                                        data={allDataStudents?.map(item => !clickedCalendar ? item?.subjects : item?.selectedDate)}/>}
                                </td>
                                {showAttendance && <td></td>}
                                <td></td>
                                <td></td>
                            </tr>}
                            </tbody>
                        </table>
                        <ButtonSaveAttendance handleCloseCalendarHeader={handleCloseCalendarHeader}
                                              fetchCoreDataStudents={fetchCoreDataStudents}/>
                        <ButtonSaveScore fetchCoreDataStudents={fetchCoreDataStudents} setBtnToggle2={setBtnToggle2}/>
                        {
                            loadData
                            &&
                            <Box sx={{width: '100%', marginTop: '20px'}}>
                                <LinearProgress/>
                            </Box>
                        }
                        {allDataStudents.length === 0 && <EmptyDataImg w={200} h={180}/>}
                    </Bodybox>

                </Cardstudents>
            ) : (
                <Cardstudents>
                    <Evaluate
                        getThemeAll={() => getThemeAll(scien, lessons, educationYear?.id)}
                        oneSciencesScore={oneSciencesScore}
                        fetchCoreDataStudents={fetchCoreDataStudents}
                        allThemeData={allThemeData}
                        setThemeModal={setThemeModal}
                    />
                </Cardstudents>
            )}
            <AttendanceMenu
                open={attendanceMenuOpen}
                anchorEl={anchorElAttendance}
                data={dataForChangeAttendance}
                handleClose={handleMenuAttClose}
            />
            {/*menu table setting*/}
            <Menu
                anchorEl={anchorElAtt}
                id="account-menu-att"
                open={anchorElAtt}
                onClose={handleCloseAttSetting}
                onClick={handleCloseAttSetting}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            >
                <MenuItem onClick={() => setClickedCalendar(true)}>
                    <ListItemIcon>
                        <FaRegCalendarAlt size={18}/>
                    </ListItemIcon>
                    Date
                </MenuItem>
                <MenuItem onClick={handleOpenDynamicAttendance}>
                    <ListItemIcon>
                        <LuClipboardEdit size={18}/>
                    </ListItemIcon>
                    Change attendance
                </MenuItem>

                <MenuItem onClick={handleOpen4}>
                    <ListItemIcon>
                        <FaRegCalendarCheck size={18}/>
                    </ListItemIcon>
                    all attendance
                </MenuItem>
                <MenuItem>
                    <FormControlLabel control={<Switch checked={showAttendance}
                                                       onChange={handleShowAttendance}/>}
                                      label="Attendance"/>
                </MenuItem>
            </Menu>
            <Menu
                anchorEl={anchorEl}
                id="account-menu-score"
                open={openTableSetting}
                onClose={handleCloseTableSetting}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        p: 1,
                        width: "225px",
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            >
                <FormGroup>
                    <FormControlLabel control={<Switch checked={btnToggle} onChange={handleToggle}/>}
                                      label="Evaluate"/>
                    <FormControlLabel control={<Switch checked={btnToggle2} onChange={handleToggle2}/>}
                                      label="Evaluate multipart"/>
                </FormGroup>
                {allDataStudents.length > 0 && <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: "10px",
                    mt: "10px",
                }}>
                    <FileStatement
                        educationYear={educationYear}
                        content={allDataStudents}
                        groupName={groupSelect}
                        subjectName={scien}
                    />

                </Box>}
            </Menu>


            {/* NB modal */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={stylenb} component={stylenb2}>
                    <CloseMyButtonForChild
                        onClick={handleClose}
                    ><RiCloseLine/></CloseMyButtonForChild>
                    <StudentsNbModal data={oneSciencesNb}/>
                </Box>
            </Modal>

            {/* baxolash */}

            <Modal
                open={open2}
                onClose={handleClose2}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleEvaluate} component={styleEval}>
                    <CloseMyButtonForChild
                        onClick={handleClose2}
                    ><RiCloseLine/></CloseMyButtonForChild>
                    <Evaluate oneSciencesScore={oneSciencesScore} setOpen2={setOpen2}/>
                </Box>
            </Modal>

            {/* buginni baxolash modal*/}
            <EvaluateToday
                getThemeAll={() => getThemeAll(scien, lessons, educationYear?.id)}
                setTodayGrade={setTodayGrade}
                openEvaluateToday={openEvaluateToday}
                setOpenEvaluateToday={setOpenEvaluateToday}
                oneSciencesScore={oneSciencesScore}
                allThemeData={allThemeData}
                setThemeModal={setThemeModal}
            />

            {/* info modal */}

            <Modal
                open={open3}
                onClose={handleClose3}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={stylenb} component={stylenb2}>
                    <CloseMyButtonForChild
                        onClick={handleClose3}
                    ><RiCloseLine/></CloseMyButtonForChild>
                    <SubjectStatistics studentData={studentData}/>
                </Box>
            </Modal>

            {/* all attendance modal  */}
            <Modal open={open4} onClose={handleClose4}>
                <Box sx={styleAllNb} component={stylenb2}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'end',
                        }}
                        onClick={handleClose4}
                    >
                        <IconButton>
                            <RiCloseLine/>
                        </IconButton>
                    </Box>

                    <AllStudentsNbModal groups={groups} lessons={lessons} groupSelect={groupSelect} scien={scien}/>
                </Box>
            </Modal>
            {/* Dynamic Attendance*/}
            <DynamicAttendance
                open={modalDynamicAttendance}
                handleClose={handleCloseDynamicAttendance}
                data3={allDataStudents?.sort(sortedData)}/>
            {/* add a new theme*/}
            <AddNewTheme getThemeAll={() => getThemeAll(scien, lessons, educationYear?.id)}
                         groupId={groups?.find(g => g?.name === groupSelect)?.id}
                         subjectId={lessons?.find(l => l?.name === scien)?.id}
                         educationYearId={educationYear?.id}
                         open={themeModal} setThemeModal={setThemeModal}/>
        </Container>
    );
};

const StylesCalendar = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    width: 250px;
    margin: 0 auto;

    .MuiFormLabel-root {
        color: #fff;
    }

    .MuiInputBase-root {
        color: #fff;

        input {
            padding: 9px 0 9px 9px;
        }
    }
`
const Bodybox = styled.div`
    margin-top: 15px;
    width: 100%;
    overflow-x: scroll;

    table {
        min-width: 700px;
        border-collapse: collapse;
        width: 100%;
        border-radius: 5px;
        overflow: hidden;

        td, th {
            border: 1px solid #ddd;
            padding: 8px;
            font-size: 14px;
        }

        th {
            text-align: center;
        }

        tr {
            &:nth-child(even) {
                background-color: #fcf9f9;
            }
        }

        th {
            background-color: ${mainColor};
            color: white;
        }
    }

`;

const GroupTitle = styled.div`
    margin-left: 15px;
    color: black;
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
`
const stylenb = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 550,
    bgcolor: 'background.paper',
    border: "none",
    borderRadius: 2,
    boxShadow: 24,
};
const stylenb2 = styled.div`
    ${extrasmall({
        width: "97% !important"
    })}
`
const styleAllNb = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "97%",
    bgcolor: 'background.paper',
    border: "none",
    borderRadius: 2,
    boxShadow: 24,
    p: 2,
};

const styleEvaluate = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "45%",
    height: "98vh",
    bgcolor: 'background.paper',
    border: "none",
    borderRadius: 2,
    boxShadow: 24,
};
const styleEval = styled.div`
    ${extrasmall({
        width: "98% !important",
    })}
`

const CloseMyButtonForChild = styled.button`
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    border-radius: 50%;
    color: ${mainColor};
    font-size: 26px;
    border: none;
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
    cursor: pointer;
`;


const BoxNb = styled.div`
    margin: 0 auto;
    width: 50px;
    height: 50px;
    border-radius: 5px;
    border: 1px solid #a6a6e0;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: ${props => props.color ? props.color : "#000"};

    &:hover {
        background-color: rgba(0, 0, 0, 0.2);
    }

    & > svg {
        width: 20px;
        height: 20px;
    }
`;

const Cardstudents = styled.div`
    background-color: #ffffff;
    margin-top: 15px;
    border-radius: 5px;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    padding: 25px;

    ${extrasmall({
        padding: "10px"
    })}
    .maxScoreForAtt {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;

        .Mui-disabled {
            color: #000000;
        }
    }
`
const CardInput = styled.div`
    padding:15px 0;
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    ${extrasmall({
        justifyContent: "center"
    })}
`

const Container = styled.div`
    padding: 10px;
`

export default JournalTeacher;