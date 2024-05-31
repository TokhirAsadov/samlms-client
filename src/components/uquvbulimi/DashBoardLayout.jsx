import React from 'react';
import styled from "styled-components";
import {Card} from "@mui/material";
import {NavLink, Outlet} from "react-router-dom";
import {mainColor} from "../../utills/ServiceUrls";
import {extrasmall, large, medium, small, xlarge, xxlarge} from "../../responsiv";

const DashBoardLayout = () => {

    const navDashboard = [
        {
            label: 'Attendance floor',
            path: 'floor',
        },
       /* {
            label: 'Empty audience',
            path: 'empty',
        },*/
        {
            label: 'Groups',
            path: 'groups',
        },
        {
            label: 'Teacher',
            path: 'teachers',
        },
        {
            label: 'Audience attendance',
            path: 'rooms',
        },
    ]

    return (
        <Container>
            <Card>
                <Container>
                    <BoxNav>
                        {navDashboard.map((item,index) => (
                            <NavLink to={item.path} key={index}>
                                {item.label}
                            </NavLink>
                        ))}
                    </BoxNav>
                </Container>
            </Card>
            <Outlet/>
        </Container>
    );
};

const BoxNav = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);

    ${xxlarge({
        gap: "30px",
    })}
    ${xlarge({
        gap: "20px",
    })}
    ${large({
        gap: "20px",
        gridTemplateColumns: "repeat(3, 1fr)",
    })}
    ${medium({
        gap: "20px",
        gridTemplateColumns: "repeat(2, 1fr)",
    })}
    ${small({
        gap: "20px",
        gridTemplateColumns: "repeat(2, 1fr)",
    })}
    ${extrasmall({
        gap: "30px",
        gridTemplateColumns: "repeat(1, 1fr)",
    })}
    a {
        font-size: 16px;
        display: flex;
        justify-content: center;
        padding: 10px 5px;
        background-color: ${mainColor};
        color: #ffffff;
        border-radius: 5px;
        transition: .3s;
    }

    .active {
        font-weight: bold;
        background-color: #eae6e6;
        color: ${mainColor};
    }
`

const Container = styled.div`
    width: 100%;
    padding: 1rem;
`
export default DashBoardLayout;