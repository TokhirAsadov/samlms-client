import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import axios from "axios";
import {BASE_URL, getHeaders, USER} from "../../../utills/ServiceUrls";
import moment from "moment/moment";
import styled from "styled-components";
import {extrasmall, large, medium, small, xlarge} from "../../../responsiv";
import EmptyDataImg from "../../emptyDataImg/EmptyDataImg";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {FaClock} from "react-icons/fa";
import Button from "@mui/material/Button";
import {IoMdHome} from "react-icons/io";
import {Card, CardContent, Skeleton, Stack} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import {green} from "@mui/material/colors";
import {HiAcademicCap} from "react-icons/hi2";
import {Link} from "react-router-dom";
import {FaArrowRightLong} from "react-icons/fa6";
import 'moment/locale/en-au'
const TeacherTimeTableToday = () => {
    const user = useSelector(state => state?.user?.user)
    const {headers} = getHeaders();
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [objWeek, setObjWeek] = useState({
        date: new Date(),
        dateFrom: moment(new Date()).startOf('isoWeek').toDate(),
        dateTo: moment(new Date()).endOf('isoWeek').toDate(),
        weekNumber: moment(new Date()).isoWeek()
    });
    const fetchTodayLessonData = () => {
        setIsLoading(true)
        axios(BASE_URL + "/timeTableByWeekOfYear/getTeacherTimeTableToday?t=" + user?.id + "&week=" + objWeek?.weekNumber + "&year=" + moment(objWeek?.date).format("YYYY"), {headers})
            .then(res => {
                setData(res.data.obj[0]?.shows.map((curr, index, array) => ({
                    ...curr,
                    time: array.slice(0, index).some(item => item.periodStartAndEndTime === curr.periodStartAndEndTime)
                })).sort((a, b) => {
                    if (a?.hourNumber > b?.hourNumber) return 1;
                    if (a?.hourNumber < b?.hourNumber) return -1;
                    return 0;
                }) || [] )
            })
            .catch(err => {
                console.log(err)
                setData([])
            })
            .finally(()=>{
                setIsLoading(false)
            })
    }

    useEffect(() => {
        user && fetchTodayLessonData()
    }, [user]);
    console.log(data)
    return (
        <Card sx={{width: '100%'}}>
            <CardContent>
                <Box display={'flex'} justifyContent={'space-between'} gap={2}>
                    <Box display={'flex'} justifyContent={'start'} gap={2} alignItems={'center'}>
                        <Avatar sx={{bgcolor: green[500]}}>
                            <HiAcademicCap/>
                        </Avatar>
                        <Typography fontWeight={'bold'} color={"#ff5722"}>
                            Today's lessons ({moment().format('dddd')})
                        </Typography>
                    </Box>
                    <Link to={'../table'}>
                        <Button endIcon={<FaArrowRightLong/>}>view all</Button>
                    </Link>
                </Box>
            </CardContent>
            <CardContent sx={{bgcolor: green[50]}}>
                <SubjectBox>
                    {isLoading ? (Array.from({length:3}).map((_,i)=>(
                        <Card key={i} >
                            <CardContent sx={{padding: '15px !important'}}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '10px',
                                    }}
                                >
                                    <Skeleton animation="wave" height={25}  />
                                    <Stack direction={'row'} spacing={2}>
                                        <Skeleton animation="wave" height={25} width={'30%'} />
                                        <Skeleton animation="wave" height={25} width={'30%'} />
                                    </Stack>
                                </Box>
                            </CardContent>
                        </Card>
                    )) ): data?.map((item, index) => (
                        <Card key={index} >
                            <CardContent sx={{padding: '15px !important'}}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '10px',
                                    }}
                                >
                                    <Typography fontWeight={'bold'} fontSize={14}>
                                        {item?.lessonName}
                                    </Typography>
                                    <Stack direction={'row'} spacing={2}>
                                        <Button
                                            size="small"
                                            startIcon={<IoMdHome/>}
                                        >
                                            <Typography margin={0} fontSize={13}
                                                        fontWeight={'bold'}>{item?.room}</Typography>
                                        </Button>
                                        <Button
                                            size="small"
                                            startIcon={<FaClock/>}
                                        >
                                            <Typography margin={0} fontSize={13}
                                                        fontWeight={'bold'}>{item?.periodStartAndEndTime}</Typography>
                                        </Button>

                                    </Stack>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </SubjectBox>
                {data?.length === 0 && <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <EmptyDataImg w={200} h={180}/>
                </Box>}
            </CardContent>
        </Card>
    );
};
const SubjectBox = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  ${xlarge({
    gridTemplateColumns: ' repeat(2, 1fr)',
  })}
  ${large({
    gridTemplateColumns: ' repeat(2, 1fr)',
  })}
  ${medium({
    gridTemplateColumns: ' repeat(2, 1fr)',
  })}
  ${small({
    gridTemplateColumns: ' repeat(2, 1fr)',
  })}
  ${extrasmall({
    gridTemplateColumns: ' repeat(1, 1fr)',
  })}
`

export default TeacherTimeTableToday;