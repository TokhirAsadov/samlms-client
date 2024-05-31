import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import {RiCloseLine} from "react-icons/ri";
import {extrasmall, medium, small} from "../../../responsiv";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import MenuItem from '@mui/material/MenuItem';
import {fetchEducationYear} from "../../../redux/actions/educationYear/education_year_actions";
import {fetchEducationYearStatistics} from "../../../redux/actions/educationYear/education_year_statistics_actions";
import {useHttp} from "../../hook/useHttp";
import {educationYearStatisticsFetching} from "../../../redux/slice/educationYear/education_year_statistics_slice";
import StudentSciencesNb from "./StudentSciencesNb";
import {Card, CardContent, Skeleton, TextField} from "@mui/material";
import {FaCalendarMinus} from "react-icons/fa";
import {setInfoStudentForLesson} from "../../../redux/actions/infoStudentForLesson/InfoStudentForLesson_actions";
import {useNavigate} from "react-router-dom";
import GradeData from "./GradeData";
import moment from "moment/moment";
import FreeTimeTeachersForStudent from "./FreeTimeTeachersForStudent";
import LinearProgress from "@mui/material/LinearProgress";
import ScoreData from "./ScoreData";

const MySciences = () => {

    const {headers} = getHeaders();
    const student = useSelector(state => state?.student?.student)
    const educationYear = useSelector(state => state?.educationYear?.educationYear) || null;
    const educationYearStatistics = useSelector(state => state?.educationYearStatistics?.educationYearStatistics) || [];
    const loadingStatistics = useSelector(state => state?.educationYearStatistics?.educationYearStatisticsLoadingStatus) || false;
    const [open, setOpen] = useState(false);
    const [openGrade, setOpenGrade] = useState(false);
    const [oneSciencesNb, setOneSciencesNb] = useState([])
    const [subjects, setSubjects] = useState([]);
    const [isLoadSub, setIsLoadSub] = useState(false)
    const [eduYears, setEduYears] = useState([]);
    const [gradeDataInfo, setGradeDataInfo] = useState(null)
    const [modalFreeTimeTeacher, setModalFreeTimeTeacher] = useState(false)
    const [freeTimeTeacher, setFreeTimeTeacher] = useState([])
    const navigate = useNavigate()
    const dispatch = useDispatch();


    const handleOpen = (data) => {
        const data2 = educationYearStatistics.find(item => item.lessonName === data)
        setOneSciencesNb(data2)
        setOpen(true)
    };
    const handleClose = () => setOpen(false);
    const handleOpenModalFreeTimeTeacher = (data) => {
        const groupedData = data?.sort((a, b) => {
            const order = {
                "Monday": 1,
                "Tuesday": 2,
                "Wednesday": 3,
                "Thursday": 4,
                "Friday": 5,
                "Saturday": 6,
            };
            return order[a.day] - order[b.day];
        }).reduce((acc, current) => {
            const existingGroup = acc?.find(group => group[0].day === current.day);

            if (existingGroup) {
                existingGroup.push(current);
            } else {
                acc.push([current]);
            }

            return acc;
        }, []);
        setFreeTimeTeacher(groupedData)
        setModalFreeTimeTeacher(true)
    }
    const handleCloseModalFreeTimeTeacher = () => {
        setModalFreeTimeTeacher(false)
        setFreeTimeTeacher([])
    }

    const handleOpenGrade = (data) => {
        setGradeDataInfo(data)
        setOpenGrade(true)
    }
    const handleCloseGrade = () => {
        setOpenGrade(false)
    }




    const fetchLessons =  () => {
        setIsLoadSub(true)
         axios.get(BASE_URL + `/groupConnect/getGradesByLesson/${educationYear?.id}/${student.id}?groupName=${student?.groupData?.name}`, {headers})
            .then(res => {
                const resData=res.data.reduce((acc, current) => {
                    const existingGroup = acc.find(group => group[0]?.lessonId === current?.lessonId);

                    if (existingGroup) {
                        existingGroup.push(current);
                    } else {
                        acc.push([current]);
                    }

                    return acc;
                }, []);
                setSubjects(resData);
            })
            .catch(err => {
                console.log(err);
            })
             .finally(()=>{
                 setIsLoadSub(false)
             })
    }


    const fetchStatistics =  () => {
        educationYear &&  dispatch(fetchEducationYearStatistics( educationYear?.id, student?.groupData?.name, student?.id,headers))
    }

    const fetchEducationYears =  () => {
         axios.get(BASE_URL + '/education/educationYearsForSelected', {headers})
            .then(res => {
                setEduYears(res?.data?.obj);
            })
            .catch(err => {
                console.log(err);
            })
    }


    const handleChange = (event) => {
        event.target.value !== educationYear?.name && dispatch(educationYearStatisticsFetching())
        dispatch(fetchEducationYear(eduYears?.find(i => i?.name === event.target.value)))

    };

    const handleNavigatePlan = (data) => {
        const stateData = {
            lessonName: data.lessonName,
            educationYearId: educationYear.id,
            lessonId: data.lessonId,
            teacherId: data.teacherId,
        }
        dispatch(setInfoStudentForLesson(stateData))
        navigate(`${data.lessonName}`)
    }

    function counterNb(data) {
        return  educationYearStatistics.find(item => item.lessonName === data)?.nbCount
    }

    useEffect(() => {
        fetchEducationYears();
    }, []);

    useEffect(() => {
        fetchLessons();
    }, [educationYear])

    useEffect(() => {
        fetchStatistics()
    }, [])


    return (
        <Container>
            <Title>
                <span> My courses</span>

                <Box sx={{minWidth: 130, background: "#fff"}}>
                    <TextField
                        fullWidth
                        select
                        size="small"
                        value={educationYear?.name}
                        onChange={handleChange}
                    >
                        {eduYears?.map((item, key) => (
                            <MenuItem key={item?.id} value={item?.name}>{item?.name}</MenuItem>
                        ))}
                    </TextField>
                </Box>
            </Title>

            <Card sx={{mt: 3}}>
                <CardContent>
                    <Bodybox>
                        <table>
                            <thead>
                            <tr>
                                <th style={{textAlign: "center", width: "50px"}}>№</th>
                                <th>Subject</th>
                                <th>Teacher</th>
                                <th style={{textAlign: "center", width: "100px"}}>Absence count</th>
                                <th style={{textAlign: "center", width: "100px"}}>Grades</th>
                                <th style={{textAlign: "center", width: "100px"}}>Plan</th>
                            </tr>
                            </thead>
                            <tbody>
                            {subjects.sort((a, b) => a[0].lessonName.localeCompare(b[0].lessonName)).map((item, index) => (
                                <React.Fragment key={index}>
                                    {item.map((item2,subIndex)=> (
                                        <tr key={subIndex}>
                                            {subIndex === 0 && <td rowSpan={item?.length} style={{textAlign: "center"}}>{index + 1}</td>}
                                            {subIndex === 0 && <td rowSpan={item?.length}><b> {item[0].lessonName} </b></td>}
                                            <td className={'teacher'}
                                                onClick={() => handleOpenModalFreeTimeTeacher(item2?.hours)}>
                                                {item2?.fullName?.toUpperCase()}
                                            </td>
                                            {subIndex === 0 && <td rowSpan={item?.length}>
                                                {loadingStatistics === 'start' ?
                                                    <Box display={'flex'} justifyContent={'center'}>
                                                        <Skeleton variant="rounded" width={50} height={50}/>
                                                    </Box> : <BoxNb onClick={() => handleOpen(item[0]?.lessonName)}>
                                                        {counterNb(item[0]?.lessonName)}
                                                    </BoxNb>}

                                            </td>}

                                            <td>
                                                <ScoreData item2={item2} handleOpenGrade={()=>handleOpenGrade(item2)}/>
                                            </td>
                                            <td>
                                                <BoxNb onClick={() => handleNavigatePlan(item2)}>
                                                    <FaCalendarMinus size={20} color={`#08004b`}/>
                                                </BoxNb>
                                            </td>
                                        </tr>
                                    ))}

                                </React.Fragment>

                            ))}
                            </tbody>
                        </table>
                    </Bodybox>
                    {isLoadSub && <Box sx={{width: '100%', marginTop: '20px'}}>
                        <LinearProgress/>
                    </Box>}
                </CardContent>
            </Card>


            {/*NB modal*/}
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
                    <StudentSciencesNb data={oneSciencesNb}/>
                </Box>
            </Modal>

            {/*grade modal*/}
            <Modal
                open={openGrade}
                onClose={handleCloseGrade}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleGr} component={styleGr2}>
                    <CloseMyButtonForChild
                        onClick={handleCloseGrade}
                    ><RiCloseLine/></CloseMyButtonForChild>
                    <GradeData openGrade={openGrade} gradeDataInfo={gradeDataInfo}/>
                </Box>
            </Modal>
            {/*modal teacher free time*/}
            <FreeTimeTeachersForStudent open={modalFreeTimeTeacher} handleClose={handleCloseModalFreeTimeTeacher}
                                        data={freeTimeTeacher}/>
        </Container>
    );
};
const Bodybox = styled.div`
    margin-top: 25px;
    width: 100%;

    overflow-x: scroll;

    table {
        margin: 0 auto;
        min-width: 700px;
        max-width: 1200px;
        border-collapse: collapse;
        width: 100%;
        border-radius: 5px;
        overflow: hidden;

        td, th {
            border: 1px solid #a8a8a8;
            padding: 7px;
            font-size: 14px;
        }

        th {
            text-align: center;
        }
        

        th {
            background-color: ${mainColor};
            color: white;
        }

        .teacher {
            &:hover {
                background-color: rgba(0, 0, 0, 0.2);
                cursor: pointer;
            }
        }
    }

`;
const stylenb = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: "none",
    borderRadius: 2,
    outline: "none",
    boxShadow: 24,
};
const styleGr = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    bgcolor: 'background.paper',
    border: "none",
    outline: "none",
    borderRadius: '15px',
    boxShadow: 24,
};
const stylenb2 = styled.div`
    ${extrasmall({
        width: "97% !important"
    })}
`
const styleGr2 = styled.div`
    ${medium({
        width: "97% !important"
    })}
    ${small({
        width: "97% !important"
    })}
    ${extrasmall({
        width: "97% !important"
    })}
`
const CloseMyButtonForChild = styled.button`
    width: 30px;
    height: 30px;
    display: flex;
    cursor: pointer;
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
    margin: 0 auto;
    width: 50px;
    height: 50px;
    border-radius: 5px;
    border: 1px solid #a6a6e0;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:hover {
        background-color: rgba(0, 0, 0, 0.2);
    }
`;

const Title = styled.h4`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
    gap: 15px;

    span {
        font-size: 25px;
        font-weight: 600;
        color: ${mainColor};

    }
`
const Container = styled.div`
    padding: 1rem;
`
export default MySciences;