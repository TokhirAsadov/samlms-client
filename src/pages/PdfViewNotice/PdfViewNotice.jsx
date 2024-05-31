import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import axios from "axios";
import {BASE_URL} from "../../utills/ServiceUrls";
import styled from "styled-components";
import NoticeForStudent from "../../components/student/student_service/NoticeForStudent";
import {Card, CardContent} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const PdfViewNotice = () => {
    const {id} = useParams()
    const [noticeData, setNoticeData] = useState([])
    const [studentData, setStudentData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const getStudentData = () => {
        axios.get(BASE_URL + `/user/studentAllData/${id}`)
            .then(res => {
                setStudentData(res.data);
                console.log(res.data, 'student data')
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }
    const getNoticeForStudent = () => {
        axios.get(BASE_URL + `/notificationOuter/getStudentOuterNotifications/${id}`)
            .then(res => {
                setNoticeData(res.data.obj.map((item, index) => ({...item, count: index + 1})));
                console.log(res.data, 'noticeeee')
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }
    useEffect(() => {
        setIsLoading(true)
        if (id) {
            getStudentData()
            getNoticeForStudent()
        }

    }, []);
    return (
        <Container>
            {isLoading ? (
                <Card>
                    <CardContent>
                        <Box sx={{display: 'flex', justifyContent: 'center'}}>
                            <CircularProgress/>
                        </Box>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <h4 style={{textAlign:'center'}}>{studentData?.fullName}</h4>
                    {noticeData.length > 0 ? <NoticeForStudent data={noticeData} studentData={studentData}/> : <Card>
                        <CardContent>
                            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                                <Typography fontWeight={'bold'} fontSize={20} >No Data</Typography>
                            </Box>
                        </CardContent>
                    </Card> }
                </>
            )}
        </Container>
    );
};
const Container = styled.div`
  width: 100%;
  padding: 1rem;

  h2 {
    color: #000;
    text-align: center;
  }
`

export default PdfViewNotice;