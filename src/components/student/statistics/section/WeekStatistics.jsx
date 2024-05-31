import React, {useEffect, useState} from 'react';
import TextField from "@mui/material/TextField";
import moment from "moment";
import {useSelector} from "react-redux";
import axios from "axios";
import {BASE_URL, getHeaders} from "../../../../utills/ServiceUrls";
import {Card, CardContent} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import styled from "styled-components";
import Spinner from "../../../spinner/Spinner";
import {extrasmall, large, medium, small} from "../../../../responsiv";

const WeekStatistics = () => {

    const groupId = useSelector(state => state.student.student.groupData?.id)
    const [dateVal, setDateVal] = useState(moment().format('YYYY-[W]WW'));
    const [load, setLoad] = useState(false)
    const [data, setData] = useState(null)


    const getWeekStatistics = (groupId, valDate) => {
        setLoad(true)
        const date = moment(valDate)
        axios.get(`${BASE_URL}/student/monitoringByWeek/${groupId}?year=${date.year()}&week=${date.week()}`, getHeaders())
            .then(res => {
                console.log(res.data)
                setData(res.data)
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setLoad(false)
            })
    }
    useEffect(() => {
        getWeekStatistics(groupId, dateVal)
    }, [dateVal]);

    const onChangeDate = (val) => {
        setDateVal(moment(val.target.value).format('YYYY-[W]WW'))
    }

    return (
        <div style={{marginTop: '1rem'}}>
            <TextField
                size={'small'}
                label="Date of the week"
                type="week"
                sx={{width: "200px", bgcolor: '#fff'}}
                value={dateVal}
                onChange={onChangeDate}
            />

            {load ? <Spinner/> :
                <>
                    <BoxWeek>
                        {data && data?.dataOfMonitoringByWeek?.map((item, index) => {
                            return (
                                <Card key={index} sx={{mt: '20px'}}>
                                    <CardContent>
                                        <Typography textAlign={'center'}>
                                            <b>{moment(item.date).format('ddd-DD')}</b>
                                        </Typography>
                                        <Box sx={{display: 'flex', gap: '10px', marginTop: '10px', flexDirection: 'column'}}>
                                            <BoxData bg={'#00bd00'}>
                                                attended the lesson: <b>{item?.studentMonitoringByDay?.split('/')[1]}</b>
                                            </BoxData>
                                            <BoxData bg={'#ff5454'}>
                                                didn't attend classes:<b> {item?.studentMonitoringByDay?.split('/')[2]}</b>
                                            </BoxData>
                                            <BoxData bg={'#5f67ff'}>
                                                total:<b> {item?.studentMonitoringByDay?.split('/')[0]}</b>
                                            </BoxData>
                                        </Box>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </BoxWeek>
                    <Card sx={{m: '20px auto'}}>
                        <CardContent>
                            <Typography>
                                <b> Total this week: {moment(dateVal).week()} </b>
                            </Typography>
                            <Box sx={{marginTop: '20px'}}>
                                <Box sx={{display: 'flex', gap: '20px'}}>
                                    <BoxData bg={'#00bd00'}>
                                        attended the lesson: <b>{data?.studentMonitoringByWeek?.split('/')[1]}</b>
                                    </BoxData>
                                    <BoxData bg={'#ff5454'}>
                                        didn't attend classes:<b> {data?.studentMonitoringByWeek?.split('/')[2]}</b>
                                    </BoxData>
                                </Box>
                                <BoxData bg={'#5f67ff'} style={{marginTop: '20px'}}>
                                    total:<b> {data?.studentMonitoringByWeek?.split('/')[0]}</b>
                                </BoxData>
                            </Box>
                        </CardContent>
                    </Card>
                </>
            }
        </div>
    );
};
const BoxWeek = styled.div`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 30px;
    ${large({
        gridTemplateColumns: '1fr 1fr 1fr',
    })}
    ${medium({
        gridTemplateColumns: '1fr 1fr 1fr',
    })}
    ${small({
        gridTemplateColumns: '1fr 1fr',
    })}
    ${extrasmall({
        gridTemplateColumns: '1fr 1fr',
    })}
`
const BoxData = styled.div`
    width: 100%;
    height: 50px;
    font-size: 14px;
    padding: 5px;
    border-radius: 5px;
    background-color: ${props => props.bg};
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
`;
export default WeekStatistics;