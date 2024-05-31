import React, {memo, useEffect, useState} from 'react';
import axios from "axios";
import {BASE_URL} from "../../../utills/ServiceUrls";
import PdfFile from "./PdfFile";
import styled from "styled-components";

function PdfNewChange({id}) {
    const [contentPdf, setContentPdf] = useState(null)
    useEffect(() => {
        axios.get(BASE_URL + `/student/getDataForStudentReference2/${id}`)
            .then(res => {
                console.log(res, "----reference info-----")
                setContentPdf(res.data.obj)
            })
            .catch(err => {
                console.log(err)
            })
    }, []);

    return (
        <Container>

            {contentPdf && <PdfFile contentPdf={contentPdf}/>}
        </Container>

    );
}

const Container = styled.div`

`
export default memo(PdfNewChange);