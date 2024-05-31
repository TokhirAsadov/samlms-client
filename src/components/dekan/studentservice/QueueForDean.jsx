import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {Card, CardContent, TextField} from "@mui/material";
import moment from "moment/moment";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import axios from "axios";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import MenuItem from "@mui/material/MenuItem";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import Typography from "@mui/material/Typography";

const QueueForDean = () => {
    const isDeanExternal = useSelector(state => state.dekanat.dekanat?.name) === "Sirtqi ta'lim"
    const queueStatusEnum = ["RUNNABLE", "CALLED", " RUNNING", "WAITING", "CANCELLED", "COMPLETED"]
    const columns = [
        {
            field: 'number',
            headerName: '№',
            sortable: true,
            width: 50,
            align: 'center',
            justifyContent: 'center',
        },
        {
            minWidth: 100,
            flex: 1,
            field: 'fullName',
            headerName: 'Full name',
            sortable: true,
            align: 'center',
            justifyContent: 'center',
            renderCell: (cellValue) => (
                <p>{cellValue.row?.studentData?.fullName}</p>
            )
        },
        {
            minWidth: 100,
            flex: 0.5,
            field: 'date',
            headerName: 'Date of creation',
            sortable: true,
            align: 'center',
            justifyContent: 'center',
            renderCell: (cellValue) => (
                <p>{moment(cellValue.row?.createdAt).format('DD.MM.YYYY HH:mm')}</p>
            )
        },
        {
            minWidth: 100,
            flex: 0.5,
            field: 'status',
            headerName: 'Status',
            sortable: true,
            align: 'center',
            justifyContent: 'center'
        },
        {
            minWidth: 150,
            flex: 0.5,
            field: 'action',
            headerName: 'Action',
            sortable: false,
            align: 'center',
            justifyContent: 'center',
            renderCell: (cellValue) => (
                <TextField
                    select
                    size="small"
                    defaultValue={cellValue.row?.status}
                    onChange={e => upDateStatusData(e.target.value, cellValue.row.id)}
                    sx={{
                        width: 200,
                    }}
                >
                    {queueStatusEnum.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
            )
        },
    ]
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const {headers} = getHeaders()


    function upDateStatusData(val, id) {
        const body = {
            id,
            statusEnum: val
        }
        axios.put(BASE_URL + '/queue/changeQueue', body, {headers})
            .then(response => {
                console.log(response)
                getQueueAllForDean()
                toast.success(val)
            })
            .catch(error => {
                console.log(error)
                toast.error('Error status')
            })
    }

    const getQueueAllForDean = () => {
        setIsLoading(true)
        axios.get(BASE_URL + `/queue/findAllQueuesOfTodayForDean`, {headers})
            .then(res => {
                console.log(res.data.obj)
                setData(res.data.obj.sort((a, b) => {
                    if (a.number > b.number) return 1;
                    else if (a.number < b.number) return -1;
                    return 0;
                }))
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }
    useEffect(() => {
        getQueueAllForDean()
    }, []);
    return (
        <Container>
            {isDeanExternal ? (
                <Card sx={{mt: 3}}>
                    <CardContent>
                        <DataGrid
                            columns={columns}
                            rows={data || []}
                            loading={isLoading}
                            components={{Toolbar: GridToolbar}}
                            rowsPerPageOptions={[10, 30, 50, 70, 100]}
                            autoHeight
                            initialState={{ // hide items
                                columns: {
                                    columnVisibilityModel: {
                                        action: false,
                                    },
                                },
                            }}
                        />
                    </CardContent>
                </Card>
            ) : (
                <Card sx={{mt: 3}}>
                    <CardContent>
                        <Typography textAlign={'center'} fontWeight={'bold'} color={'error'} fontSize={25}>For external
                            education only !</Typography>
                    </CardContent>
                </Card>
            )}
        </Container>
    );
};

const Container = styled.div`
    width: 100%;

    .MuiDataGrid-columnHeaderTitleContainer {
        justify-content: center;
    }
`
export default QueueForDean;