import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import {Card, CardContent, Divider} from "@mui/material";
import Typography from "@mui/material/Typography";
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import AttendanceChooseScore from "./AttendanceChooseScore";
import axios from "axios";

const InfoScoreAttendance = ({allGradesForAttendance,gradeForAttendance,rating,eduId,groupId,subjectId,studentId}) => {

    const [data, setData] = useState([])
    const [load, setLoad] = useState(false)
    const getStatistic = () => {
        setLoad(true)
        axios.get(`${BASE_URL}/groupConnect/getStatisticsOfStudentForTeacher/${eduId}/${groupId}?subjectId=${subjectId}&studentId=${studentId}`, getHeaders())
            .then(res => {
                setData(res.data[0]?.sort((a, b) => (a.year - b.year) || (a.week - b.week) || (a.day - b.day) || (a.section - b.section)))
            })
            .catch(err => {
                console.log(err)
            })
            .finally(()=>{
                setLoad(false)
            })
    }
    
    useEffect(() => {
        getStatistic()
    }, []);

    const countRed = (arr) => {
      return arr.filter(item => item.statistics.length===0 || item.statistics.find(f=>f.type==="DYNAMIC")?.isCome===false)?.length;
    }
    return (
        <Box
            sx={{
                mt: "25px",
                display:'grid',
                gridTemplateColumns:'0.4fr 1fr',
                gap: 2,
                '@media (max-width: 600px)': {
                    gridTemplateColumns: '1fr',
                }
            }}
        >
            <Card>
                <CardContent>
                    {allGradesForAttendance !== null ?
                        <>
                            <Typography sx={{fontSize: 18, textAlign: "start", fontWeight: "bold"}}
                                        color={mainColor}
                                        gutterBottom>
                                Attended : <span
                                style={{color: '#56cb5a'}}> {(allGradesForAttendance / gradeForAttendance).toFixed()}</span>
                            </Typography>
                           <Typography sx={{fontSize: 18, textAlign: "start", fontWeight: "bold"}}
                                        color={mainColor}
                                        gutterBottom>
                               Did not attend : <span
                                style={{color: '#ff0000'}}> {data && countRed(data)}</span>
                            </Typography>
                            <Typography sx={{fontSize: 18, textAlign: "start", fontWeight: "bold"}}
                                        color={mainColor}
                                        gutterBottom>
                                Score for attendance : <span style={{color: '#56cb5a'}}>{allGradesForAttendance}</span>
                            </Typography>
                        </> : ''}

                    <Typography sx={{fontSize: 18, textAlign: "start", fontWeight: "bold"}} color={mainColor}
                                gutterBottom>
                        Rating : <span style={{color: '#56cb5a'}}>{rating && parseFloat(rating.toFixed(3)) || 0}</span>
                    </Typography>
                    <Divider sx={{my: 2}}/>
                    <Typography sx={{fontSize: 18, textAlign: "end", fontWeight: "bold"}} color={mainColor}>
                        Total: <span style={{color: '#56cb5a'}}>{ parseFloat(((rating && rating || 0)+(allGradesForAttendance && allGradesForAttendance || 0))?.toFixed(3)) || 0}</span>
                    </Typography>
                </CardContent>
            </Card>
            <AttendanceChooseScore
                data={data}
                load={load}
            />
        </Box>
    );
};

export default InfoScoreAttendance;