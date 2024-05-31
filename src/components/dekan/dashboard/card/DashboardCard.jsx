import React from 'react';
import styled from "styled-components";
import {CircularProgressbar} from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import {mainColor} from "../../../../utills/ServiceUrls";

const DashboardCard = ({course, comeCount, allCount}) => {
    return (
        <DashboardCardWrapper>
            <DashboardCardData
                color={course === 1 ? mainColor : course === 2 ? "#FD8539" : course === 3 ? "#2ED480" : "#FE6D8E"}>
                <DashboardCardDataTitle>Course - {course}</DashboardCardDataTitle>
                <DashboardCardDataStatistics>{comeCount}</DashboardCardDataStatistics>
                <DashboardCardDataStatistics>{allCount}</DashboardCardDataStatistics>
            </DashboardCardData>
            {
                comeCount && allCount && <DashboardCardChartWrapper>
                    <CircularProgressbar
                        value={Math.ceil(comeCount / allCount * 100)}
                        text={`${Math.ceil(comeCount / allCount * 100)}%`}
                        styles={{
                            pathTransition: "none",
                            path: {
                                stroke: course === 1 ? mainColor : course === 2 ? "#FD8539" : course === 3 ? "#2ED480" : "#FE6D8E",
                                strokeWidth: '20px',
                                transformOrigin: 'center center',
                                filter: `drop-shadow(2px 4px 6px ${course === 1 ? mainColor : course === 2 ? "#FD8539" : course === 3 ? "#2ED480" : "#FE6D8E"})`
                            },
                            root: {
                                width: '4rem',
                                overflow: "visible"
                            },
                            text: {
                                fill: `${course === 1 ? mainColor : course === 2 ? "#FD8539" : course === 3 ? "#2ED480" : "#FE6D8E"}`,
                                fontSize: '20px',
                            },
                            trail: {
                                strokeWidth: '24px',
                                transformOrigin: 'center center',
                                stroke: '#F2F6FC'
                            }
                        }}
                    />
                </DashboardCardChartWrapper>
            }
        </DashboardCardWrapper>
    );
};

const DashboardCardChartWrapper = styled.span`
    width: 80px !important;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const DashboardCardDataStatistics = styled.span`
    font-size: 30px;
    font-weight: 600;
`;

const DashboardCardDataTitle = styled.span`
    font-size: 14px;
    font-weight: 300;
`;

const DashboardCardData = styled.div`
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    color: ${props => props.color};
`;

const DashboardCardWrapper = styled.div`
    position: relative;
    width: 100%;
    min-height: 120px;
    background-color: #fff;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 20px;
    cursor: pointer;

`;


export default DashboardCard;