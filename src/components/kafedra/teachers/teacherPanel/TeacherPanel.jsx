import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {BASE_URL, getHeaders, mainColor, TEACHER_ALL_DATA} from "../../../../utills/ServiceUrls";
import TeacherFields from "./TeacherFields";
import TeacherActions from "./TeacherActions";
import axios from "axios";
import {extrasmall, large, medium, small} from "../../../../responsiv";


const TeacherPanel = ({selectId}) => {

    const [data, setData] = useState({});
    const [open, setOpen] = useState(false);

    const {headers} = getHeaders();
    const teacherDataFetch = (userId) => {
        axios.get(BASE_URL + TEACHER_ALL_DATA + userId, {headers})
            .then(res => {
                setData(prev => ({
                    ...prev,
                    ...res.data
                }))
                setOpen(true);
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        teacherDataFetch(selectId);
    }, [])
    return (
        <Container>
            <Header>{data?.fullName}</Header>
            <Body>
                <TeacherFields data={data} open={open}/>
                <TeacherActions userId={selectId}/>
            </Body>
        </Container>
    );
};


const Body = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    ${large({
        display: "block",
    })}
    ${medium({
        display: "block",
    })}
    ${small({
        display: "block",
    })}
    ${extrasmall({
        display: "block",
    })}
`;

const Header = styled.div`
    width: 100%;
    height: 60px;
    background-color: ${mainColor};
    color: #fff;
    font-size: 24px;
    padding-left: 20px !important;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    letter-spacing: 1.2px;
`;

const Container = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: #fff;
`


export default TeacherPanel;