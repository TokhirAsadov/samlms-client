import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import {AiOutlineUnorderedList} from "react-icons/ai";
import {Card, CardContent} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import axios from "axios";

function ArxivStudentsForRektor() {

    const columns = [
        {
            field: 'count',
            headerName: '№',
            width: 40,
            align: 'center',
            editable: false
        },
        {
            field: 'fullName',
            headerName: 'Full Name',
            flex: 1,
            minWidth: 400,
            align: 'left',
            editable: false,
        },
        {
            field: 'groupName',
            headerName: 'Group',
            flex: 0.5,
            minWidth: 100,
            align: 'center',
            editable: false,
        },
        {
            field: 'passport',
            headerName: 'Passport',
            flex: 0.7,
            minWidth: 120,
            align: 'center',
            editable: false
        },
        {
            field: 'login',
            headerName: 'Login',
            flex: 0.7,
            minWidth: 120,
            align: 'center',
            editable: false
        },
        {
            field: 'rfid',
            headerName: 'RFID',
            flex: 0.7,
            minWidth: 120,
            align: 'center',
            editable: false
        },
        {
            field: 'rektororder',
            headerName: 'Rektors order',
            flex: 0.8,
            minWidth: 150,
            align: 'center',
            editable: false
        },
        {
            field: 'teachStatus',
            headerName: 'Status',
            flex: 1,
            minWidth: 200,
            align: 'center',
            editable: false,
        },

    ];
    const [data, setData] = useState([]);

    useEffect(() => {

        axios.get(BASE_URL + '/student/getStudentDataForTeachStatusAll')
            .then(res => {
                console.log(res.data)
                setData(res.data?.map((item, index) => ({...item, count: index + 1})))
            })
            .catch(err => {
                console.log(err)
            })


    }, []);


    return (
        <Container>
            <Title>
                <AiOutlineUnorderedList/> Archive
            </Title>
            <Card sx={{mt: 3}}>
                <CardContent>
                    <DataGrid
                        columns={columns}
                        rows={data}
                        components={{Toolbar: GridToolbar}}/*** print and excel ****/
                        autoHeight
                        pageSize={20}
                        initialState={{
                            columns: {
                                columnVisibilityModel: {
                                    cardNo: false,
                                    login: false,
                                    email: false,
                                    passport: false,
                                    rektororder: false,
                                    rfid: false,
                                },
                            },
                        }}
                    />
                </CardContent>
            </Card>
        </Container>
    );
}

const Title = styled.div`
    font-weight: bold;
    font-size: 25px;
    color: ${mainColor};
`
const Container = styled.div`
    width: 100%;
    padding: 1rem;

    .MuiDataGrid-columnHeaderTitleContainer {
        justify-content: center;
    }
`
export default ArxivStudentsForRektor;