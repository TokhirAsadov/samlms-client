import React, {useEffect, useState} from 'react';
import {CardContent, Stack} from "@mui/material";
import Box from "@mui/material/Box";
import {DataGrid} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import {useSelector} from "react-redux";
import moment from "moment";
import axios from "axios";
import {toast} from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";

const NewStudentService = () => {
    const user = useSelector(state => state?.user?.user)
    const {headers} = getHeaders();
    const [references,setReferences] = useState([]);
    const [loading, setLoading] = useState(false)
    const columns = [
        {
            field: 'count',
            headerName: '№',
            sortable: false,
            width: 50,
            align: 'center',
        },
        {
            flex: 1,
            minWidth:220,
            field: 'fullName',
            headerName: 'Full name',
            sortable: true,
            valueGetter: (params) =>
                `${params.row.user.firstName || ''} ${params.row.user.lastName || ''}`,
        },
        {
            flex: 1,
            minWidth:130,
            field: 'type',
            headerName: 'Type ',
            sortable: false,
        },
        { flex: 1,
            minWidth:220,
            field: 'description',
            headerName: 'Description',
            sortable: false,
        },
        {
            flex: 1,
            minWidth:150,
            field: 'createdAt',
            headerName: 'Date',
            sortable: true,
            valueGetter:(params) => `${moment(params.row.createdAt).format("DD:MM:YYYY HH:MM")}`
        },
        {
            flex: 1,
            minWidth:100,
            field: 'status',
            headerName: 'Status',
            sortable: false,
            align: 'center',
            renderCell: (props) => {
                const {row} = props

                return <Button
                    size="small"
                    sx={{cursor: 'default !important'}}
                    color={row.status === "AT_PROCESS" ? "primary" : row.status === "CONFIRM" ? "success" : "error"}
                >
                    {row.status === "AT_PROCESS" ? "AT_PROCESS" : row.status === "CONFIRM" ? "CONFIRM" : "REJECT"}
                </Button>


            }
        },
        {
            flex: 1,
            minWidth:200,
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            align: 'center',
            renderCell: (props) => {
                const {id, row} = props;
                return <Stack direction="row" justifyContent="center" spacing={3}>
                    <Button
                        disabled={loading}
                        variant={row.status === "CONFIRM" ? "contained" : "outlined" || "outlined"}
                            size="small" color="success"
                            onClick={() => fetchChangeStatus(id,"CONFIRM")}>
                        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} gap={'7px'}>
                            Confirm {loading && <CircularProgress size={22} />}
                        </Box>
                    </Button>
                    <Button
                        disabled={loading}
                        variant={row.status === "REJECT" ? "contained" : "outlined" || "outlined"}
                            size="small" color="error"
                            onClick={() => fetchChangeStatus(id,"REJECT")}>
                        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} gap={'7px'}>
                            Reject {loading && <CircularProgress size={22} />}
                        </Box>
                    </Button>
                </Stack>
            }
        },

    ];

    useEffect(()=>{
        const sse = new EventSource(BASE_URL + '/reference/stream?userId=' + user?.id+'&bool=true');
        sse.addEventListener("reference-list-event", (event) => {
            const data = JSON.parse(event.data);
            setReferences(data.map((row, index) => (row.status === "AT_PROCESS" && {
                ...row,
                count: index + 1,
            } )));
        });
        sse.onerror = () => {
            sse.close();
        };
        return () => {
            sse.close();
        };
    })


    const fetchChangeStatus = (id,status) => {
        setLoading(true)
      axios.put(`${BASE_URL}/reference/change`,{id,status},{headers})
        .then(res => {
            console.log(res)
            toast.success('Successfully')
        })
        .catch(err => {
            console.log(err)
            toast.error('Error')
        })
          .finally(()=>{
              setLoading(false)
          })
    }



    return (
        <>

                <CardContent>
                    <Box sx={{width: '100%'}}>

                        <DataGrid
                            rows={references}
                            columns={columns}
                            initialState={{
                                pagination: { paginationModel: { pageSize: 10 } },
                            }}
                            rowsPerPageOptions={[10, 30, 50, 70, 100]}
                            autoHeight
                            className="data-grid-container"
                        />
                    </Box>
                    <Box sx={{
                        m: '15px',
                        display: 'flex',
                        justifyContent: 'end',
                    }}>
                    </Box>
                </CardContent>

        </>
    );

};

export default NewStudentService;
