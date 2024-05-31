import React from 'react';
import {Card, CardContent} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import moment from "moment";
import IconButton from "@mui/material/IconButton";
import {BsPencilSquare} from "react-icons/bs";
import {MdDelete} from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import {toast} from "react-toastify";

const NoticeDataGrid = ({data, isLoading, setPutData, setModalCreate,getNoticeFOrDean}) => {
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
            minWidth: 100,
            flex: 0.4,
            field: 'educationYear',
            headerName: 'Year',
            sortable: true,
            align: 'center',
            justifyContent: 'center'
        },
        {
            minWidth: 100,
            flex: 0.5,
            field: 'dekanat',
            headerName: 'Dean',
            sortable: true,
            align: 'center',
            justifyContent: 'center'
        },
        {
            minWidth: 80,
            flex: 0.3,
            field: 'course',
            headerName: 'Course',
            sortable: true,
            align: 'center',
            justifyContent: 'center'
        },
        {
            minWidth: 100,
            flex: 0.5,
            field: 'fromDate',
            headerName: 'From date',
            sortable: true,
            align: 'center',
            justifyContent: 'center',
            renderCell: (cellValue) => {
                return <p>{moment(cellValue.row.fromDate).format('DD.MM.YYYY')}</p>
            }
        },
        {
            minWidth: 100,
            flex: 0.5,
            field: 'toDate',
            headerName: 'To date',
            sortable: true,
            align: 'center',
            justifyContent: 'center',
            renderCell: (cellValue) => {
                return <p>{moment(cellValue.row.toDate).format('DD.MM.YYYY')}</p>
            }
        },
        {
            minWidth: 100,
            flex: 0.5,
            field: 'facultyNames',
            headerName: 'Faculty names',
            sortable: true,
            align: 'center',
            justifyContent: 'center'
        },
        {
            minWidth: 100,
            flex: 0.5,
            field: 'groupNames',
            headerName: 'Group names',
            sortable: true,
            align: 'center',
            justifyContent: 'center'
        },
        {
            minWidth: 100,
            flex: 0.5,
            field: 'action',
            headerName: 'Action',
            sortable: false,
            align: 'center',
            justifyContent: 'center',
            renderCell: (cellValue) => {
                return <>
                    <IconButton
                        onClick={() => handleUpdate(cellValue.row)}
                    >
                        <BsPencilSquare size={20} color={'green'}/>
                    </IconButton>
                    <Tooltip title={'Delete'} arrow>
                        <IconButton
                            onClick={() => handleDelete(cellValue.row?.id)}
                        >
                            <MdDelete size={20} color={'red'}/>
                        </IconButton>
                    </Tooltip>
                </>
            }
        },
    ]

    const handleUpdate = (data) => {
        setPutData(data)
        setModalCreate(true)
    }
    const handleDelete = (id) => {
        axios.delete(`${BASE_URL}/notificationOuter/deleteNO/${id}`,getHeaders())
            .then(response => {
                console.log(response.data)
                toast.warning(response.data.message || 'Deleted')
                getNoticeFOrDean()
            })
            .catch(err => {
                console.log(err.response.data.message)
                toast.error(err.response.data.message || 'Error')
            })
    }
    return (
        <Card sx={{mt: 2}}>
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
    );
};

export default NoticeDataGrid;