import React,{useEffect, useState} from 'react';
import styled from "styled-components";
import {mainColor} from "../../../utills/ServiceUrls";
import {MdOutlineAddCircleOutline, MdRemoveCircleOutline} from "react-icons/md";
import moment from "moment";
import {Skeleton, Stack} from "@mui/material";

const TimeTableForUquvBulim = ({data,statistics,weekDay,week}) => {
  const [check,setCheck] = useState(false);

  useEffect(()=>{

    console.log(data,"data")
    console.log(statistics,"statistics")

    setCheck(true);
  },[]);

  let changeHour = new Date();
  let thisWeek = moment(new Date()).isoWeek();

  const hours = [
    {
      number: 1,
      hour: "9:00 - 9:50",
      start: changeHour.setHours(9, 0, 0),
      end: changeHour.setHours(9, 50, 0),
    },
    {
      number: 2,
      hour: "10:00 - 10:50",
      start: changeHour.setHours(10, 0, 0),
      end: changeHour.setHours(10, 50, 0),
    },
    {
      number: 3,
      hour: "11:00 - 11:50",
      start: changeHour.setHours(11, 0, 0),
      end: changeHour.setHours(11, 50, 0),
    },
    {
      number: 4,
      hour: "12:00 - 12:50",
      start: changeHour.setHours(12, 0, 0),
      end: changeHour.setHours(12, 50, 0),
    },
    {
      number: 5,
      hour: "13:00 - 13:50",
      start: changeHour.setHours(13, 0, 0),
      end: changeHour.setHours(13, 50, 0),
    },
    {
      number: 6,
      hour: "14:00 - 14:50",
      start: changeHour.setHours(14, 0, 0),
      end: changeHour.setHours(14, 50, 0),
    },
    {
      number: 7,
      hour: "15:00 - 15:50",
      start: changeHour.setHours(15, 0, 0),
      end: changeHour.setHours(15, 50, 0),
    },
    {
      number: 8,
      hour: "16:00 - 16:50",
      start: changeHour.setHours(16, 0, 0),
      end: changeHour.setHours(16, 50, 0),
    },
    {
      number: 9,
      hour: "17:00 - 17:50",
      start: changeHour.setHours(17, 0, 0),
      end: changeHour.setHours(17, 50, 0),
    },
    {
      number: 10,
      hour: "18:00 - 18:50",
      start: changeHour.setHours(18, 0, 0),
      end: changeHour.setHours(18, 50, 0),
    },
    {
      number: 11,
      hour: "19:00 - 19:50",
      start: changeHour.setHours(19, 0, 0),
      end: changeHour.setHours(19, 50, 0),
    },
    {
      number: 12,
      hour: "20:00 - 20:50",
      start: changeHour.setHours(20, 0, 0),
      end: changeHour.setHours(20, 50, 0),
    },
  ];
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
    // {
    //   day: 7,
    //   name: "Во"
    // },
  ];

  return (
    <Container>
      {
        check ? <Table>

            <TableHeader>
              <TableItem flex={1}>TIME</TableItem>
              {
                hours?.map((hour,index) => (
                  <TableItem flex={2} key={index}>{hour?.hour}</TableItem>
                ))
              }
            </TableHeader>



            <TableBody>

              {
                weekdays?.filter(i => weekDay ? i.day===weekDay : i.day===new Date().getDay())?.map(
                  (weekday,index) => {

                    // const itemList = data?.find(item => item?.shows[0]?.daysName===weekday?.name);

                    let statisticItem = null;
                    if (statistics && statistics?.length!==0) {
                      statisticItem = statistics[weekday?.day]
                    }

                    return (
                      <TableRow key={index}>
                        <TableItem flex={1}>
                          <DuringTime>{weekday?.name}</DuringTime>
                        </TableItem>

                        {
                          hours?.map((hour,index) => {

                            let hourItem = data?.find(item => item?.hourNumber===hour?.number);


                            let timesTouch = statistics?.filter(item => item?.section===hour?.number)
                            let tim2 = new Date(hour?.start);
                            tim2.setDate(tim2.getDate()-tim2.getDay()+weekday?.day);



                            return hourItem ?
                              (
                                <TableItem flex={2} key={index} bg={(timesTouch===undefined || timesTouch?.length===0) && ((weekday?.day<=new Date().getDay()  && (hour?.start< new Date() || tim2 < new Date())) || week < thisWeek)}>
                                  <TableItemWrapper>
                                    <LessonName fontSize={hourItem?.lessonName?.length>18?"8px":"7px"}>{hourItem.lessonName}</LessonName>

                                    {
                                      timesTouch && timesTouch?.length !== 0 &&
                                      <TimeTouch color={new Date(hour?.start).setDate(
                                        new Date(timesTouch[0]?.time).getDate()
                                      ) >= timesTouch[0]?.time}>

                                        {
                                          new Date(hour?.start).setDate(
                                            new Date(timesTouch[0]?.time).getDate()
                                          ) >= timesTouch[0]?.time
                                            ?
                                            <MdOutlineAddCircleOutline size={16}/>
                                            :
                                            <MdRemoveCircleOutline size={16}/>
                                        }

                                        {" "}

                                        {moment(new Date(
                                          new Date(hour?.start).setDate(
                                            new Date(timesTouch[0]?.time).getDate()
                                          ) >= timesTouch[0]?.time

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
                                      (timesTouch===undefined || timesTouch?.length===0) && ((weekday?.day<=new Date().getDay()  && (hour?.start< new Date() || tim2 < new Date())) || week < thisWeek) &&
                                      <TimeTouch color={false}>
                                        {/*{moment(new Date() - hour?.start).format("mm:ss")}*/} <MdRemoveCircleOutline size={12}/> {" "} 50:00
                                      </TimeTouch>
                                    }

                                    <LessonGroups fontSize={hourItem?.teacherName?.length >1 ? "8px" : "7px"}>
                                      {
                                        hourItem?.teacherName?.length>1
                                          ?
                                          hourItem?.teacherName?.join('/ ')
                                          :
                                          hourItem?.teacherName[0]
                                      }
                                    </LessonGroups>
                                  </TableItemWrapper>
                                </TableItem>
                              )
                              :
                              (
                                <TableItem flex={2} key={index}>{" - "}</TableItem>
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
          : <Stack spacing={1}>
            <Skeleton variant="rectangular" style={{margin:"0 auto"}} width={1076} height={490} />
          </Stack>
      }
    </Container>
  );
};


const TimeTouch = styled.span`
  color: ${props => props?.color ? "green" : "red"};
  position: absolute;
  top: 40%;
  right: -26.3px;
  font-size: 11px;
  rotate: 90deg;
`



const LessonGroups = styled.span`
  display: flex;
  align-items: start;
  font-size: ${props => props.fontSize || "7px"};
  text-align: start;
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
  padding: 10px!important;

  background-color: ${props => props?.bg ? "red":"white"};
  color: ${props => props?.bg ? "white":"#000"};
  
`;

const TableItemWrapper = styled.span`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column; 
  gap: 20px;
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
  width: 1300px;
  border: 0.2px solid ${mainColor};
  border-radius: 7px;
  box-shadow: rgba(99, 99, 99, 0.2) 0 2px 8px 0;
`;


const Container = styled.div`
  width: 100%;
  overflow: scroll;
`;

export default TimeTableForUquvBulim;