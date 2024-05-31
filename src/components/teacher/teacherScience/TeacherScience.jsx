import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {extrasmall, large, medium, small, xlarge} from "../../../responsiv";
import {IoBookmarks} from "react-icons/io5";
import {useNavigate} from "react-router-dom";
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {useDispatch, useSelector} from "react-redux";
import {educationYearStatisticsFetching} from "../../../redux/slice/educationYear/education_year_statistics_slice";
import {fetchEducationYear} from "../../../redux/actions/educationYear/education_year_actions";
import axios from "axios";
import {ImBook} from "react-icons/im";
import {setLessonsTeacher} from "../../../redux/actions/lessonsTeacher/lessons_teacher_actions";

const TeacherScience = () => {
    const courseLevelData = [1, 2, 3, 4,]
    const user = useSelector(state => state?.user?.user) || null;
    const {headers} = getHeaders();
    const navigate = useNavigate()
    const educationYear = useSelector(state => state?.educationYear?.educationYear) || null;
    const [eduYears, setEduYears] = useState([]);
    const [scien, setScien] = useState("");
    const [lessons, setLessons] = useState([]);
    const [courseLevel, setCourseLevel] = useState("")
    const [allLessons, setAllLessons] = useState([]);
    const [allGroup, setallGroup] = useState([])
    const [lessonId, setLessonId] = useState(null)
    const dispatch = useDispatch()


    const handleChange = (event) => {
        event.target.value !== educationYear?.name && dispatch(educationYearStatisticsFetching())
        dispatch(fetchEducationYear(eduYears?.find(i => i?.name === event.target.value)))

    };
    const fetchEducationYears = async () => {
        await axios.get(BASE_URL + '/education/educationYearsForSelected', {headers})
            .then(res => {
                // console.log(res?.data?.obj,"education years res come")
                setEduYears(res?.data?.obj);
                dispatch(fetchEducationYear(res?.data?.obj?.[0]))
            })
            .catch(err => {
                console.log(err);
            })
    }
    const fetchLessons = async () => {

        educationYear && educationYear?.id && await axios.get(`${BASE_URL}/groupConnect/subjectsOfTeacher/${user?.id}?educationId=${educationYear?.id}`)
            .then((response) => {
                setLessons(response?.data?.obj);
                // console.log(response?.data?.obj)
                // setScien(response?.data?.obj[0]?.name)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        fetchEducationYears();

    }, [])


    useEffect(() => {
        fetchLessons()
    }, [educationYear])


    const clickItems = (course, ...data) => {
        const courseData = {
            educationYear: data[0],
            groupData: data[1],
            allGroup: data[2],
        }
        dispatch(setLessonsTeacher(courseData))
        navigate(`${course}`)
    }
    const handleChange1 = (event) => {
        setScien(event.target.value);
    };


    useEffect(() => {

        educationYear && scien && scien?.length > 0 && courseLevel &&
        axios.get(`${BASE_URL}/plan/getPlansForTeacherSciences?educationYearId=${educationYear?.id}&level=${courseLevel}&subjectId=${lessons?.find(l => l?.name === scien)?.id}`, {headers})
            .then((response) => {
                const data = response.data?.obj.reduce((acc, item) => {
                    const {eduType, lang} = item;
                    const key = `${eduType}_${lang}`;

                    if (!acc[key]) {
                        acc[key] = [];
                    }

                    acc[key].push(item);
                    return acc;
                }, {});

                const result = Object.values(data)
                setAllLessons(response.data?.secondObj)
                setallGroup(response.data?.obj)
            })
            .catch(err => {
                console.log(err)
            })
    }, [educationYear, scien, courseLevel])


    useEffect(() => {
        if (lessons.length > 0) {
            setLessonId(lessons.find(item => item.name === scien)?.id)
        }

    }, [lessons, scien])

    useEffect(() => {
        educationYear &&
        axios.get(`${BASE_URL}/plan/getAllPlansForTeacherSciences?educationYearId=${educationYear?.id}`, {headers})
            .then((response) => {
                console.log(response?.data, "response all");
                const data = response.data?.obj.reduce((acc, item) => {
                    const {eduType, lang} = item;
                    const key = `${eduType}_${lang}`;

                    if (!acc[key]) {
                        acc[key] = [];
                    }

                    acc[key].push(item);
                    return acc;
                }, {});

                const result = Object.values(data)

                setAllLessons(response.data?.secondObj)
                setallGroup(response.data?.obj)

            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    return (
        <Container>
            <TitleMain><ImBook/> My courses</TitleMain>
            <CardInput>
                <Box sx={{minWidth: 180, background: "#fff"}}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor='semestr'>Academic year</InputLabel>
                        <Select
                            labelId="semestr"
                            id="demo-simple-select"
                            value={educationYear?.name}
                            onChange={handleChange}
                            label="Academic year"
                        >
                            {eduYears?.map((item, key) => (
                                <MenuItem key={item?.id} value={item?.name}>{item?.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{width: 200,background: "#fff"}}>
                    <FormControl fullWidth>
                        <InputLabel id="fanselect">Subject</InputLabel>
                        <Select
                            labelId="fanselect"
                            id="demo-simple-select2"
                            value={scien}
                            label="Subject"
                            onChange={handleChange1}
                        >
                            {lessons?.map((item, key) => (
                                <MenuItem key={item?.id} value={item?.name}>{item?.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{width: 200,background: "#fff"}}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Course</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={courseLevel}
                            label="Course"
                            onChange={(e) => setCourseLevel(e.target.value)}
                        >
                            {courseLevelData?.map((item, key) => (
                                <MenuItem key={key} value={item}>{item}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </CardInput>

            <BoxCardMain>
                {allLessons.length > 0 && allLessons.map((group, key) => (

                    <CardSience key={key}
                                onClick={() => clickItems(group.lessonName, educationYear, group, allGroup)}>
                        <CardTitle fw={"bold"} fs={"22px"} cl={"steelblue"}>
                            <IoBookmarks size={40}/>
                            {group.lessonName}
                        </CardTitle>
                        <CardTitle fs={"15px"}>
                            Course: {group.level}
                        </CardTitle>
                        <CardTitle fs={"15px"}>
                            Language : {group.eduLang}
                        </CardTitle>
                        <CardTitle fs={"15px"}>
                            Type of education : {group.eduType}
                        </CardTitle>

                    </CardSience>


                ))}

            </BoxCardMain>
        </Container>
    );
};

const CardInput = styled.div`
    padding: 15px;
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    ${extrasmall({
        justifyContent: "center"
    })}
`


const TitleMain = styled.h1`
    margin-left: 20px;
    color: ${mainColor};
    font-size: 25px;
    font-weight: bold;
    ${extrasmall({
        textAlign: "center",
        fontSize: "20px",
    })}
`;
const CardTitle = styled.p`
    display: flex;
    align-items: center;
    gap: 5px;
    color: ${props => props.cl || "black"};
    font-size: ${props => props.fs};
    font-weight: ${props => props.fw || "normal"};
`

const CardSience = styled.div`
    border: 1px solid #f1eded;
    padding: 10px;
    border-radius: 5px;
    background-color: #FFFF;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    cursor: pointer;
    transition: 0.2s;

    :hover {
        transform: scale(1.02);
    }
`;
const BoxCardMain = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    padding: 10px;
    ${xlarge({
        gridTemplateColumns: "1fr 1fr 1fr  ",
    })}
    ${large({
        gridTemplateColumns: "1fr 1fr 1fr  ",
    })}
    ${medium({
        gridTemplateColumns: "1fr 1fr ",
    })}
    ${small({
        gridTemplateColumns: "1fr 1fr ",
    })}
    ${extrasmall({
        gridTemplateColumns: "1fr ",
    })}
`;
const Container = styled.div`
    width: 100%;
    padding: 1rem;
`;
export default TeacherScience;
