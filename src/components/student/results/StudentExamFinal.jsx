import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {FaClipboardList} from "react-icons/fa";
import {Card, CardContent} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {BASE_URL, mainColor} from "../../../utills/ServiceUrls";
import {useSelector} from "react-redux";
import axios from "axios";

const StudentExamFinal = () => {
    const userId = useSelector(state => state.user?.user?.id)
    const columns = [
        {
            field: 'count',
            headerName: '№',
            sortable: true,
            width: 50,
            align: 'center',
        },
        {
            minWidth: 200,
            flex: 1,
            field: 'subject',
            headerName: 'Subject',
            sortable: true,
            align: 'center',
        },
        {
            minWidth: 80,
            flex: 0.3,
            field: 'forms',
            headerName: 'Form',
            sortable: true,
            align: 'center',
        },
        {
            minWidth: 80,
            flex: 0.3,
            field: 'datas',
            headerName: 'Date',
            sortable: true,
            align: 'center',
        },
        {
            minWidth: 100,
            flex: 0.4,
            field: 'times',
            headerName: 'Time',
            editable: false,
            sortable: false,
            align: 'center',
        },
     {
            minWidth: 100,
            flex: 0.4,
            field: 'rooms',
            headerName: 'Room',
            editable: false,
            sortable: false,
            align: 'center',
        },
    ];
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    const getFinalData =(id)=>{
        setIsLoading(true)
        axios.get(BASE_URL + `/otherService/studentsFinals/${id}`)
            .then(res => {
                const resData = res.data.obj?.obj?.map((row, index) => ({
                    ...row,
                    count: index + 1,
                }));
                setData(resData)

            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    useEffect(() => {
        getFinalData(userId)
    }, []);





    return (
        <Container>
            <Title>
                <FaClipboardList size={25}/>
                <h1>Finals</h1>
            </Title>
            <Card>
                <CardContent>
                    <DataGrid
                        loading={isLoading}
                        components={{Toolbar: GridToolbar}}
                        columns={columns}
                        rows={data || []}
                        pageSize={30}
                        className="data-grid-container"
                        rowsPerPageOptions={[30, 60, 100]}
                        autoHeight
                    />
                </CardContent>
            </Card>
        </Container>
    );
};

const Title = styled.div`
  display: flex;
  align-items: center;
  color: ${mainColor};
  gap: 5px;

  h1 {
    margin: 0;
    font-size: 30px;
    font-weight: bold;

  }
`
const Container = styled.div`
  width: 100%;
  padding: 1rem;
  .MuiDataGrid-columnHeaderTitleContainer {
    justify-content: center;
  }
`

export default StudentExamFinal;