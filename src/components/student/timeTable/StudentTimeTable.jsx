import React, {useState} from 'react';
import {useSelector} from "react-redux";
import styled from "styled-components";
import StudentTimeTableOfWeek from "./StudentTimeTableOfWeek";
import moment from "moment";
import {extrasmall} from "../../../responsiv";
import TextField from "@mui/material/TextField";


const StudentTimeTable = () => {
  const student = useSelector(state => state?.student?.student);

  const [weekData, setWeekData] = useState({
    date:moment().format('YYYY-[W]WW'),
    dateFrom: moment().startOf('isoWeek').toDate(),
    dateTo: moment().endOf('isoWeek').toDate(),
    weekNumber: moment().isoWeek()
  })
  const onChangeDate = (event) => {
    const date=event.target.value
    const weekNumber = moment(date).isoWeek();
    const dateFrom = moment(date).startOf('isoWeek').toDate();
    const dateTo = moment(date).endOf('isoWeek').toDate();

    setWeekData({
      date,
      dateFrom,
      dateTo,
      weekNumber
    })
  };



  return (
    <Container>
      <WrapperInput>
        <TextField
            label="Date of the week"
            type="week"
            sx={{width: "200px"}}
            value={weekData.date}
            onChange={onChangeDate}
        />
      </WrapperInput>
      <StudentTimeTableOfWeek userId={student?.id} group={student?.groupData?.name} s={false} obj={weekData}/>
    </Container>
  );
};


const WrapperInput = styled.div`

  padding: 10px 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 25px;
  
  ${extrasmall({
    margin:0,
    justifyContent:"center"
  })}
`

const Container = styled.div`
 width: 100%;
  padding: 1rem;
`;


export default StudentTimeTable;