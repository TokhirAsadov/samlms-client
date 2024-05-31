import React from 'react';
import {NavLink, Outlet} from 'react-router-dom'
import styled from "styled-components";
import {mainColor} from "../../../utills/ServiceUrls";
import {extrasmall, large, medium, small, xlarge, xxlarge} from "../../../responsiv";

const LayoutChooseStatistics = () => {

    const dataNav = [
        {
            navName: "Days",
            navpath: "days",
        },
        {
            navName: "Groups ",
            navpath: "groups",
        },
        {
            navName: "Teachers",
            navpath: "teachersWeek",
        },
        {
            navName: "Rooms",
            navpath: "rooms",
        },
    ]

    return (
        <Container>
            <Title> Statistics </Title>
            <NavBox>
                <RowItems>
                    {dataNav.map((item, key) => (
                        <NavLink to={item.navpath} key={key} >{item.navName}</NavLink>
                    ))}
                </RowItems>
            </NavBox>
            <Outlet/>
        </Container>
    );
};



const RowItems=styled.div`
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
const NavBox = styled.div`
  margin: 30px 0;
background-color: #ffffff;
  padding: 25px 15px;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
`
const Title = styled.h2`
  text-align: center;
  margin-top: 20px;
  color: ${mainColor};
`
const Container = styled.div`
  width: 100%;
  padding: 5px;
`
export default LayoutChooseStatistics;
