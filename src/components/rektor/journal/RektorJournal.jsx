import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import {RiCloseLine} from "react-icons/ri";
import OneSciencesdata from "../../student/sciences/OneSciencesdata";
import styled from "styled-components";
import {extrasmall} from "../../../responsiv";
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import Results from "./Results";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {fetchEducationYear} from "../../../redux/actions/educationYear/education_year_actions";
import {
    educationYearStatisticsFetched,
    educationYearStatisticsFetching
} from "../../../redux/slice/educationYear/education_year_statistics_slice";
import moment from "moment";
import LinearProgress from "@mui/material/LinearProgress";
import IconButton from "@mui/material/IconButton";
import {Card, CardContent, FormGroup, Menu, Skeleton} from "@mui/material";
import {AiFillCheckCircle, AiFillCloseCircle, AiFillInfoCircle} from "react-icons/ai";
import EmptyDataImg from "../../emptyDataImg/EmptyDataImg";
import Tooltip from "@mui/material/Tooltip";
import {BsThreeDotsVertical} from "react-icons/bs";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import SubjectInfo from "../../dekan/journal/SubjectInfo";


const RektorJournal = () => {

    const [scien, setScien] = useState("");
    const [groupSelect, setGroupSelect] = useState("");
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [oneSciencesNb, setOneSciencesNb] = useState([]);
    const [valueDate, setValueDate] = useState(moment().format(''));
    const educationYear = useSelector(state => state?.educationYear?.educationYear) || null;
    const [eduYears, setEduYears] = useState([]);
    const [groups, setGroups] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const loadingStatistics = useSelector(state => state?.educationYearStatistics?.educationYearStatisticsLoadingStatus) || false;
    const educationStatistics = useSelector(state => state?.educationYearStatistics?.educationYearStatistics) || [];
    const [eduType, setEduType] = useState(null);
    const [kurs, setKurs] = useState(null);
    const {headers} = getHeaders();
    const dispatch = useDispatch();
    const [subjectInfo, setSubjectInfo] = useState(null)
    const [showAttendance, setShowAttendance] = useState(false)
    const [showAttendanceLoad, setShowAttendanceLoad] = useState(true)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openTableSetting = Boolean(anchorEl);
    const [showAttendanceData, setShowAttendanceData] = useState([])
    const handleClickTableSetting = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseTableSetting = () => {
        setAnchorEl(null);
    };
    const handleShowAttendance = (event) => {
        setShowAttendance(event.target.checked)
    }
    const handleChange3 = (event) => {
        event.target.value !== educationYear?.name && dispatch(educationYearStatisticsFetching())
        dispatch(fetchEducationYear(eduYears?.find(i => i?.name === event.target.value)))
    };
    const handleOpen = (data) => {
        data?.nb?.sort(function (o1, o2) {
            if (o1?.time > o2?.time) return 1;
            else if (o1?.time < o2?.time) return -1;
            else return 0;
        })
        setOneSciencesNb(data)
        setOpen(true)
    };

    const handleClose = () => setOpen(false);
    const handleClose2 = () => setOpen2(false);

    const handleChange1 = (event) => {
        setScien(event.target.value);
    };
    const handleChange2 = (event) => {
        setGroupSelect(event.target.value);
        setShowAttendance(false)
        setShowAttendanceLoad(true)
    };

    useEffect(() => {
        fetchEducationYears();
        fetchFaculties();
    }, [])


    const fetchEducationYears = async () => {
        await axios.get(BASE_URL + '/education/educationYearsForSelected', {headers})
            .then(res => {
                setEduYears(res?.data?.obj);
                dispatch(fetchEducationYear(res?.data?.obj?.[0]))
            })
            .catch(err => {
                console.log(err);
            })
    }


    useEffect(() => {

        scien && eduType && kurs && axios.get(BASE_URL + `/dekan/getGroupsNamesForRektorByFacultyId/${faculties?.find(faculty => faculty?.name === scien)?.id}?course=${kurs}&eduType=${eduType}`, {headers})
            .then(response => {
                setGroups(response?.data?.sort(function (o1, o2) {
                    if (o1?.name > o2?.name) return 1;
                    else if (o1?.name < o2?.name) return -1;
                    else return 0;
                }))
                setGroupSelect(response?.data?.obj[0]?.name)
            })
            .catch(err => {
                console.log(err)
            })
    }, [scien, eduType, kurs])

    useEffect(() => {


        if (showAttendance) {
            setShowAttendanceLoad(true)

            groupSelect && axios.get(BASE_URL + `/education/getStudentsStatisticsForDean?educationYearId=${educationYear?.id}&group=${groupSelect}`, {headers})
                .then(response => {
                    const resData = response?.data?.obj

                    const mergeArray = educationStatistics.map(item1 => {
                        const item2 = resData.find(item => item.student === item1.fullName);
                        if (item2) {
                            return {...item1, ...item2};
                        }
                        return item1;
                    });
                    setShowAttendanceData(mergeArray)
                    setShowAttendanceLoad(false)
                })
                .catch(e => {
                    console.log(e)
                    setShowAttendanceLoad(false)
                });

        } else {
            groupSelect && dispatch(educationYearStatisticsFetching())
            const dateConfig = moment(valueDate)

            groupSelect && axios.get(BASE_URL + `/group/getStudentStatisticsForDeanOneWeek/${groups.find(i => i.name === groupSelect)?.id}?educationYearId=${educationYear?.id}&weekday=${dateConfig.day()}&week=${dateConfig.isoWeek()}&year=${dateConfig.year()}`, {headers})
                .then(response => {
                    console.log(response, "------------------------------------------------------------- loooooooooooookkkkkkkkkkk")
                    dispatch(educationYearStatisticsFetched(response?.data?.obj.sort(compareFullNames)))
                    setShowAttendanceLoad(true)

                })
                .catch(e => {
                    console.log(e)
                    setShowAttendanceLoad(true)

                });
        }

    }, [groupSelect, showAttendance, valueDate])

    const fetchFaculties = () => {
        axios.get(`${BASE_URL}/faculty/allFacultiesWithShortName`, {headers})
            .then(response => {
                setFaculties(response?.data?.obj)
            })
            .catch(e => console.log(e));
    }

    function compareFullNames(a, b) {
        const nameA = a?.fullName.toUpperCase();
        const nameB = b?.fullName.toUpperCase();

        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    }

    function groupObjectsByName(arr) {
        return arr?.reduce((groupedObjects, obj) => {
            const name = obj?.lessonName;

            if (groupedObjects[name]) {
                groupedObjects[name].push(obj);
            } else {
                groupedObjects[name] = [obj];
            }

            return groupedObjects;
        }, {});
    }

    return (
        <Container>
            <CardInput>
                <Box sx={{width: 200}}>
                    <FormControl fullWidth>
                        <InputLabel id="semestr">Semestr</InputLabel>
                        <Select
                            labelId="semestr"
                            id="demo-simple-select"
                            value={educationYear?.name}
                            label="Semistr"
                            onChange={handleChange3}
                        >
                            {eduYears.map((item, key) => (
                                <MenuItem key={item?.id} value={item?.name}>{item?.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{width: 200}}>
                    <FormControl fullWidth>
                        <InputLabel id="eduType">Ta'lim shakli</InputLabel>
                        <Select
                            labelId="eduType"
                            id="demo-simple-select-edu-type"
                            value={eduType}
                            label="Ta'lim shakli"
                            onChange={(e) => setEduType(e.target.value)}
                        >
                            <MenuItem value="KUNDUZGI">KUNDUZGI</MenuItem>
                            <MenuItem value="KECHKI">KECHKI</MenuItem>
                            <MenuItem value="SIRTQI">SIRTQI</MenuItem>

                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{width: 200}}>
                    <FormControl fullWidth>
                        <InputLabel id="kurs">Kurs</InputLabel>
                        <Select
                            labelId="kurs"
                            id="demo-simple-selected-kurs"
                            value={kurs}
                            label="Kurs"
                            onChange={(e) => setKurs(e.target.value)}
                        >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{width: 200}}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Yo'nalish</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={scien || ""}
                            label="Yo'nalish"
                            onChange={handleChange1}
                        >
                            {faculties.map((item, key) => (
                                <MenuItem key={item?.id} value={item?.name}>{item?.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{width: 200}}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label1">Group</InputLabel>
                        <Select
                            labelId="demo-simple-select-label1"
                            id="demo-simple-select1"
                            value={groupSelect || ""}
                            label="Group"
                            onChange={handleChange2}
                        >
                            {groups?.map((item, key) => (
                                <MenuItem key={item?.id} value={item?.name}>{item?.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{width: 200}}>
                    <FormControl fullWidth>
                        <TextField
                            label="Date"
                            InputLabelProps={{shrink: true,}}
                            type='date'
                            InputProps={{inputProps: {max: moment().format('YYYY-MM-DD')}}}
                            defaultValue={moment().format('YYYY-MM-DD')}
                            onChange={(e) => setValueDate(e.target.value)}/>
                    </FormControl>
                </Box>
            </CardInput>

            <Card>
                <CardContent>
                    <Box display={'flex'} justifyContent={'end'}>
                        <Tooltip title="Settings">
                            <IconButton
                                onClick={handleClickTableSetting}
                                size="medium"
                                sx={{ml: 2}}
                                aria-controls={openTableSetting ? 'account-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={openTableSetting ? 'true' : undefined}
                            >
                                <BsThreeDotsVertical/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Bodybox>
                        <table>
                            <thead>
                            <tr>
                                <th>№</th>
                                <th>
                                    <Box display='flex' gap={"8px"} alignItems={'center'} justifyContent={'center'}>
                                        <p>Full name</p>
                                    </Box>
                                </th>

                                {showAttendanceLoad && educationStatistics[0]?.subjects?.slice().sort((a, b) => {
                                    if (a?.section < b?.section) return -1;
                                    if (a?.section > b?.section) return 1;
                                    return 0;
                                }).map((item, index) => (
                                    <Tooltip onClick={() => {
                                        setSubjectInfo(item)
                                        setOpen3(true)
                                    }} key={index} title={<h6>{item?.lesson}</h6>} arrow placement={'top'}>
                                        <th>{index + 1}</th>
                                    </Tooltip>
                                ))}

                                <th>Enter</th>

                                {showAttendance &&
                                    <th><Box display='flex' gap={"8px"} alignItems={'center'} justifyContent={'center'}>
                                        <p>Attendance</p>
                                    </Box></th>}
                                <th>Info</th>
                            </tr>
                            </thead>
                            <tbody>
                            {loadingStatistics !== 'loading' && showAttendanceLoad ? educationStatistics?.map((item, key) => {

                                return (
                                    <tr key={key}>
                                        <td style={{textAlign: "center"}}>{key + 1}</td>
                                        <td>{item?.fullName}</td>

                                        {item?.subjects?.slice().sort((a, b) => {
                                            if (a?.section < b?.section) return -1;
                                            if (a?.section > b?.section) return 1;
                                            return 0;
                                        }).map((item2, index) => {
                                            const isEnterClass = item2.statistics?.length > 0
                                            return <td key={index}>
                                                <BoxNb color={isEnterClass ? "green" : "red"}>
                                                    {!isEnterClass ? <AiFillCloseCircle size={20}/> :
                                                        <AiFillCheckCircle size={20}/>}
                                                </BoxNb>
                                            </td>
                                        })}
                                        <td>
                                            <BoxNb color={item.entering ? "green" : "red"}>
                                                {!item.entering ? <AiFillCloseCircle size={20}/> :
                                                    <AiFillCheckCircle size={20}/>}
                                            </BoxNb>
                                        </td>

                                        {showAttendance &&
                                            <td><Skeleton sx={{margin: "0 auto"}} width={"40px"} height={"45px"}/></td>}

                                        <td>
                                            <BoxNb onClick={() => null}>
                                                <AiFillInfoCircle/>
                                            </BoxNb>
                                        </td>
                                    </tr>
                                )
                            }) : showAttendanceData?.map((item, key) => {

                                if (showAttendance) {
                                    function addDays(date, days) {
                                        var result = new Date(date);
                                        result.setDate(result.getDate() + (days - 1));
                                        return result;
                                    }

                                    const done = () => {
                                        let arr = [];

                                        item?.lessons?.map((lesson) => {
                                            const statistics = item?.statistics?.flat();

                                            if (statistics) {
                                                const filteredStatistics = statistics.filter((statistic) =>
                                                    statistic?.week === lesson?.sortWeek &&
                                                    statistic?.weekday === lesson?.weekDay &&
                                                    statistic?.section === lesson?.section
                                                );

                                                if (filteredStatistics.length === 0) {
                                                    arr.push({
                                                        time: addDays(lesson?.start, lesson?.weekDay),
                                                        date: moment(addDays(lesson?.start, lesson?.weekDay)).format("DD.MM.YYYY"),
                                                        para: lesson?.section,
                                                    });
                                                }
                                            }
                                        });

                                        return arr;
                                    }

                                    const done2 = () => {
                                        let arr = [];

                                        const groupedLessons = groupObjectsByName(item?.lessons);
                                        const statistics = item?.statistics?.flat();

                                        if (groupedLessons && statistics) {
                                            Object.values(groupedLessons)?.map((lesson) => {
                                                lesson?.map((les) => {
                                                    const filteredStatistics = statistics.filter((statistic) =>
                                                        statistic?.week === les?.sortWeek &&
                                                        statistic?.weekday === les?.weekDay &&
                                                        statistic?.section === les?.section
                                                    );

                                                    if (filteredStatistics.length === 0) {
                                                        arr.push({
                                                            time: addDays(les?.start, les?.weekDay),
                                                            date: moment(addDays(les?.start, les?.weekDay)).format("DD.MM.YYYY"),
                                                            para: les?.section,
                                                            name: les?.lessonName
                                                        });
                                                    }
                                                });
                                            });
                                        }

                                        return arr;
                                    }

                                    return {
                                        studentName: item?.fullName,
                                        login: item?.login,
                                        nb: done(),
                                        nb2: done2()
                                    }
                                }

                                return item;

                            })?.map((item, key) => {

                                return (
                                    <tr key={key}>
                                        <td style={{textAlign: "center"}}>{key + 1}</td>
                                        <td>{item?.fullName || item?.studentName}</td>
                                        <td>
                                            <BoxNb color={item?.entering ? "green" : "red"}>
                                                {!item?.entering ? <AiFillCloseCircle size={20}/> :
                                                    <AiFillCheckCircle size={20}/>}
                                            </BoxNb>
                                        </td>

                                        {showAttendance && <td><BoxNb onClick={() => handleOpen(item)}>
                                            {item?.nb2?.filter(i => i?.date <= moment().format('DD.MM.YYYY'))?.length}
                                        </BoxNb></td>}


                                        <td>
                                            <BoxNb onClick={() => null}>
                                                <AiFillInfoCircle/>
                                            </BoxNb>
                                        </td>
                                    </tr>
                                )
                            })
                            }
                            </tbody>

                        </table>

                    </Bodybox>

                    {loadingStatistics === 'loading' &&
                        <Box sx={{width: '100%'}}>
                            <LinearProgress/>
                        </Box>
                    }
                    {
                        loadingStatistics !== 'loading' && educationStatistics.length === 0 && <Box>
                            <EmptyDataImg w={200} h={180}/>
                        </Box>
                    }
                </CardContent>
            </Card>
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
                    <OneSciencesdata data={oneSciencesNb}/>
                </Box>
            </Modal>

            {/* Results */}
            <Modal
                open={open2}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleRes} component={stylenb2}>
                    <CloseMyButtonForChild
                        onClick={handleClose2}
                    ><RiCloseLine/></CloseMyButtonForChild>
                    <Results data={oneSciencesNb}/>
                </Box>
            </Modal>
            {/* info subjects */}
            <Modal
                open={open3}
                onClose={() => setOpen3(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleSubjectInfo} component={stylenb2}>
                    <CloseMyButtonForChild
                        onClick={() => setOpen3(false)}
                    ><RiCloseLine/></CloseMyButtonForChild>
                    <SubjectInfo subjectInfo={subjectInfo}/>
                </Box>
            </Modal>
            {/*menu table setting*/}
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
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
                    <FormControlLabel control={<Switch checked={showAttendance} onChange={handleShowAttendance}/>}
                                      label="Show attendance"/>
                </FormGroup>

            </Menu>
        </Container>
    )
        ;
};

const Bodybox = styled.div`
    margin-top: 25px;
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
            font-size: 15px;
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
const styleRes = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "60vw",
    bgcolor: 'background.paper',
    border: "none",
    borderRadius: 2,
    boxShadow: 24,
};
const styleSubjectInfo = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    overflow: 'hidden',
    transform: 'translate(-50%, -50%)',
    width: "350px",
    bgcolor: 'background.paper',
    border: "none",
    borderRadius: 2,
    boxShadow: 24,
};
const stylenb = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
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
`;

const BoxNb = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 5px;
    border: 1px solid #a6a6e0;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin: 0 auto;
    color: ${props => props.color ? props.color : "#000"};

    &:hover {
        background-color: rgba(0, 0, 0, 0.2);
    }
`;

const CardInput = styled.div`
    margin-top: 15px;
    padding: 15px;
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

export default RektorJournal;