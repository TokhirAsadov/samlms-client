import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {BASE_URL, DEKAN, getHeaders} from "../../../utills/ServiceUrls";
import DashboardCard from "./card/DashboardCard";
import DashboardBarChartSection from "./chart/barChart/DashboardBarChartSection";
import axios from "axios";
import {useDispatch} from "react-redux";
import moment from "moment";
import {extrasmall, large, medium, small} from "../../../responsiv";
import {fetchEducationYear} from "../../../redux/actions/educationYear/education_year_actions";
import Box from "@mui/material/Box";
import {Skeleton} from "@mui/material";

const Dashboard = () => {

    const [cardData, setCardData] = useState([]);
    const [allComeCount, setAllComeCount] = useState(0);

    const dispatch = useDispatch()
    const [open, setOpen] = useState(false);
    const {headers} = getHeaders();


    useEffect(() => {
        fetchEducationYears();
        setAllComeCount(0);
        axios.get(BASE_URL + DEKAN.GET + `?endTime=${moment(new Date()).format("yyyy.MM.DD")} 23:59&startTime=${moment(new Date()).format("yyyy.MM.DD")} 00:00`, {headers})
            .then(res => {
                let arr = [];
                let c1 = 0;
                let c2 = 0;
                res.data?.filter(i => i.level === 1)?.map(i => {
                    c1 = c1 + Number(i.comeCount);
                    c2 = c2 + Number(i.allCount);
                })
                arr.push({level: 1, comeCount: c1, allCount: c2})

                let c3 = 0;
                let c4 = 0;
                res.data?.filter(i => i.level === 2)?.map(i => {
                    c3 = c3 + Number(i.comeCount);
                    c4 = c4 + Number(i.allCount);
                })
                arr.push({level: 2, comeCount: c3, allCount: c4})

                let c5 = 0;
                let c6 = 0;
                res.data?.filter(i => i.level === 3)?.map(i => {
                    c5 = c5 + Number(i.comeCount);
                    c6 = c6 + Number(i.allCount);
                })
                arr.push({level: 3, comeCount: c5, allCount: c6})

                let c7 = 0;
                let c8 = 0;
                res.data?.filter(i => i.level === 4)?.map(i => {
                    c7 = c7 + Number(i.comeCount);
                    c8 = c8 + Number(i.allCount);
                })
                arr.push({level: 4, comeCount: c7, allCount: c8})


                setCardData(arr);
                if (arr?.length === 4) setOpen(true)
                setAllComeCount(0);
                res.data.map(item => {
                    if (item.comeCount !== null) {
                        setAllComeCount(prev => prev + parseInt(item.comeCount))
                    }
                })
            })
            .catch(err => {
                console.log(err, "Error");
                setOpen(true)
            })
    }, [])

    const fetchEducationYears = async () => {
        await axios.get(BASE_URL + '/education/educationYearsForSelected', {headers})
            .then(res => {
                dispatch(fetchEducationYear(res?.data?.obj?.[0]))
            })
            .catch(err => {
                console.log(err);
            })
    }


    return (
        <Container>
            {
                open === true ? (
                    <DashboardCards>
                        {
                            cardData && cardData?.map(
                                item => <DashboardCard
                                    key={item.level}
                                    course={item.level}
                                    comeCount={item.comeCount}
                                    allCount={item.allCount}
                                />
                            )
                        }
                    </DashboardCards>
                ) : (
                    <DashboardCards>
                        {Array.from({length: 4}).map(i => (
                            <Box
                                key={i}
                                sx={{height: '150px'}}
                            >
                                <Skeleton sx={{transform: 'scale(1)', height: '150px'}}/>
                            </Box>
                        ))}
                    </DashboardCards>
                )
            }
            <DashboardBarChartSection allComeCount={allComeCount}/>
        </Container>
    );
};

const DashboardCards = styled.div`
  margin: 10px 0 10px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  ${large({
    gridTemplateColumns: ' repeat(3, 1fr)',
  })}
  ${medium({
    gridTemplateColumns: ' repeat(2, 1fr)',
  })}
  ${small({
    gridTemplateColumns: ' repeat(2, 1fr)',
  })}
  ${extrasmall({
    gridTemplateColumns: ' repeat(1, 1fr)',
    gap: '20px',
  })}

`;
const Container = styled.div`
  width: 100%;
  padding: 1rem;
`;
export default Dashboard;