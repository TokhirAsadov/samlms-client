import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import {useSelector} from "react-redux";
import moment from "moment";
import DataGridCustomize from "../../dataGridCustomize/DataGridCustomize";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import PdfStatementData from "../../../utills/pdfFiles/PdfStatementData";

const StatementDataDean = () => {

    const optionDirection = useSelector(state => state?.dekanat?.dekanat) || null;
    const [optionYear, setOptionYear] = useState([]);

    const [eduYearValue, setEduYearValue] = useState('');
    const [directionValue, setDirectionValue] = useState('')
    const [load, setLoad] = useState(false)
    const [dataVedimost, setDataVedimost] = useState([])

    const getEducationYears = async () => {
        await axios.get(`${BASE_URL}/education/educationYearsForSelected`, getHeaders())
            .then(res => {
                setOptionYear(res?.data?.obj);
                setEduYearValue(res?.data?.obj[0]?.id);
                setDirectionValue(optionDirection?.faculties[0]?.id)
            })
            .catch(err => {
                console.error(err);
            });
    };

    const getAllVedimostByDean = (eduId,facultyId) => {
        if (!eduId && !facultyId) return;
        setLoad(true)
        axios.get(`${BASE_URL}/vedimost/getVedimostByFacultyId/${facultyId}?educationYearId=${eduId}`, getHeaders())
            .then(res => {
                console.log(res.data)
                setDataVedimost(res.data.obj.map((i, index) => ({...i, count: index + 1})))
            })
            .catch(err => {
                console.log(err)
                setDataVedimost([])
            })
            .finally(() => {
                setLoad(false)
            })
    }
    useEffect(() => {
        getEducationYears()
    }, []);



    useEffect(() => {
        getAllVedimostByDean(eduYearValue,directionValue)
    }, [eduYearValue,directionValue]);

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

    ];

    return (
        <Container>
            <Box sx={{display: 'flex', gap: 3, mb: 3}}>
                <FormControl  size={'small'} sx={{width: 300}}>
                    <InputLabel id="demo-simple-select-label6">Academic year</InputLabel>
                    <Select

                        labelId="demo-simple-select-label6"
                        id="demo-simple-select"
                        label="Academic year"
                        value={eduYearValue}
                        onChange={e => setEduYearValue(e.target.value)}
                    >
                        {optionYear?.map((item, index) => (
                            <MenuItem key={index} value={item?.id}>{item?.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl size={'small'} sx={{width: 300}}>
                    <InputLabel id="demo-simple-select-label655">Direction</InputLabel>
                    <Select
                        labelId="demo-simple-select-label655"
                        id="demo-simple-select"
                        label="Direction"
                        value={directionValue}
                        onChange={e => setDirectionValue(e.target.value)}
                    >
                        {optionDirection?.faculties?.map((item, key) => (
                            <MenuItem key={item?.id} value={item?.id}>{item?.shortName}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <DataGridCustomize
                columns={columns}
                rows={dataVedimost}
                loading={load}
                pageSizeData={10}
            />
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
    padding: 1rem;`;
export default StatementDataDean;