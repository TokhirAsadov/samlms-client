import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {Card, CardContent} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import styled from "styled-components";
import {BASE_URL} from "../../utills/ServiceUrls";
import axios from "axios";
import PublicPdf from "../../utills/pdfFiles/PublicPdf";
import Box from "@mui/material/Box";

const PdfViewReference = () => {
    const {id} = useParams()
    const reference = {id}
    const [contentPdf, setContentPdf] = useState(null)
    const [load, setLoad] = useState(true)
    const valueQRcode = window.location.origin + '/file/services/reference/' + reference?.id;


    useEffect(() => {
        axios.get(BASE_URL + `/student/getDataForStudentReference2/${id}`)
            .then(res => {
                setContentPdf(res.data.obj)
                setLoad(false)
            })
            .catch(err => {
                console.log(err)
                setLoad(false)
            })
    }, []);

    return (
        <Container>
            <Card>
                <CardContent>
                    {!load ? (contentPdf &&
                            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                                <PublicPdf
                                    valueQRcode={valueQRcode}
                                    contentPdf={contentPdf}
                                />
                            </Box>
                        )
                        :
                        (
                            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                                <CircularProgress/>
                            </Box>
                        )
                    }
                </CardContent>
            </Card>
        </Container>

    );
};
const Container = styled.div`
    width: 100%;
    padding: 1rem;
`
export default PdfViewReference;