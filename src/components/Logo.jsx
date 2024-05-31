import React from 'react';
import styled from "styled-components";
import logo from "../utills/images/logo.png";

const LogoNav = () => {
    return (
        <Container>
             <Image />
        </Container>
    );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 125px;
`;

const Image = styled.img.attrs({
    src: `${logo}`
})`
  width: 100%;
  height: 100%;
  background-color: #fff;
  cursor: pointer;
`;

export default LogoNav;