import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {STUDENT_UPLOAD_EXAMPLE} from "../../../utills/fileBase64";
import ButtonFile from "./ButtonFile";
import {BASE_URL, mainColor} from "../../../utills/ServiceUrls";
import axios from "axios";

const AddStudents = () => {
    const saveFileUrl = '/student/uploadStudent'
    const exampleFile = STUDENT_UPLOAD_EXAMPLE;
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState([])
    const getHistoryUploadFile = () => {
        setIsLoading(true)
        axios.get(BASE_URL + '/getHistoryUploadFile')
            .then(res => {
                console.log(res.data)
                setData([])
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }
    useEffect(() => {
        getHistoryUploadFile()
    }, []);
    return (
        <Container>
            <ButtonFile getHistoryUploadFile={getHistoryUploadFile} saveFileUrl={saveFileUrl} urlBase={exampleFile}/>
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
    padding: 1rem;

    .MuiDataGrid-columnHeaderTitleContainer {
        justify-content: center;
    }
`;
export default AddStudents;