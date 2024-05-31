import React from 'react';
import styled from "styled-components";
import {Card, CardContent} from "@mui/material";
import {AiFillWarning} from "react-icons/ai";

const TechnicalWork = () => {
    return (
        <Container>
           <Card>
               <CardContent>
                  <h3><AiFillWarning/> Technical work is underway !</h3>
               </CardContent>
           </Card>
        </Container>
    );
};
const Container=styled.div`
  width: 100%;
  padding: 1rem;

  h3 {
    text-align: center;
    color: #ffbf5e;
  }
`
export default TechnicalWork;