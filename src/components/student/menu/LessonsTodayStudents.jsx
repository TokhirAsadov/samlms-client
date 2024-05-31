import React, {memo, useEffect, useState} from 'react';
import {Card, CardContent, Stack} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import {HiAcademicCap} from "react-icons/hi2";
import {green} from "@mui/material/colors";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import styled from "styled-components";
import Button from "@mui/material/Button";
import {FaArrowRightLong} from "react-icons/fa6";
import {FaClock} from "react-icons/fa";
import {Link} from "react-router-dom";
import {IoMdHome} from "react-icons/io";
import {extrasmall, large, medium, small, xlarge} from "../../../responsiv";
import axios from "axios";
import {BASE_URL, USER} from "../../../utills/ServiceUrls";
import {useSelector} from "react-redux";
import moment from "moment";
import EmptyDataImg from "../../emptyDataImg/EmptyDataImg";
import 'moment/locale/en-au'
const LessonsTodayStudents = () => {

    const group = useSelector(state => state.student.student?.groupData?.name)
    const [data, setData] = useState(null)

    const fetchTodayLessonData = (groupName) => {
        const day = new Date().getDay();
        axios(BASE_URL + USER.TIME_TABLE + groupName + "?day=" + day)
            .then(res => {
                Array.isArray(res.data.obj) ?
                    setData(() => res.data.obj?.map((curr, index, array) => ({
                        ...curr,
                        time: array.slice(0, index).some(item => item.periodStartAndEndTime === curr.periodStartAndEndTime)
                    })).sort((a, b) => {
                        if (a?.hourNumber > b?.hourNumber) return 1;
                        if (a?.hourNumber < b?.hourNumber) return -1;
                        return 0;
                    })) : setData(null)
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        group && fetchTodayLessonData(group)
    }, [group]);

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
                    {data?.map((item, index) => (
                        <Card key={index} sx={item.time ? {background: 'lightblue'} : {}}>
                            <CardContent sx={{padding:'15px !important'}}>
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
                                    <Stack  direction={'row'} spacing={2}>
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
                                    <Typography fontSize={12} textAlign={'end'} fontWeight={'bold'}>
                                        {item?.teacherName[0]}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </SubjectBox>
                {(data === null || data?.length === 0) && <Box sx={{display: 'flex', justifyContent: 'center'}}>
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
export default memo(LessonsTodayStudents);