import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import {Card, CardContent} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {useNavigate} from "react-router-dom";
import PdfContract from "../../../utills/pdfFiles/PdfContract";
import PdfReceipt from "../../../utills/pdfFiles/PdfReceipt";
import {useSelector} from "react-redux";
import axios from "axios";

const FailStudentDetailed = () => {
    const userId = useSelector(state => state.user?.user?.id)
    const passportNum = useSelector(state => state.student.student?.passportNum)

    const columns = [
        {
            field: 'count',
            headerName: '№',
            sortable: true,
            width: 50,
            align: 'center',
            justifyContent: 'center',
        },
        {
            minWidth: 90,
            flex: 0.4,
            field: 'year',
            headerName: 'Year',
            sortable: true,
            align: 'center',
            justifyContent: 'center'
        },
        {
            minWidth: 90,
            flex: 0.3,
            field: 'semester',
            headerName: 'Semester',
            sortable: true,
            align: 'center',
        },
        {
            minWidth: 150,
            flex: 1,
            field: 'subject',
            headerName: 'Subject',
            editable: false,
            sortable: false,
            align: 'center',
        },
        {
            minWidth: 70,
            flex: 0.2,
            field: 'credit',
            headerName: 'Credit',
            editable: false,
            sortable: false,
            align: 'center',
        },
        {
            minWidth: 100,
            flex: 0.4,
            field: 'currents',
            headerName: 'Score',
            editable: false,
            sortable: false,
            align: 'center',
        },
        {
            minWidth: 100,
            flex: 0.4,
            field: 'finals',
            headerName: 'Final Score',
            editable: false,
            sortable: false,
            align: 'center',
        },
        {
            minWidth: 100,
            flex: 0.4,
            field: 'totals',
            headerName: 'Total Score',
            editable: false,
            sortable: false,
            align: 'center',
        },
        {
            minWidth: 100,
            flex: 0.5,
            field: 'penalty',
            headerName: 'Penalty',
            editable: false,
            sortable: false,
            align: 'center',
        },
        {
            minWidth: 100,
            flex: 0.5,
            field: 'retakeN',
            headerName: 'Contract',
            editable: false,
            sortable: false,
            align: 'center',
        },
        {
            minWidth: 100,
            flex: 0.5,
            field: 'retakeData',
            headerName: 'Contract Date',
            editable: false,
            sortable: false,
            align: 'center',
        },
        {
            minWidth: 100,
            flex: 0.5,
            field: 'note',
            headerName: 'Note',
            editable: false,
            sortable: false,
            align: 'center',
        },
        {
            minWidth: 100,
            flex: 0.4,
            field: 'receipt',
            headerName: 'Receipt',
            editable: false,
            sortable: false,
            align: 'center',
            renderCell: (cellValue) => {
                const penaltyIf = cellValue.row.penalty?.substring(0, 1)
                const penalty = cellValue.row.penalty
                const subject = cellValue.row.subject
                const studentId = cellValue.row.studentId
                return (
                    <>
                        {penaltyIf == '6' ? <PdfReceipt studentId={studentId} subject={subject}/> :
                            <PdfContract  subject={subject} idCard={studentId} penalty={penalty} passportNum={passportNum}/>}
                    </>
                )
            }
        },
    ];
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    function getRetake(id) {
        axios.get(BASE_URL + `/otherService/studentsFails/${id}`)
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
        setIsLoading(true)
        getRetake(userId)

    }, []);


    return (
        <Container>
            <Title>
                <h1>Retake</h1>
            </Title>

            <Card>
                <CardContent>
                    <DataGrid
                        loading={isLoading}
                        components={{Toolbar: GridToolbar}}
                        columns={columns}
                        rows={data}
                        pageSize={30}
                        className="data-grid-container"
                        rowsPerPageOptions={[30, 60, 100]}
                        autoHeight
                        initialState={{ // hide items
                            columns: {
                                columnVisibilityModel: {
                                    currents: false,
                                    finals: false,
                                    note: false,
                                    retakeN: false,
                                    retakeData: false,
                                },
                            },
                        }}
                    />
                </CardContent>
            </Card>

        </Container>
    );
};
const Title = styled.div`
  display: flex;
  align-items: center;
  color: #ff4444;
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
export default FailStudentDetailed;