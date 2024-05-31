import React from 'react';
import styled from 'styled-components'
import { NavLink as BaseNavLink} from "react-router-dom";
import {mainColor} from "../../utills/ServiceUrls";
import {extrasmall} from "../../responsiv";

const SectionNav = ({data}) => {


  return (
    <Container>
      {
        data.map((item,index) => {
          return (

              <NavLink
                to={`${item.path}`}
                key={index}
              >
                {item.name}
              </NavLink>

          )
        })
      }
    </Container>
  );
};
const NavLink = styled(BaseNavLink)`
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px;
  color: ${mainColor} !important;
  padding: 5px 20px !important;
  height: 42px !important;
  margin: 5px;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
&:hover{
  background-color: #5093f1;
  color: #fff !important;
}
  &.active {
    color: #fff !important;
    background-color: #5093f1;
  }

  ${extrasmall({
    width: "80%",
    marginBottom: "10px",
  })}
`;

const Container = styled.div`
  margin: 0 auto;
  width: 95%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background-color: #fff;
  justify-content: space-between;
  margin-bottom: 20px !important;
  border-radius: 10px;
  padding: 15px 10px !important;
  box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
  ${extrasmall({
    justifyContent: "center"
  })}
`;


export default SectionNav;