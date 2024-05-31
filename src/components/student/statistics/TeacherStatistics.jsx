import React from 'react';
import styled from "styled-components";
import UserStatistics from "../../userStatistics/UserStatistics";
import {useSelector} from "react-redux";
import StatisticsMonitoring from "./StatisticsMonitoring";

const StudentStatistics = () => {

    const user = useSelector(state => state?.user?.user)

    return (
        <Container>
            <UserStatistics date={new Date()} userId={user?.id} photo={user?.photos?.id} userName={user?.fullName}
                            forUser={"1024px"}/>

           <StatisticsMonitoring/>
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
    padding: 1rem !important;
`;


export default StudentStatistics;