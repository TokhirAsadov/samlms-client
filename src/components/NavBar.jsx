import React from 'react';
import styled from "styled-components";
import LogoNav from "./LogoNav";
import Language from "./Language";
import {useTranslation} from "react-i18next";
import {FaSearch} from "react-icons/fa";

const NavBar = () => {
  const {t} = useTranslation();

  return (
    <Container>
      <Wrapper>
        <LogoNav />

        <WrapperItem>
            <SearchContainer>
              <Input placeholder='Search'/>
              <FaSearch style={{color:"gray",fontSize:16}}/>
            </SearchContainer>
            <Language />
        </WrapperItem>
      </Wrapper>
    </Container>
  );
};

const SearchContainer = styled.div` 
  display:flex;
  align-items: center;
  border: 0.5px solid lightgray;
  justify-content: center;
  margin-left:25px;
  padding: 5px;
`

const Input = styled.input`
  border:none;
  &:focus{
    outline:none;
    background-color: lightgray;
  } 
`

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px!important;
  width: calc(100vw);
  height: 60px;
  background-color: #fff;
  z-index: 1;
  -webkit-box-shadow: 1px 0px 8px -3px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 1px 0px 8px -3px rgba(34, 60, 80, 0.2);
  box-shadow: 1px 0px 8px -3px rgba(34, 60, 80, 0.2);
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 95%;
`;

const WrapperItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 20%;
`;


export default NavBar;