import React from 'react';
import styled from "styled-components";
import {extrasmall, large, medium, small} from "../../../responsiv";
import RegulationDashboard from "../../student/menu/RegulationDashboard";
import StatisticsMonthUser from "../statistics/StatisticsMonthUser";
import TeacherTimeTableToday from "../timeTable/TeacherTimeTableToday";
import ModalForFreeHours from "./ModalForFreeHours";

const TeacherMenu = () => {



  return (
    <Container>
      <RegulationDashboard/>
      <Header>
      </Header>
      <StatisticsBox>
        <TeacherTimeTableToday/>
        <StatisticsMonthUser/>
      </StatisticsBox>
        <ModalForFreeHours/>
    </Container>
  );
};

const StatisticsBox=styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns:  1fr 0.1fr;
    align-items: flex-start;
  ${large({
  gridTemplateColumns: '1fr',
})}
${medium({
  gridTemplateColumns: '1fr',
})}
${small({
  gridTemplateColumns: '1fr',
})}
${extrasmall({
  justifyItems:'center',
  gridTemplateColumns: '1fr',
})}
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  ${extrasmall({
    justifyContent: "center",
  })}
`;


const Container = styled.div`
  width: 100%;
  padding: 1rem!important;
`;


export default TeacherMenu;