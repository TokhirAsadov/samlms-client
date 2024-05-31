import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import StudentMenuCard from "./card/StudentMenuCard";
import {useDispatch, useSelector} from "react-redux";
import {extrasmall, large, medium, small} from "../../../responsiv";
import LessonsTodayStudents from "./LessonsTodayStudents";
import RegulationDashboard from "./RegulationDashboard";
import StatisticsMonthUser from "../../teacher/statistics/StatisticsMonthUser";
import {FaArrowRotateLeft, FaFileCircleExclamation, FaSquarePollVertical} from "react-icons/fa6";
import axios from "axios";
import {fetchEducationYear} from "../../../redux/actions/educationYear/education_year_actions";


const StudentMenu = () => {

    const student = useSelector(state => state?.student?.student);
    const [counts, setCounts] = useState();
    const dispatch=useDispatch()
    const {headers} = getHeaders();
    const count = []
    useEffect(() => {
        count.push(student?.results?.length);
        count.push(0)
        count.push(0)
        count.push(student?.results?.filter(item => item?.score < 65).length);
        setCounts(count);
        fetchEducationYears()
    }, []);

    const fetchEducationYears = async () => {
        await axios.get(BASE_URL + '/education/educationYearsForSelected', {headers})
            .then(res => {
                dispatch(fetchEducationYear(res?.data?.obj?.[0]))
            })
            .catch(err => {
                console.log(err);
            })
    }
    const items = [
        {
            icon: FaSquarePollVertical,
            title: "Results",
            path: 'results',
            color: mainColor
        },
        {
            icon: FaArrowRotateLeft,
            title: "Retake",
            path: 'retake',
            color: '#F00',
        },
        {
            icon: FaFileCircleExclamation,
            title: "Finals",
            path: 'finals',
            color: '#FD8539'
        }
    ]

    return (
        <Container>
            <RegulationDashboard/>
            <Wrapper>
                {counts && items?.map((item, index) => <StudentMenuCard key={index} index={index} icon={item?.icon}
                                                                        title={item?.title} count={counts?.[index]}
                                                                        path={item.path}
                                                                        color={item?.color}/>)}
            </Wrapper>
            <StatisticsBox>
                <LessonsTodayStudents/>
                <StatisticsMonthUser/>
            </StatisticsBox>

        </Container>);
};

const StatisticsBox = styled.div`
    display: grid;
    gap: 20px;
    grid-template-columns:  1fr 0.1fr;
    align-items: flex-start;
    ${large({
        gridTemplateColumns: '1fr',
    })}
    ${medium({
        gridTemplateColumns: '1fr',
    })}
    ${small({
        gridTemplateColumns: '1fr',
    })}
    ${extrasmall({
        justifyItems: 'center',
        gridTemplateColumns: '1fr',
    })}

`;
const Wrapper = styled.div`
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
    ${extrasmall({
        gridTemplateColumns: '1fr',
        gap: '20px',
    })}
`;

const Container = styled.div`
    width: 100%;
    padding: 1rem;
    margin-bottom: 1.5rem;

    h3 {
        font-size: 22px;
        font-weight: bold;
        ${extrasmall({
            fontSize: '18px',
        })}
    }
`;

export default StudentMenu;