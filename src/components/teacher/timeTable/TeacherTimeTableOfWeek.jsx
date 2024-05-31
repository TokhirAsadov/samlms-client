import React from 'react';
import styled from 'styled-components'
import {Card, CardContent, Skeleton, Stack} from "@mui/material";
import {mainColor} from "../../../utills/ServiceUrls";
import moment from "moment";
import {MdOutlineAddCircleOutline, MdRemoveCircleOutline} from "react-icons/md";
import Typography from "@mui/material/Typography";
import EmptyDataImg from "../../emptyDataImg/EmptyDataImg";
import {useSelector} from "react-redux";

const TeacherTimeTableOfWeek = ({data, statistics, obj, isLoading}) => {
    const weekNumber = moment(new Date()).isoWeek();
    console.log(obj)
    const hours=useSelector(state => state.hourSection)


    const weekDaysObj = obj?.daysOfWeek?.map((item, index) => {
        const shortDayName = moment(item).format('dd');
        const fullDayName = moment(item).format('dddd');
        const capitalizedShortDayName = shortDayName.charAt(0).toUpperCase() + shortDayName.slice(1).toLowerCase();
        const capitalizedFullDayName = fullDayName.charAt(0).toUpperCase() + fullDayName.slice(1).toLowerCase();

        return {
            day: index + 1,
            name: capitalizedShortDayName,
            name2: capitalizedFullDayName,
            date: moment(item).format('DD.MM.YYYY'),
        }
    })

    return (
        <Container>
            {
                !isLoading ? (
                        data?.length == 0 ? (
                            <Card>
                                <CardContent>
                                    <Typography textAlign={'center'} fontSize={20} fontWeight={'bold'} color={'error'}>
                                        No class schedule available !
                                    </Typography>
                                    <EmptyDataImg w={200} h={180}/>
                                </CardContent>
                            </Card>
                        ) : (
                            <Table>

                                <TableHeader>
                                    <TableItem flex={2}><b>TIME</b></TableItem>
                                    {
                                        hours?.map((hour, index) => (
                                            <TableItem flex={2} key={index}><b>{hour?.hour}</b></TableItem>
                                        ))
                                    }
                                </TableHeader>

                                <TableBody>

                                    {
                                        weekDaysObj?.map(
                                            (weekday, index) => {

                                                const itemList = data?.find(item => item?.shows[0]?.daysName === weekday?.name || item?.shows[0]?.daysName === weekday?.name2);

                                                let statisticItem = null;
                                                if (statistics) {
                                                    statisticItem = statistics[weekday?.day]
                                                }

                                                return (
                                                    <TableRow key={index}>
                                                        <TableItem flex={1}>
                                                            <DuringTime><b>{weekday?.name}</b></DuringTime>
                                                            <DuringTime><b>{weekday?.date}</b></DuringTime>
                                                        </TableItem>

                                                        {
                                                            hours?.map((hour, index) => {
                                                                let hourItem = itemList?.shows?.find(item => item?.hourNumber === hour?.number);
                                                                let times = statisticItem?.find(item => item?.room?.startsWith(hourItem?.room)) || statisticItem?.find(item => item?.room?.startsWith(hourItem?.room?.substring(0, hourItem?.room?.indexOf('-') + 4)));

                                                                let timesTouch = times?.times?.filter(item => item?.section === hour?.number)?.sort(function (o1, o2) {
                                                                    if (o1?.time > o2?.time) return 1;
                                                                    else if (o1?.time < o2?.time) return -1;
                                                                    else return 0;
                                                                })

                                                                let tim2 = new Date(hour?.start);
                                                                tim2.setDate(tim2.getDate() - tim2.getDay() + weekday?.day);


                                                                return hourItem ?
                                                                    (
                                                                        <TableItem flex={1} key={index}
                                                                                   bg={(timesTouch === undefined || timesTouch?.length === 0) && ((weekday?.day <= new Date().getDay() && (hour?.start < new Date() || tim2 < new Date())) || obj?.weekNumber < weekNumber || obj.dateTo.getFullYear()<new Date().getFullYear())}>
                                                                            <TableItemWrapper>
                                                                                {/*<TeacherName> {hourItem?.room}</TeacherName>*/}
                                                                                <LessonGroups
                                                                                    fontSize={hourItem?.lessonName?.length > 18 ? "8px" : "9px"}>
                                                                                    {
                                                                                        hourItem?.groups?.length > 1
                                                                                            ?
                                                                                            hourItem?.groups?.join('/ ')
                                                                                            :
                                                                                            hourItem?.groups[0]
                                                                                    }
                                                                                </LessonGroups>
                                                                                <LessonName
                                                                                    fontSize={hourItem?.lessonName?.length > 18 ? "8px" : "9px"}>{hourItem.lessonName}</LessonName>
                                                                                {
                                                                                    timesTouch && timesTouch?.length !== 0 &&
                                                                                    <TimeTouch
                                                                                        color={new Date(new Date(hour?.start).setTime(
                                                                                            timesTouch?.[0]?.time
                                                                                        )) <= tim2}>

                                                                                        {
                                                                                            new Date(new Date(hour?.start).setTime(
                                                                                                timesTouch?.[0]?.time
                                                                                            )) <= tim2
                                                                                                ?
                                                                                                <MdOutlineAddCircleOutline
                                                                                                    size={16}/>
                                                                                                :
                                                                                                <MdRemoveCircleOutline
                                                                                                    size={16}/>
                                                                                        }

                                                                                        {" "}

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
                                                                                    (timesTouch === undefined || timesTouch?.length === 0) && ((weekday?.day <= new Date().getDay() && (hour?.start < new Date() || tim2 < new Date())) || obj?.weekNumber < weekNumber) &&
                                                                                    <TimeTouch color={false}>
                                                                                        <MdRemoveCircleOutline
                                                                                            size={12}/> {" "} 50:00
                                                                                    </TimeTouch>
                                                                                }

                                                                                <RoomNumber
                                                                                    fontSize={hourItem?.room?.length > 6 ? "8px" : "12px"}>{hourItem?.room}</RoomNumber>
                                                                            </TableItemWrapper>
                                                                        </TableItem>
                                                                    )
                                                                    :
                                                                    (
                                                                        <TableItem flex={1} key={index}>{" - "}</TableItem>
                                                                    )

                                                            })
                                                        }

                                                    </TableRow>
                                                )
                                            }
                                        )
                                    }


                                </TableBody>

                            </Table>
                        )
                    )
                    : <Stack spacing={1}>
                        <Skeleton variant="rectangular" style={{margin: "0 auto"}} width={1076} height={490}/>
                    </Stack>
            }

        </Container>
    )
};


const TimeTouch = styled.span`
    color: ${props => props?.color ? "green" : "red"};
    position: absolute;
    top: 40%;
    right: -26.3px;
    font-size: 11px;
    rotate: 90deg;
`

const RoomNumber = styled.span`
    font-size: ${props => props.fontSize || "12px"};;
    font-weight: 600;
    letter-spacing: 0.8px;
`;

const LessonGroups = styled.span`
    display: flex;
    align-items: start;
    font-size: ${props => props.fontSize || "9px"};
    text-align: start;
    font-weight: 600;
    letter-spacing: 0.8px;
`;

const LessonName = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${props => props.fontSize || "9px"};
    text-align: center;
    font-weight: 600;
    letter-spacing: 0.8px;
`;

const DuringTime = styled.span`
    font-size: 12px;
    font-weight: 300;
`;

const TableRow = styled.div`
    width: 100%;
    height: 130px;
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
    gap: 8px;
    border-right: 0.1px solid #cacaca;
    font-size: 9px;
    padding: 10px !important;

    background-color: ${props => props?.bg ? "red" : "white"};
    color: ${props => props?.bg ? "white" : "#000"};

`;

const TableItemWrapper = styled.span`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 5px;
    position: relative;
`;

const TableHeader = styled.div`
    width: 100%;
    height: 60px;
    display: flex;
    background-color: #B4E2FB;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.2px;
`;

const Table = styled.div`
    overflow: hidden;
    margin: 0 auto;
    width: 1500px;
    border: 0.2px solid ${mainColor};
    border-radius: 7px;
    box-shadow: rgba(99, 99, 99, 0.2) 0 2px 8px 0;
`;


const Container = styled.div`
    width: 100%;
    height: 80vh;
    overflow: scroll;
`;

export default TeacherTimeTableOfWeek;