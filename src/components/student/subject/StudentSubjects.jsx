import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {BASE_URL, getHeaders, mainColor, navbarHeight} from "../../../utills/ServiceUrls";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {extrasmall, large, medium, small, xlarge} from "../../../responsiv";
import {RiBookMarkFill} from 'react-icons/ri'
import {useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {educationYearStatisticsFetching} from "../../../redux/slice/educationYear/education_year_statistics_slice";
import {fetchEducationYear} from "../../../redux/actions/educationYear/education_year_actions";
import {setInfoStudentForLesson} from "../../../redux/actions/infoStudentForLesson/InfoStudentForLesson_actions";

const StudentSubjects = () => {
    const navigate = useNavigate()
    const student = useSelector(state => state?.student?.student)
    const {headers} = getHeaders();
    const [subjects, setSubjects] = useState([]);
    const educationYear = useSelector(state => state?.educationYear?.educationYear) || null;
    const [eduYears, setEduYears] = useState([]);
    const dispatch = useDispatch()

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

    const fetchLessons = async (group) => {
        await axios.get(BASE_URL + `/groupConnect/getLessonForGroup/${educationYear?.id}?groupName=${group}`, {headers})
            .then(res => {
                console.log(res?.data, "res come")
                setSubjects(res?.data);
            })
            .catch(err => {
                console.log(err);
            })
    }
    useEffect(() => {
        fetchEducationYears();
        fetchLessons(student?.groupData?.name)
    }, [])



    const handleChange = (event) => {
        event.target.value !== educationYear?.name && dispatch(educationYearStatisticsFetching())
        dispatch(fetchEducationYear(eduYears?.find(i => i?.name === event.target.value)))

    };
    const handleClick = (data) => {
        const stateData = {
            lessonName: data.lessonName,
            educationYearId: educationYear.id,
            lessonId: data.lessonId,
            teacherId: data.teacherId,
        }
        dispatch(setInfoStudentForLesson(stateData))
        navigate(`${data.lessonName}`)
    }
    return (
        <Container>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px"
                }}
            >
                <Title>Subjects</Title>
                <Box sx={{minWidth: 150, background: "#fff"}}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor='semestr'>O'quv yilli</InputLabel>
                        <Select
                            labelId="semestr"
                            id="demo-simple-select"
                            value={educationYear?.name}
                            onChange={handleChange}
                            label="O'quv yili"
                        >
                            {eduYears?.map((item, key) => (
                                <MenuItem key={item?.id} value={item?.name}>{item?.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Box>


            <BodyCards>

                {
                    subjects?.map((item, index) => {
                        return (
                            <BodyCard key={index} onClick={() => handleClick(item)}>
                                <BodyCardTitle>
                                    <Box sx={{w: "30px", h: "30px"}}>
                                        <RiBookMarkFill size={30}/>
                                    </Box>
                                    <span>{item?.lessonName}</span>
                                </BodyCardTitle>
                                <p>Teacher : <>{item?.fullName}</></p>
                            </BodyCard>
                        )
                    })
                }
            </BodyCards>
        </Container>
    );
};



const BodyCardTitle = styled.div`
    width: 100%;
    display: flex;
    gap: 10px;
    align-items: center;
    font-size: 16px;
    text-align: start;
    color: ${mainColor};
    font-weight: bold;
    ${extrasmall({
        fontSize: "14px",
    })}
`

const BodyCard = styled.div`
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #fff;
    border-radius: 0.5rem;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

    p {
        display: flex;
        align-items: center;
        color: black;
        font-size: 14px;
    }

    &:hover {
        cursor: pointer;
        box-shadow: 1px 3px 8px 0px rgba(34, 60, 80, 0.2);
    }
`;

const BodyCards = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 20px;
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




const Title = styled.p`
    width: 100%;
    font-size: 25px;
    font-weight: bold;
    ${extrasmall({
        fontSize: "20px"
    })}
`;


const Container = styled.div`
    padding: 1rem !important;
    color: ${mainColor};
`;


export default StudentSubjects;