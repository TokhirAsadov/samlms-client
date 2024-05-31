import React,{useState} from 'react';
import styled from "styled-components";
import {color_5, mainColor} from "../../../../../utills/ServiceUrls";
import DashboardBarChart from "./DashboardBarChart";
import {BsFillArrowUpCircleFill} from "react-icons/bs";
import {Autocomplete, TextField} from "@mui/material";

const DashboardBarChartSection = ({allComeCount}) => {

  return (
    <Container>
      <DashboardBarChart/>
    </Container>
  );
};


const Container = styled.div`
  min-height: 360px;
  width: 100%;
  border-radius: 10px;
  margin-top: 15px!important;
  padding: 10px!important;
  background-color: #fff; 
  color: ${mainColor};
`;

export default DashboardBarChartSection;