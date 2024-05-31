import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import EduYearModal from "./EduYearModal";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import axios from "axios";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import DataGridCustomize from "../../dataGridCustomize/DataGridCustomize";
import moment from "moment";
import IconButton from "@mui/material/IconButton";
import {BsPencilSquare} from "react-icons/bs";
import {FaTrash} from "react-icons/fa";
import {toast} from "react-toastify";

const DataAllEducationYear = () => {
    const [dataForPutEduYear, setDataForPutEduYear] = useState(null)
    const [yearsArr, setYearsArr] = useState([]);
    const columnsEduYears = [
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
            field: 'name',
            headerName: 'Name',
            sortable: true,
            align: 'center',
            justifyContent: 'center'
        },
        {
            minWidth: 100,
            flex: 0.8,
            field: 'start',
            headerName: 'Start',
            sortable: true,
            align: 'center',
            justifyContent: 'center',
            renderCell: (cellValue) => moment(cellValue.row.start).format('DD.MM.YYYY')
        },
        {
            minWidth: 100,
            flex: 0.8,
            field: 'end',
            headerName: 'End',
            sortable: true,
            align: 'center',
            renderCell: (cellValue) => moment(cellValue.row.end).format('DD.MM.YYYY')
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
                    <IconButton onClick={() => handleChangeEduYear(cellValue.row)}>
                        <BsPencilSquare size={20} color={'green'}/>
                    </IconButton>
                    <IconButton onClick={() => handleDeleteEduYear(cellValue.row.id)}>
                        <FaTrash size={20} color={'red'}/>
                    </IconButton>
                </Box>
            )
        },

    ]
    const handleChangeEduYear = (data) => {
        setDataForPutEduYear(data);
    }
    const handleDeleteEduYear = (id) => {
        axios.delete(`${BASE_URL}/education/deleteById/${id}`, getHeaders())
            .then(res => {
                console.log(res.data)
                getEduYearsData()
                toast.warning("Deleted successfully")
            })
            .catch(err => {
                console.log(err)
                toast.error("Something went wrong")
            })
    }
    const getEduYearsData = () => {
        axios.get(`${BASE_URL}/education/educationYearsForCRUD`, getHeaders())
            .then(res => {
                setYearsArr(res.data.obj.map((item, index) => ({...item, count: index + 1})))

            })
            .catch(err => {
                console.log(err)
                setYearsArr([])
            })
    }
    useEffect(() => {
        getEduYearsData()
    }, [])
    return (
        <Container>
            <Box display="flex" justifyContent="end" gap={2} mb={3}>
                <EduYearModal dataForPut={dataForPutEduYear} setDataForPutEduYear={setDataForPutEduYear}
                              getEduYearsData={getEduYearsData}/>
            </Box>
            <DataGridCustomize
                columns={columnsEduYears}
                rows={yearsArr}
                loading={false}
                hiddenItem={{
                    currents: false,
                    finals: false,
                    retakeN: false
                }}
            />
        </Container>
    );
};
const Container = styled.div`
    width: 100%;
    padding: 1rem;
`;
export default DataAllEducationYear;