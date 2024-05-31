import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import {AiOutlineUnorderedList} from "react-icons/ai";
import {Card, CardContent} from "@mui/material";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import axios from "axios";
import {useSelector} from "react-redux";
import InputLabel from "@mui/material/InputLabel";
import {toast} from "react-toastify";
import Button from "@mui/material/Button";
import {BiArrowBack} from "react-icons/bi";
import {useNavigate} from "react-router-dom";
import {extrasmall} from "../../../responsiv";

function ArchiverForDean() {
    const statusEdu = ['FINISHED', 'ACADEMIC_VACATION', 'EXPELLED_FROM_UNIVERSITY', 'ACADEMIC_DEBTOR', 'TRANSFER',]
    const statusEduForChange = ['TEACHING', 'FINISHED', 'ACADEMIC_VACATION', 'EXPELLED_FROM_UNIVERSITY', 'ACADEMIC_DEBTOR', 'TRANSFER',]
    const {headers} = getHeaders();
    const columns = [
        {
            field: 'count',
            headerName: '№',
            width: 40,
            editable: false,
            justifyContent: 'center',
            align:'center',
        },
        {
            field: 'fullName',
            headerName: 'Full Name',
            flex:1,
            minWidth: 400,
            editable: false,
        },
        {
            field: 'groupName',
            headerName: 'Group',
            flex:1,
            minWidth: 100,
            editable: false,
            justifyContent: 'center',
            align:'center',
        },
        {
            field: 'passport',
            headerName: 'Passport',
            flex:1,
            minWidth: 150,
            justifyContent: 'center',
            align:'center',
            editable: false
        },
        {
            field: 'login',
            headerName: 'Login',
            flex:0.8,
            minWidth: 80,
            justifyContent: 'center',
            align:'center',
            editable: false
        },
        {
            field: 'rfid',
            headerName: 'RFID',
            flex:0.8,
            minWidth: 140,
            justifyContent: 'center',
            align:'center',
            editable: false
        },
        {
            field: 'rektororder',
            headerName: 'Rektors order',
            flex:1,
            minWidth: 150,
            justifyContent: 'center',
            align:'center',
            editable: false
        },
        {
            field: 'changeStatus',
            headerName: 'Change Status',
            flex:1,
            minWidth: 180,
            editable: false,
            justifyContent: 'center',
            align:'center',
            renderCell: (cellValues) => {
                console.log(cellValues)
                return (
                    <Box sx={{width: "180px"}}>
                        <FormControl fullWidth>
                            <Select
                                size="small"
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                onChange={(event) => handleChange4(event, cellValues)}
                            >
                                {statusEduForChange.map(name => (
                                    <MenuItem key={name} value={name}>{name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                );
            }
        },
        {
            field: 'teachStatus',
            headerName: 'Status',
            flex:1,
            minWidth: 180,
            justifyContent: 'center',
            align:'center',
            editable: false,
        },

    ];
    const deanFaculties = useSelector(state => state?.dekanat?.dekanat) || null;
    const [data, setData] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("")
    const [direction, setDirection] = useState("");
    const navigate = useNavigate()

    function fetchData() {
        if (direction === "" && selectedStatus === "") {
            axios.get(BASE_URL + `/student/getAllStudentDataForDean`, {headers})
                .then(res => {
                    setData(res.data?.map((item, index) => ({...item, count: index + 1})))
                })
                .catch(err => {
                    console.log(err)
                })
        } else if (direction !== "" && selectedStatus === "") {
            axios.get(BASE_URL + `/student/getStudentDataForTeachStatusAllByFacultyId?facultyId=${direction}`, {headers})
                .then(res => {
                    setData(res.data?.map((item, index) => ({...item, count: index + 1})))
                })
                .catch(err => {
                    console.log(err)
                })
        } else if (selectedStatus !== "" && direction !== "") {

            axios.get(BASE_URL + `/student/getStudentDataForTeachStatusAndFacultyId?teachStatus=${selectedStatus}&facultyId=${direction}`, {headers})
                .then(res => {
                    setData(res.data?.map((item, index) => ({...item, count: index + 1})))
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    useEffect(() => {
        fetchData()
    }, [selectedStatus, direction]);

    const handleChange4 = (event, editData) => {
        const statusName = event.target.value
        const {id} = editData
        console.log(id)
        axios.get(BASE_URL + `/student/changeTeachStatusOfStudent/${id}?teachStatus=${statusName}`)
            .then((response) => {
                fetchData()
                toast.success('Success change status')
            })
            .catch((error) => {
                console.log(error, "error change status")
                toast.error('Error change status')
            })

    };
    const handleChange1 = (event) => {
        setDirection(event.target.value);
    };
    const handleChange2 = (event) => {
        setSelectedStatus(event.target.value);
    };

    return (
        <Container>
            <TitleMain>
                <p>
                    <AiOutlineUnorderedList/> Archive
                </p>
                <Button onClick={() => navigate(-1)} variant="outlined" startIcon={<BiArrowBack/>}>
                    Back
                </Button>
            </TitleMain>


            <Box
                sx={{
                    mt: '15px',
                    display: 'flex',
                    gap: '20px',
                }}
            >
                <Box sx={{width: 150}}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Yo'nalish</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={direction}
                            label="Yo'nalish"
                            onChange={handleChange1}
                        >
                            <MenuItem value="">
                                <em>All</em>
                            </MenuItem>
                            {deanFaculties?.faculties?.map((item) => (
                                <MenuItem key={item?.id} value={item?.id}>{item?.shortName}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{width: 150}}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Status</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedStatus}
                            label="Status"
                            onChange={handleChange2}
                        >
                            <MenuItem value="">
                                <em>All</em>
                            </MenuItem>
                            {statusEdu.map((item) => (
                                <MenuItem key={item} value={item}>{item}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Box>

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
                                    id: false,
                                    cardNo: false,
                                    login: false,
                                    email: false,
                                    passport: false,
                                    rektororder: false,
                                    rfid: false,
                                    changeStatus: false,
                                },
                            },
                        }}
                    />
                </CardContent>
            </Card>
        </Container>
    );
}

const TitleMain = styled.h1`
    display: flex;
    align-items: center;
    justify-content: space-between;

    p {
        color: ${mainColor};
        font-size: 30px;
        font-weight: bold;
        ${extrasmall({
            textAlign: "center",
            fontSize: "20px",
        })}
    }
`;


const Container = styled.div`
    width: 100%;
    padding: 1rem;

    .MuiDataGrid-columnHeaderTitleContainer {
        justify-content: center;
    }
`
export default ArchiverForDean;