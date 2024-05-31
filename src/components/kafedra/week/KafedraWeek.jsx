import React, {useEffect, useState} from 'react';
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import moment from "moment";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import TeacherTimeTableOfWeek from "../../teacher/timeTable/TeacherTimeTableOfWeek";
import styled from "styled-components";
import {extrasmall} from "../../../responsiv";
import {useSelector} from "react-redux";
import 'moment/locale/ru';

const KafedraWeek = () => {

  const section = useSelector(state => state?.section?.section);
  const [teachers,setTeachers] = useState([]);
  const [selectTeacherId,setSelectTeacherId] = useState(null);
  const {headers} = getHeaders();

  const [data,setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [statistics,setStatistics] = useState(null);
  const getDaysOfWeek = (weekNumber, year) => {
    moment.locale('ru');
    const startDate = moment().year(year).isoWeek(weekNumber).startOf('isoWeek');
    const daysOfWeek = [];
    for (let i = 0; i < 6; i++) {
      daysOfWeek.push(startDate.clone().add(i, 'days').toDate());
    }
    return daysOfWeek;
  };
  const [objWeek, setObjWeek] = useState({
    date: moment().format('YYYY-[W]WW'),
    dateFrom: moment().startOf('isoWeek').toDate(),
    dateTo: moment().endOf('isoWeek').toDate(),
    weekNumber: moment().isoWeek(),
    daysOfWeek:getDaysOfWeek(moment().isoWeek(),moment().year()),
  });

  const onChange = (event) => {
    const date=event.target.value
    const weekNumber = moment(date).isoWeek();
    const dateFrom = moment(date).startOf('isoWeek').toDate();
    const dateTo = moment(date).endOf('isoWeek').toDate();
    const dateYear=moment(date).year()

    setObjWeek({
      date,
      dateFrom,
      dateTo,
      weekNumber,
      daysOfWeek:getDaysOfWeek(weekNumber,dateYear)
    })
  }



  useEffect(()=>{
    section?.id && axios.get(BASE_URL+"/kafedra/getTeachersForSelectByKafedraId?kafedraId="+section?.id,{headers})
      .then(res => {
        setTeachers(res?.data?.obj)
      })
      .catch(err => {
        console.log(err)
      })
  },[])

  useEffect(() => {
    setIsLoading(true)
    selectTeacherId && axios.get(BASE_URL+"/timeTableByWeekOfYear/getTeacherTimeTable?t="+selectTeacherId+"&week="+objWeek?.weekNumber+"&year="+moment(objWeek?.date).format("YYYY"),{headers})
      .then(res=>{
        const resultData = res?.data?.obj

        const convertDate = [];

        const showGroups = {};

        resultData?.forEach((item) => {
          item.shows.forEach((show) => {
            const key = show.daysName;
            if (!showGroups[key]) {
              showGroups[key] = {
                teacherData: item.teacherData,
                shows: [],
              };
            }
            showGroups[key].shows.push(show);
          });
        });

        for (const key in showGroups) {
          convertDate.push(showGroups[key]);
        }
        setData(convertDate)
      })
      .catch(err => {
        console.log(err)
        setData([])
      })
        .finally(() => {
          setIsLoading(false)
        })

    selectTeacherId && fetchStatistics(selectTeacherId);

  },[selectTeacherId,objWeek])

  const fetchStatistics = (teacherId) => {
    axios.get(BASE_URL+"/user/getTeacherStatisticsForTimeTableByWeek?teacherId="+teacherId+"&week="+objWeek?.weekNumber+"&year="+moment(objWeek?.date).format("YYYY"), {headers})
      .then(res => {
        setStatistics(res?.data?.obj);
      })
      .catch(err => {
        console.log(err)
        setStatistics(null)
      })
  }

  return (
    <Container>

      <Wrapperinput>
        <Selectbox>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={ teachers }
            onChange={(event, newValue) => {
              setSelectTeacherId(newValue?.value)
            }}
            sx={{ width: 300,background: "#fff" }}
            renderInput={(params) => <TextField {...params} label="Teacher" />}
          />
        </Selectbox>

        <TextField
            label="Date of the week"
            type="week"
            sx={{width: "200px",background: "#fff"}}
            value={objWeek.date}
            onChange={onChange}
        />
      </Wrapperinput>

      {
        selectTeacherId && <TeacherTimeTableOfWeek isLoading={isLoading} obj={objWeek} data={data} statistics={statistics}/>
      }
    </Container>
  );
};


const Selectbox = styled.div`
  width: 300px;
  ${extrasmall({
  width:"80%"
})}
`
const Wrapperinput = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 25px;
  margin-bottom: 1rem;
  ${extrasmall({
  justifyContent:"center"
})}
`

const Container = styled.div`
  width: 100%;
  padding: 1rem;
`

export default KafedraWeek;