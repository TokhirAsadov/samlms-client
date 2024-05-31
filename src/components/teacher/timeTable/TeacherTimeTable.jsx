import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {BASE_URL, getHeaders, mainColor, navbarHeight} from "../../../utills/ServiceUrls";
import axios from "axios";
import TeacherTimeTableOfWeek from "./TeacherTimeTableOfWeek";
import {useSelector} from "react-redux";
import moment from "moment";
import 'moment/locale/ru';
const TeacherTimeTable = () => {

  const {headers} = getHeaders();
  const [data,setData] = useState([]);
  const [statistics,setStatistics] = useState(null);
  const user = useSelector(state => state?.user?.user)
    const [isLoading, setIsLoading] = useState(false)
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
        date: new Date(),
        dateFrom: moment(new Date()).startOf('isoWeek').toDate(),
        dateTo: moment(new Date()).endOf('isoWeek').toDate(),
        weekNumber: moment( new Date()).isoWeek(),
        daysOfWeek:getDaysOfWeek(moment( new Date()).isoWeek(),moment().year()),
    });

    useEffect(()=>{
        setIsLoading(true)
    axios.get(BASE_URL+"/timeTableByWeekOfYear/getTeacherTimeTable?t="+user?.id+"&week="+objWeek?.weekNumber+"&year="+moment(objWeek?.date).format("YYYY"),{headers})
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

        console.log(convertDate);
        setData(convertDate)
      })
      .catch(err => {
        console.log(err)
      })
        .finally(()=>{
            setIsLoading(false)
        })


    axios.get(BASE_URL+"/user/getTeacherStatisticsForTimeTableByWeek?teacherId="+user?.id+"&week="+objWeek?.weekNumber+"&year="+moment(objWeek?.date).format("YYYY"), {headers})
      .then(res => {
        setStatistics(res?.data?.obj);
      })
      .catch(err => {
        console.log(err)
          setStatistics([])
      })

  },[])

  return (
    <Container>
      <Title>Schedule of lessons</Title>

      {
        statistics!==null && <TeacherTimeTableOfWeek isLoading={isLoading} obj={objWeek} data={data} statistics={statistics}/>
      }

    </Container>
  );
};

const Title = styled.h3`
  color: ${mainColor};
  margin-bottom: 20px;
`


const Container = styled.div`
  width: 100%;
  padding: 1rem!important;
`;


export default TeacherTimeTable;