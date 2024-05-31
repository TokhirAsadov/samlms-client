import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {BASE_URL, getHeaders} from "../../../../utills/ServiceUrls";
import axios from "axios";
import TeacherTimeTableOfWeek from "../../../teacher/timeTable/TeacherTimeTableOfWeek";
import {extrasmall, large, medium, small} from "../../../../responsiv";
import moment from "moment";
import 'moment/locale/ru';
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 2 }}>
                    <>{children}</>
                </Box>
            )}
        </div>
    );
}



function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
const TeacherActions = ({userId}) => {

    const {headers} = getHeaders();
    const [data, setData] = useState([]);
    const [statistics, setStatistics] = useState(null);
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
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {

        setIsLoading(true)
        axios.get(BASE_URL + "/timeTableByWeekOfYear/getTeacherTimeTable?t=" + userId + "&week=" + objWeek?.weekNumber + "&year=" + moment(objWeek?.date).format("YYYY"), {headers})
            .then(res => {
                // console.log(res.data, "<-------------------------------------------------------------------- warda")
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
                setIsLoading(false)
            })
            .catch(err => {
                console.log(err)
            })

        fetchStatistics(userId);

    }, [])

    const fetchStatistics = (teacherId) => {

        axios.get(BASE_URL + "/user/getTeacherStatisticsForTimeTableByWeek?teacherId=" + teacherId + "&week=" + objWeek?.weekNumber + "&year=" + moment(objWeek?.date).format("YYYY"), {headers})
            .then(res => {
                setStatistics(res?.data?.obj);
            })
            .catch(err => {
                console.log(err)
            })
    }


    return (
        <Section>
            <MarkWrapper>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Schedule" {...a11yProps(0)} />
                    </Tabs>
                    <CustomTabPanel value={value} index={0}>
                        <TeacherTimeTableOfWeek isLoading={isLoading} obj={objWeek} data={data} statistics={statistics}/>
                    </CustomTabPanel>
                </Box>
            </MarkWrapper>
        </Section>
    );
};


const MarkWrapper = styled.div`
  width: 100%;
  background-color: #F4F8FD;
  padding: 20px 10px !important;
  border-radius: 10px;
`;

const Section = styled.div`
  
  width: 70%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 10px !important;
  ${large({
    width: "100%",
  })}
  ${medium({
    width: "100%",
  })}
  ${small({
    width: "100%",
  })}
  ${extrasmall({
    width: "100%",
  })}
`;

export default TeacherActions;