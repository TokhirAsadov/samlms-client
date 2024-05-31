import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import Button from "@mui/material/Button";
import DataGridCustomize from "../../../components/dataGridCustomize/DataGridCustomize";
import moment from "moment/moment";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import {BsPencilSquare} from "react-icons/bs";
import {FaTrash} from "react-icons/fa";
import axios from "axios";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import {useSelector} from "react-redux";
import ModalStatementData from "./ModalStatementData";
import {toast} from "react-toastify";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import PdfStatementData from "../../../utills/pdfFiles/PdfStatementData";

const StatementData = () => {
    const kafedraId = useSelector(state => state.section?.section?.id)
    const [optionYear, setOptionYear] = useState([]);
    const [eduYearValue, setEduYearValue] = useState('');
    const [load, setLoad] = useState(false)
    const [dataVedimost, setDataVedimost] = useState([])
    const [modalStatement, setModalStatement] = useState(false)
    const [dataForUpdate, setDataForUpdate] = useState(null)

    const getEducationYears = async () => {
        await axios.get(`${BASE_URL}/education/educationYearsForSelected`, getHeaders())
            .then(res => {
                setOptionYear(res?.data?.obj);
                setEduYearValue(res?.data?.obj[0]?.id);
            })
            .catch(err => {
                console.error(err);
            });
    };
    const getAllVedimostByKafedra = (eduId) => {
      if (!eduId) return;
        setLoad(true)
      axios.get(`${BASE_URL}/vedimost/getAllVedimostByKafedra/${kafedraId}?educationYearId=${eduId}`, getHeaders())
            .then(res => {
                console.log(res.data)
                setDataVedimost(res.data.obj.map((i, index) => ({...i, count: index + 1})))
                setLoad(false)
            })
            .catch(err => {
                console.log(err)
                setDataVedimost([])
                setLoad(false)
            })

    }
    useEffect(() => {
        getEducationYears()
    }, []);
    useEffect(() => {
        getAllVedimostByKafedra(eduYearValue)
    }, [eduYearValue]);
    const handleChange = (data) => {
        setDataForUpdate(data)
        setModalStatement(true)
    }
    const handleDelete = (id) => {
        axios.delete(`${BASE_URL}/vedimost/deleteVedimost/${id}`, getHeaders())
            .then(res => {
                getAllVedimostByKafedra(eduYearValue)
                console.log(res.data)
                toast.warning(res.data.message || 'Deleted')
            })
            .catch(err => {
                {
                    console.log(err)
                    toast.error(err.response.data.message || 'Error')
                }
            })
    }
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
            flex: 1,
            field: 'teacher',
            headerName: 'Teacher',
            sortable: true,
            align: 'center',
            justifyContent: 'center'
        },
        {
            minWidth: 100,
            flex: 0.8,
            field: 'lesson',
            headerName: 'Subject',
            sortable: true,
            align: 'center',
            justifyContent: 'center',
        },
        {
            minWidth: 100,
            flex: 0.8,
            field: 'groupName',
            headerName: 'Group',
            sortable: true,
            align: 'center',
        },
        {
            minWidth: 100,
            flex: 0.8,
            field: 'condition',
            headerName: 'Condition',
            sortable: true,
            align: 'center',
        },
        {
            minWidth: 100,
            flex: 0.8,
            field: 'deadline',
            headerName: 'Deadline',
            sortable: true,
            align: 'center',
            renderCell: (cellValue) => moment(cellValue.row.deadline).format('DD.MM.YYYY HH:mm')
        },
        {
            minWidth: 100,
            flex: 0.8,
            field: 'timeClose',
            headerName: 'Time close',
            sortable: true,
            align: 'center',
            renderCell: (cellValue) => cellValue.row.timeClose ? moment(cellValue.row.timeClose).format('DD.MM.YYYY HH:mm') : ''
        },
        {
            minWidth: 100,
            flex: 0.5,
            field: 'file',
            headerName: 'File',
            sortable: true,
            align: 'center',
            renderCell: (cellValue) => <PdfStatementData
                educationYear={optionYear.find(i=>i.id==eduYearValue)?.name}
                vedimostId={cellValue.row?.id}
                condition={cellValue.row?.condition}
                dataOfLeaders={{
                    headOfDepartment: cellValue.row?.headOfDepartment,
                    courseLeader: cellValue.row?.courseLeader,
                    headOfAcademicAffair:cellValue.row?.headOfAcademicAffair,
                    direction: cellValue.row?.direction
                }}
            />
        },
        {
            minWidth: 100,
            flex: 0.4,
            field: 'action',
            headerName: 'Action',
            sortable: true,
            align: 'center',
            renderCell: (cellValue) => (
                <Box display={"flex"} gap={3}>
                    <IconButton
                        onClick={() => handleChange(cellValue.row)}
                    >
                        <BsPencilSquare size={20} color={'green'}/>
                    </IconButton>
                    <IconButton
                        onClick={() => handleDelete(cellValue.row.id)}
                    >
                        <FaTrash size={20} color={'red'}/>
                    </IconButton>
                </Box>
            )
        },

    ];

    return (
        <Container>
            <Box sx={{display: 'flex', justifyContent: 'space-between', gap: 3, mb: 2}}>
                <FormControl sx={{width: 300}}>
                    <InputLabel id="demo-simple-select-label6">Academic year</InputLabel>
                    <Select
                        size={'small'}
                        labelId="demo-simple-select-label6"
                        id="demo-simple-select"
                        label="Academic year"
                        value={eduYearValue}
                        onChange={e => setEduYearValue(e.target.value)}
                    >
                        <MenuItem value={'All'}>All</MenuItem>
                        {optionYear?.map((item, index) => (
                            <MenuItem key={index} value={item?.id}>{item?.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button onClick={() => setModalStatement(true)} variant={'contained'} color={'success'}>
                    create
                </Button>
                {modalStatement && <ModalStatementData
                    open={modalStatement}
                    setOpen={setModalStatement}
                    setDataForUpdate={setDataForUpdate}
                    dataForUpdate={dataForUpdate}
                    getData={getAllVedimostByKafedra}
                />}
            </Box>
            <DataGridCustomize
                columns={columns}
                rows={dataVedimost}
                loading={load}
                hiddenItem={{
                    action:false
                }}
            />

        </Container>
    );
};
const Container = styled.div`
    width: 100%;
    padding: 1rem;`;
export default StatementData;