import React from 'react';
import styled from "styled-components";
import {mainColor} from "../../../../../utills/ServiceUrls";
import DashboardPieChart from "./DashboardPieChart";

const DashboardLineChartSection = () => {
    return (
        <Container>
            Fails Of Groups
            <DashboardPieChart/>
        </Container>
    );
};

const Container = styled.div`
    position: relative;
    min-height: 360px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    border-radius: 10px;
    margin-top: 10px !important;
    padding: 10px !important;
    background-color: #fff;
    color: ${mainColor};
`;

export default DashboardLineChartSection;