import React from 'react';
import styled from "styled-components";
import UserStatistics from "../../userStatistics/UserStatistics";
import {useSelector} from "react-redux";

const TeacherStatistics = () => {

    const teacher = useSelector(state => state?.teacher?.teacher)

    return (
        <Container>
            <UserStatistics date={new Date()} userId={teacher?.id} photo={teacher?.photo?.id}
                            userName={teacher?.fullName} forUser={"1024px"}/>
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
    padding: 1rem !important;
`;


export default TeacherStatistics;