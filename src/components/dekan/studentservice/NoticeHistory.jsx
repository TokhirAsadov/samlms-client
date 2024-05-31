import React, {memo, useEffect, useState} from 'react';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {useNavigate} from "react-router-dom";
import {BsArrowLeft} from "react-icons/bs";
import {Card, CardContent} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import axios from "axios";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import PdfNotice from "../../../utills/pdfFiles/PdfNotice";
import styled from "styled-components";
import FilterNoticeHistoryGroups from "./FilterNoticeHistoryGroups";

const NoticeHistory = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const columns = [
        {
            field: 'studentQueue',
            headerName: 'Document number',
            sortable: true,
            width: 150,
            align: 'center',
            justifyContent: 'center',
        },
        {
            minWidth: 300,
            flex: 1,
            field: 'fullName',
            headerName: 'Full name',
            sortable: true,
            align: 'center',
            justifyContent: 'center'
        },
        {
            minWidth: 80,
            flex: 0.2,
            field: 'level',
            headerName: 'Course',
            sortable: true,
            align: 'center',
            justifyContent: 'center'
        },     {
            minWidth: 100,
            flex: 0.5,
            field: 'groupName',
            headerName: 'Group',
            sortable: true,
            align: 'center',
            justifyContent: 'center'
        },
        {
            flex: 0.3,
            field: 'file',
            headerName: 'File',
            sortable: true,
            align: 'center',
            renderCell: (cellValue) => {
                const noticeData = {
                    dynamicSection:cellValue.row?.dynamicSection,
                    studentQueue:cellValue.row?.studentQueue,
                    updateAt: cellValue.row?.createdAt,
                    educationYear:cellValue.row?.educationYear,
                    fromDate:cellValue.row?.fromDate,
                    toDate:cellValue.row?.toDate,
                }
                const studentData = {
                    fullName:cellValue.row?.fullName,
                    groupData:{
                        facultyName:cellValue.row?.direction,
                        level:cellValue.row?.level,
                        name:cellValue.row?.groupName,
                    }
                }
                return <PdfNotice noticeData={noticeData} studentData={studentData}/>
            }
        }
    ]
    const {headers} = getHeaders()
    const [data, setData] = useState([])
    const [filteredGroups, setFilteredGroups] = useState([]);

    const getData = () => {
        setIsLoading(true)
        axios.get(BASE_URL + '/notificationOuter/getAllCounters', {headers})
            .then(res => {
                console.log(res.data)
                setData(res.data.obj?.sort((a, b) => {
                    if (a?.studentQueue < b?.studentQueue) return -1;
                    else if (a?.studentQueue > b?.studentQueue) return 1;
                    return 0;
                })?.map(item=>({...item,studentQueue:item?.studentQueue?.toString().padStart(6,'0') })))
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }
    useEffect(() => {
        getData()
    }, []);

    const chooseData=(fData,oData)=>{
        if (fData.length===0) return oData;
        return fData
    }

    return (
        <Container>
            <Box mt={3} display={'flex'} justifyContent={'end'} gap={5}>
                <Button variant={'outlined'} startIcon={<BsArrowLeft/>} onClick={() => navigate(-1)}>
                    back
                </Button>
            </Box>
            <Card sx={{mt: 2}}>
                <CardContent>
                   <FilterNoticeHistoryGroups data={data}  setFilteredGroups={setFilteredGroups}/>
                    <DataGrid
                        components={{Toolbar: GridToolbar}}
                        loading={isLoading}
                        columns={columns}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 30 } },
                        }}
                        rowsPerPageOptions={[ 30, 50, 70, 100]}
                        rows={chooseData(filteredGroups,data) || []}
                        autoHeight
                    />
                </CardContent>
            </Card>
        </Container>
    );
};
const Container=styled.div`
    width: 100%;
    .MuiDataGrid-columnHeaderTitleContainer {
        justify-content: center;
    }
`
export default memo(NoticeHistory);