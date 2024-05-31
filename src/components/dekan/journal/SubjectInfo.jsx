import React from 'react';
import styled from "styled-components";
import {mainColor} from "../../../utills/ServiceUrls";
import {BsFillDoorOpenFill} from "react-icons/bs";
import {BiTimeFive} from "react-icons/bi";

const SubjectInfo = ({subjectInfo}) => {

    return (
        <>
         <Header>
             {subjectInfo.lesson}
         </Header>
            <Container>
                <p> <BsFillDoorOpenFill/> Room: {subjectInfo?.room}</p>
                <p> <BiTimeFive/>Time: {subjectInfo?.betweenDuringDate}</p>
            </Container>
        </>
    );
};
const Header=styled.div`
  width: 100%;
  padding: 0.7rem;
  background-color: ${mainColor};
  color: #ffffff;
  font-weight: bold;
  font-size: 16px;

`
const Container=styled.div`
  width: 100%;
  padding: 1rem;
  display: flex;
  justify-content: space-around;
  align-items: center;

  p {
    margin: 0;
    font-size: 15px;
    font-weight: bold;
  }

`
export default SubjectInfo;