import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import axios from "axios";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import moment from "moment";
import Spinner2 from "../../spinner/Spinner2";
import {Card, CardContent} from "@mui/material";

const EducationStatistics = () => {
    const [check, setCheck] = useState(false);
    const [data, setData] = useState([]);
    const [statistics, setStatistics] = useState([]);

    const [map1, setMap1] = useState(new Map());

    const {headers} = getHeaders();

    useEffect(() => {
        setCheck(true);
        setCheck(false);
        fetchData();

    }, [])

    const [objWeek, setObjWeek] = useState({
        date: new Date(),
        dateFrom: moment(new Date()).startOf('isoWeek').toDate(),
        dateTo: moment(new Date()).endOf('isoWeek').toDate(),
        weekNumber: moment(new Date()).isoWeek(),
        year: moment(new Date()).year(),
        weekday: moment(new Date()).day(),
    });


    const fetchData = () => {

        axios.get(BASE_URL + `/timeTableByWeekOfYear/getTimeTableByAllRoomAndWeek2?week=${objWeek?.weekNumber}&weekday=${objWeek.weekday}&year=${objWeek.year}&t=false`, {headers})
            .then(res => {
                setData(res?.data?.obj);
                setStatistics(res?.data?.secondObj);
                setCheck(true)
            })
            .catch(err => {
                console.log(err)
            })
    }


    useEffect(() => {
        data && setMap1(downloadStatistics(data, statistics))
    }, [data])



    const downloadStatistics = (data, statistics) => {

        let kafedraNames = new Set();
        let connectKafedra = new Map();
        let kafedraAndTeachers = new Map();
        let lessonAndStatistics = new Map();

        data?.length > 0 && data?.forEach(d => {
            d?.forEach(d2 => {
                kafedraNames.add(d2?.kafedraId)
                connectKafedra.set(d2, d2?.kafedraId)

            })
        })
        kafedraNames.forEach(k => {
            let arr = [];
            connectKafedra.forEach((value, key) => {
                if (value === k) {
                    arr.push(key)
                }
            })
            kafedraAndTeachers.set(k, arr)
        })
        kafedraAndTeachers.forEach((value, key) => {
            let arr2 = [];
            let names = new Set();
            let teacherLessons = new Map();
            value?.forEach((val) => {
                let itm = statistics.flat()?.filter(s => s?.room === val?.room && s?.section === val?.hourNumber);
                if (itm?.length === 0) {
                    arr2.push(val)
                }
            })
            arr2?.forEach(i => {
                names.add(i?.teacherName[0])
            })
            names.forEach(i => {
                teacherLessons.set(i, arr2?.filter(i2 => i2?.teacherName[0] === i))
            })
            lessonAndStatistics.set(key, teacherLessons)
        })


        const arr = Array.from(lessonAndStatistics);
        return arr?.map(i => [i[0], Array.from(i[1])]);
    }


    return (
        <Container>
            <Card>
                <CardContent>
                    {
                        check && data?.length > 0 && map1?.length > 0
                            ? map1?.map(i2 => {
                                return <Table>
                                    <Row>
                                        <KafedraName>{i2[0]}</KafedraName>
                                        <ItemWrapper>
                                            {
                                                i2[1]?.map((teacher, teacherIndex) => {
                                                    return <Item>
                                                        <TeacherCount>{teacherIndex + 1}</TeacherCount>
                                                        <TeacherItem>{teacher[0]}</TeacherItem>
                                                        <DataItem>
                                                            {
                                                                teacher[1]?.sort((a, b) => (a.hourNumber > b.hourNumber) ? 1 : ((b.hourNumber > a.hourNumber) ? -1 : 0))?.map(les => {
                                                                    return <StatisticsItem>
                                                                        <Child flex={2}
                                                                               fs={"9px"}>{les?.lessonName}</Child>
                                                                        <Child flex={1} fs={"11px"}>{les?.room}</Child>
                                                                        <Child
                                                                            flex={1}>{moment(objWeek?.date).format("DD-MM-YYYY")}</Child>
                                                                        <Child
                                                                            flex={1}>{les?.periodStartAndEndTime}</Child>
                                                                    </StatisticsItem>
                                                                })
                                                            }
                                                        </DataItem>
                                                    </Item>
                                                })
                                            }
                                        </ItemWrapper>
                                    </Row>
                                </Table>
                            })
                            : <Spinner2/>
                    }
                </CardContent>
            </Card>
        </Container>
    );
};

const Child = styled.div`
    flex: ${props => props.flex || 1};
    font-size: ${props => props.fs || "14px"};
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid blue;
    padding: 5px;
    text-align: center;
`

const StatisticsItem = styled.div`
    display: flex;
    width: 100%;
    
`

const DataItem = styled.div`
    flex: 6;
    display: flex;
    flex-direction: column;

`

const TeacherItem = styled.div`
    flex: 2;
    border: 1px solid blue;
    display: flex;
    align-items: center;
    justify-content: center;
`
const TeacherCount = styled.div`
    flex: 0.25;
    border: 1px solid blue;
    display: flex;
    align-items: center;
    justify-content: center;
`

const Item = styled.div`
    width: 100%;
    display: flex;
    border: 1px solid blue;

`

const ItemWrapper = styled.div`
    flex: 8;
    display: flex;
    flex-direction: column;
`

const KafedraName = styled.div`
    flex: 2;
    border: 2px solid blue;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 24px;

`

const Row = styled.div`
    width: 100%;
    display: flex;
`

const Table = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
`

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 10px;

`

export default EducationStatistics;