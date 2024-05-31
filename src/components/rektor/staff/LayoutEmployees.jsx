import React from 'react';
import styled from "styled-components";
import {NavLink, Outlet} from "react-router-dom";
import {mainColor, navbarHeight} from "../../../utills/ServiceUrls";

const LayoutEmployees = () => {

    const dataNav = [
        {
            navname: 'Deans',
            navpath: "deans"
        },
        {
            navname: 'Teachers',
            navpath: "teachers"
        },
        {
            navname: 'Staff',
            navpath: "staff"
        },
    ]

    return (
        <Container>
            <NavBox>
                {dataNav.map((item, key) => (
                    <NavLink to={item.navpath} key={key}>{item.navname}</NavLink>
                ))}
            </NavBox>

            <Outlet/>
        </Container>
    );
};
const NavBox = styled.div`
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: center;
  gap: 40px;
  background-color: #ffffff;
  padding: 15px 40px;
  border-radius: 5px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;

  a {
    padding: 10px;
    text-align: center;
    border-radius: 5px;
    background-color: ${mainColor};
    color: #FFFFFF;
  }

  .active {
    background-color: #deedf4;
    color: ${mainColor};
    font-weight: bold;
  }
`

const Container = styled.div`
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  height: calc(100 hv -${navbarHeight});
`;

export default LayoutEmployees;
