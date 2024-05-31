import React, {useCallback, useEffect, useState} from 'react';
import styled from "styled-components";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import axios from "axios";
import moment from "moment/moment";
import {Card, CardContent, TextField} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";

const Deans = () => {
    const columns = [
        {
            field: 'count',
            headerName: '№',
            width: 40,
            sortable: true,
            editable: false,
        },
        {
            field: 'passage',
            headerName: 'Action',
            width: 400,
            editable: false,
            renderCell: (cellValues) => {
                return (
                    <p>{cellValues.row.passage}</p>
                );
            }
        },
        {
            field: 'updatedAt',
            headerName: 'Action date',
            width: 200,
            editable: false,
            sortable: true,
            renderCell: (cellValues) => {
                return (
                    <p>{moment(cellValues.row?.updatedAt).format('DD.MM.YYYY HH:mm')}</p>
                );
            }
        },
    ];
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState([]);
    const [deanAll, setDeanAll] = useState([]);
    const [selectedDean, setSelectedDean] = useState('')
    const {headers} = getHeaders()

    const fetchDataDeans = useCallback(() => {
        axios
            .get(BASE_URL + '/dekanat/all', {headers})
            .then((res) => {

                setDeanAll(res.data.obj.map(item => {
                    return item?.owner
                }));
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const fetchDataDeansByCreatorId = useCallback((id) => {
        axios.get(BASE_URL + `/dataOfLastActive/findByCreatorId/${id}`, {headers})
            .then(res => {
                console.log(res.data);
                setData(res?.data.obj.map((item, i) => ({
                    ...item,
                    count: i + 1
                })));

            })
            .catch(err => console.log(err))
            .finally(() => setSpinner(false));
    }, [selectedDean]);

    const fetchData = useCallback(() => {
        axios.get(BASE_URL + '/dataOfLastActive/findAll', {headers})
            .then(res => {
                setData(res?.data.obj.map((item, i) => ({
                    ...item,
                    count: i + 1
                })));

            })
            .catch(err => console.log(err))
            .finally(() => setSpinner(false));
    }, []);

    useEffect(() => {
        fetchDataDeans()
    }, [])


    useEffect(() => {

        setSpinner(() => true);
        if (selectedDean === "") {
            fetchData();
        } else {
            selectedDean && fetchDataDeansByCreatorId(selectedDean)
        }
    }, [selectedDean])


    return (
        <Container>


            <Card>
                <CardContent>
                    <TextField
                        sx={{
                            width: 300,
                            mb: 2,
                        }}
                        id="outlined-select-currency"
                        select
                        label="Deans"
                        value={selectedDean}
                        onChange={(e) => setSelectedDean(e.target.value)}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {deanAll && deanAll.map((option) => (
                            <MenuItem key={option?.id} value={option?.id}>
                                {option?.fullName}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: '1fr ',
                            gap: 5,
                        }}
                    >
                        <DataGrid
                            style={{width: "100%"}}
                            columns={columns}
                            rows={data || []}
                            loading={spinner}
                            components={{Toolbar: GridToolbar}}
                            autoHeight
                            pageSize={20}
                            rowsPerPageOptions={[20, 30, 50]}
                        />

                    </Box>

                </CardContent>
            </Card>
        </Container>
    );
};


const Container = styled.div`
    width: 100%;
    padding: 1rem;
`;

export default Deans;
