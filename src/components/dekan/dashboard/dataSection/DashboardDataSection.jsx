import React from 'react';
import { mainColor } from "../../../../utills/ServiceUrls";
import styled from 'styled-components'
import DashboardLineChartSection from "./lineChart/DashboardLineChartSection";
import BestStudents from "./bestStudents/BestStudents";
import StudentsWhoDoNotComeToClassTheMost from "./badStudents/StudentsWhoDoNotComeToClassTheMost";
import 'simplebar-react/dist/simplebar.min.css';
import './scroll.css';
import { useSelector } from "react-redux";
import Spinner from "../../../spinner/Spinner";

const DashboardDataSection = () => {

  const badBest = useSelector(state => state?.badBest?.badBest)

  if (badBest===undefined){
    return <Spinner />
  }

  return (
    <Container>
      <WrapperLineChartAndBestStudents>
        <DashboardLineChartSection />
        <BestStudents />
      </WrapperLineChartAndBestStudents>
      <>
        <StudentsWhoDoNotComeToClassTheMost />
      </>
    </Container>
  );
};

const WrapperLineChartAndBestStudents = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-direction: column;
  border-radius: 10px;
`;

const Container = styled.div`
  min-height: 360px;
  width: 100%;
  display: grid; 
  grid-template-columns: auto 20rem;
  gap: 20px;
  border-radius: 10px;
  margin-top: 10px!important; 
  color: ${mainColor};
`;

export default DashboardDataSection;