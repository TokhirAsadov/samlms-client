import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL, getHeaders } from "../../../../utills/ServiceUrls";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Spinner from "../../../spinner/Spinner";
import {Card, CardContent} from "@mui/material";
import Typography from "@mui/material/Typography";
import moment from "moment/moment";
import Button from "@mui/material/Button";
import styled from "styled-components";

const SemesterStatistics = () => {
    const groupId = useSelector(state => state.student.student.groupData?.id);
    const [dateVal, setDateVal] = useState("");
    const [load, setLoad] = useState(false);
    const [eduYears, setEduYears] = useState([]);
    const [data, setData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${BASE_URL}/education/educationYearsForSelected`, getHeaders())
            .then(res => {
                const years = res?.data?.obj || [];
                setEduYears(years);
                if (years.length > 0) {
                    setDateVal(years[0].id); // Initialize with the first year's ID
                }
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    useEffect(() => {
        if (groupId && dateVal) {
            setLoad(true);
            axios.get(`${BASE_URL}/student/monitoringByEducationYear/${groupId}/${dateVal}`, getHeaders())
                .then(res => {
                    setData(res.data);
                })
                .catch(err => {
                    console.error(err);
                })
                .finally(() => {
                    setLoad(false);
                });
        }
    }, [groupId, dateVal]);

    const handleChange = (event) => {
        setDateVal(event.target.value);
    };

    return (
        <div>
            <Box sx={{ width: 300, background: "#fff",mt:'20px' }}>
                <TextField
                    fullWidth
                    select
                    size="small"
                    value={dateVal}
                    onChange={handleChange}
                    label="Education Year"
                >
                    {eduYears.map((year) => (
                        <MenuItem key={year.id} value={year.id}>
                            {year.name}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>
            {load ? <Spinner/> :<Card sx={{maxWidth:'1200px',m:'20px auto'}}>
                <CardContent>
                    <Typography>
                        <b> Education year</b>
                    </Typography>
                    <Box sx={{marginTop: '20px'}}>
                        <Box sx={{display: 'flex', gap: '20px'}}>
                            <BoxData bg={'#00bd00'}>
                                attended the lesson: <b>{data?.split('/')[1]}</b>
                            </BoxData>
                            <BoxData bg={'#ff5454'}>
                                didn't attend classes:<b> {data?.split('/')[2]}</b>
                            </BoxData>
                        </Box>
                        <BoxData bg={'#5f67ff'} style={{marginTop: '20px'}}>
                            total:<b> {data?.split('/')[0]}</b>
                        </BoxData>
                    </Box>
                </CardContent>
            </Card>}
        </div>
    );
};
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
export default SemesterStatistics;
