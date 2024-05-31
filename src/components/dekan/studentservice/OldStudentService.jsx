import React, {useEffect, useState} from 'react';
import {CardContent, Stack} from "@mui/material";
import Box from "@mui/material/Box";
import {DataGrid} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import moment from "moment/moment";
import axios from "axios";
import {BASE_URL} from "../../../utills/ServiceUrls";
import {useSelector} from "react-redux";
import {BsDownload} from "react-icons/bs";
import PdfNewChange from "../../student/student_service/PdfNewChange";

const OldStudentService = () => {

    const userId = useSelector(state => state.user.user.id)
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false)
    const columns = [
        {
            field: 'count',
            headerName: '№',
            sortable: true,
            width: 50,
            align: 'center',
        },
        {
            minWidth: 250,
            flex: 1,
            field: 'fullName',
            headerName: 'Full name',
            sortable: true,
            valueGetter: (params) =>
                `${params?.row?.user?.firstName || ''} ${params?.row?.user?.lastName || ''}`,
        },
        {
            minWidth: 130,
            flex: 1,
            field: 'type',
            headerName: 'Type ',
            sortable: false,
        },
        {
            minWidth: 250,
            flex: 1,
            field: 'description',
            headerName: 'Description',
            sortable: false,
        },
        {
            minWidth: 150,
            flex: 1,
            field: 'createdAt',
            headerName: 'Date',
            sortable: true,
            valueGetter: (params) => `${moment(params?.row?.createdAt).format("DD:MM:YYYY HH:MM")}`
        },
        {
            minWidth: 100,
            flex: 1,
            field: 'status',
            headerName: 'Status',
            sortable: false,
            align: 'center',
            renderCell: (props) => {
                const {row} = props
                return <Button
                    size="small"
                    sx={{cursor: 'default !important'}}
                    color={row?.status === "AT_PROCESS" ? "primary" : row?.status === "CONFIRM" ? "success" : "error"}
                >
                    {row?.status === "AT_PROCESS" ? "PENDING" : row?.status === "CONFIRM" ? "CONFIRM" : "REJECT"}
                </Button>
            }
        },

        {
            minWidth: 80,
            flex: 1,
            field: 'file',
            headerName: 'File',
            sortable: false,
            align: 'center',
            renderCell: (props) => {
                const {row} = props
                if (row?.status === "CONFIRM") {
                 return   <PdfNewChange id={row?.id} />
                } else {
                    return  <Stack direction="row" justifyContent="center" width={"100%"}>
                        <Button
                            disabled={row?.status !== "CONFIRM"}
                            variant="outlined" size="small"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "10px",
                                cursor: "not-allowed"
                            }}
                        >
                            <BsDownload/>
                        </Button>
                    </Stack>
                }

            }
        },

    ];

    useEffect(() => {
        setLoading(true)
        axios.get(BASE_URL + `/reference/getHistory?userId=${userId}`)
            .then(res => {
                const rowsWithCount = res.data.map((row, index) => ({
                    ...row,
                    count: index + 1,
                }));
                setRows(rowsWithCount)
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    return (

        <CardContent>
            <Box sx={{width: '100%'}}>
                <DataGrid
                    rows={rows || []}
                    columns={columns}
                    pageSize={5}
                    loading={loading}
                        className="data-grid-container"
                    autoHeight={true}
                />
            </Box>
        </CardContent>

    );
};

export default OldStudentService;
