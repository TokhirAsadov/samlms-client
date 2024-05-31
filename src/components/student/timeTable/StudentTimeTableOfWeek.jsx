import React, {memo, useEffect, useState} from 'react';
import styled from 'styled-components'
import axios from "axios";
import {Card, CardContent, Skeleton, Stack} from "@mui/material";
import {BASE_URL, getHeaders, STUDENT_TIME_TABLE_WITH_WEEK,} from "../../../utills/ServiceUrls";
import moment from "moment";
import {MdOutlineAddCircleOutline, MdRemoveCircleOutline} from "react-icons/md";
import Typography from "@mui/material/Typography";
import EmptyDataImg from "../../emptyDataImg/EmptyDataImg";
import {useSelector} from "react-redux";
import {TbClipboardCheck, TbClipboardX} from "react-icons/tb";

const StudentTimeTableOfWeek = ({group, s, obj, userId}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [table, setTable] = useState(null);
    const [statistics, setStatistics] = useState(null);
    const [error, setError] = useState(false)
    const {headers} = getHeaders();

    const weekNumber = moment(new Date()).isoWeek();


    useEffect(() => {
        setIsLoading(true)
        setError(false)
        axios.get(s ? BASE_URL + STUDENT_TIME_TABLE_WITH_WEEK + group + "?day=0&s=" + s + "&week=" + obj?.weekNumber + "&year=" + moment(obj?.date).format("YYYY") : BASE_URL + "/timeTableByWeekOfYear/studentTimeTable/" + group + "/" + userId + "?year=" + moment(obj?.date).format("YYYY") + "&week=" + obj?.weekNumber + "&day=0&s=" + s, {headers})
            .then(res => {
                // console.log(res?.data,"<------------------------------------------------------")
                setTable(res?.data?.obj);
                setStatistics(res?.data?.secondObj.flat());
                setIsLoading(false);
            })
            .catch(err => {
                setIsLoading(false);
                setError(true)
                console.log(err)
            })

    }, [group, obj]);

    const hours = useSelector(state => state.hourSection)


    const weekdays = [
        {
            day: 1,
            name: "Пн"
        },
        {
            day: 2,
            name: "Вт"
        },
        {
            day: 3,
            name: "Ср"
        },
        {
            day: 4,
            name: "Чт"
        },
        {
            day: 5,
            name: "Пт"
        },
        {
            day: 6,
            name: "Сб"
        },

    ];

    return (
        <Container>
            {
                !isLoading ? table && statistics && (
                    <Table>
                        <TableHeader>
                            <TableItem flex={1}>TIME</TableItem>
                            <TableItem flex={2}>MONDAY</TableItem>
                            <TableItem flex={2}>TUESDAY</TableItem>
                            <TableItem flex={2}>WEDNESDAY</TableItem>
                            <TableItem flex={2}>THURSDAY</TableItem>
                            <TableItem flex={2}>FRIDAY</TableItem>
                            <TableItem flex={2}>SATURDAY</TableItem>
                        </TableHeader>
                        <TableBody>

                            {
                                hours?.map((hour, index) => {
                                    return table["get" + hour?.number]?.length > 0 ? <TableRow key={index}>
                                            <TableItem flex={1}>
                                                <DuringTime>{hour?.hour}</DuringTime>
                                            </TableItem>
                                            {
                                                weekdays?.map((weekday, iii, index2) => {
                                                    let tim2 = new Date(hour?.start);
                                                    tim2.setDate(tim2.getDate() - tim2.getDay() + weekday?.day);
                                                    let timesTouch = statistics?.filter(i => i?.weekday === weekday?.day && i?.section === hour?.number);
                                                    let timesTouchDynamic = statistics?.filter(i => i?.weekday === weekday?.day && i?.section === hour?.number)?.find(i => i.type === 'DYNAMIC') || null;

                                                    return <TableItem flex={2} key={iii}>
                                                        {
                                                            table["get" + hour?.number]?.filter(item => item?.dayNumber === weekday?.day)
                                                                .map((item, index) => {

                                                                        return <TableItemWrapper key={index}
                                                                                                 bg={(timesTouch === undefined || timesTouch?.length === 0) && (weekNumber > obj?.weekNumber || weekday?.day < new Date().getDay() || (weekday?.day === new Date().getDay() && tim2 < new Date()) || moment(obj.date).format('YYYY') < new Date().getFullYear())}>
                                                                            {item?.teacherName?.map((e, num) =>
                                                                                <TeacherName key={num}>{e}</TeacherName>
                                                                            )}
                                                                            <LessonName
                                                                                fontSize={item?.lessonName > 18 ? "5px" : "7px"}>{item?.lessonName}</LessonName>
                                                                            <RoomNumber>{item.room}</RoomNumber>

                                                                            {
                                                                                timesTouch && timesTouch?.length !== 0 &&
                                                                                <TimeTouch
                                                                                    color={timesTouchDynamic ? '#FFA500' : new Date(new Date(hour?.start).setTime(
                                                                                        timesTouch?.[0]?.time
                                                                                    )) <= tim2 ? 'green' : 'red'}>


                                                                                    {
                                                                                        timesTouchDynamic ? (timesTouchDynamic?.isCome ?
                                                                                            <TbClipboardCheck size={18}/> :
                                                                                            <TbClipboardX
                                                                                                size={18}/>) : new Date(new Date(hour?.start).setTime(
                                                                                            timesTouch?.[0]?.time
                                                                                        )) <= tim2
                                                                                            ?
                                                                                            <MdOutlineAddCircleOutline
                                                                                                size={18}/>
                                                                                            :
                                                                                            <MdRemoveCircleOutline size={18}/>
                                                                                    }


                                                                                    {moment(new Date(
                                                                                        new Date(new Date(hour?.start).setTime(
                                                                                            timesTouch?.[0]?.time
                                                                                        )) <= tim2

                                                                                            ?

                                                                                            new Date(hour?.start).setDate(
                                                                                                new Date(timesTouch[0]?.time).getDate()
                                                                                            ) - timesTouch[0]?.time

                                                                                            :

                                                                                            timesTouch[0]?.time
                                                                                            -
                                                                                            new Date(hour?.start).setDate(
                                                                                                new Date(timesTouch[0]?.time).getDate()
                                                                                            )
                                                                                    )).format("mm:ss")}


                                                                                </TimeTouch>
                                                                            }

                                                                            {
                                                                                (timesTouch === undefined || timesTouch?.length === 0) && (weekNumber > obj?.weekNumber || weekday?.day < new Date().getDay() || (weekday?.day === new Date().getDay() && tim2 < new Date())) &&
                                                                                <TimeTouch>
                                                                                    <MdRemoveCircleOutline size={16}/>
                                                                                </TimeTouch>
                                                                            }

                                                                        </TableItemWrapper>
                                                                    }
                                                                )
                                                        }
                                                    </TableItem>
                                                })
                                            }
                                        </TableRow>
                                        :
                                        ""
                                })
                            }

                        </TableBody>
                    </Table>
                )
                    : (
                        <Stack spacing={1}>
                            <Skeleton variant="rectangular" width={"100%"} height={490}/>
                        </Stack>
                    )
            }
            {
                error && (
                    <Card>
                        <CardContent>
                            <Typography textAlign={'center'} fontSize={20} fontWeight={'bold'} color={'error'}>
                                No class schedule available !
                            </Typography>
                            <EmptyDataImg w={200} h={180}/>
                        </CardContent>
                    </Card>
                )
            }
        </Container>
    );
};

const TimeTouch = styled.span`
    color: ${props => props?.color};
    position: absolute;
    bottom: 5px;
    right: 5px;
    font-size: 11px;
    line-height: 11px;
    display: flex;
    align-items: center;
    gap: 3px;
`


const RoomNumber = styled.span`
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.8px;
`;

const LessonName = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${props => props.fontSize || "7px"};
    text-align: center;
    font-weight: 600;
    letter-spacing: 0.8px;
`;

const TeacherName = styled.span`
    font-size: 12px;
    font-weight: 300;
    letter-spacing: 0.8px;
`;

const DuringTime = styled.span`
    font-size: 12px;
    font-weight: 300;
`;

const TableRow = styled.div`
    width: 100%;
    min-height: 120px;
    display: flex;
    border-top: 0.1px solid #cacaca;
`;

const TableBody = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.2px;
`;


const TableItem = styled.span`
    flex: ${props => props.flex};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border-right: 0.1px solid #cacaca;
`;

const TableItemWrapper = styled.span`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;

    background-color: ${props => props?.bg ? "red" : "white"};
    color: ${props => props?.bg ? "white" : "#000"};

`;

const TableHeader = styled.div`
    width: 100%;
    top: 0;
    border-radius: 5px 5px 0 0;
    height: 35px;
    display: flex;
    background-color: #B4E2FB;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.2px;
    z-index: 0;
`;

const Table = styled.div`
    position: relative;
    width: 1200px;
    border: 1px solid #cecece;
    border-radius: 5px;
    overflow: hidden;
    margin: 0 auto;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
`;


const Container = styled.div`
    width: 100%;
    height: 100%;
    overflow: scroll !important;
`;

export default memo(StudentTimeTableOfWeek);