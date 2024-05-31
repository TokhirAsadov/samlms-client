import React, {memo, useEffect, useState} from 'react';
import styled from "styled-components";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import {BASE_URL, getHeaders} from "../../utills/ServiceUrls";
import HistoryDataGrid from "./HistoryDataGrid";
import {useSelector} from "react-redux";

const HistoryFileTabel = () => {
    const [departamentData, setDepartamentData] = useState([])
    const dep=useSelector(state => state.section.section)
    const [selectedDepartament, setSelectedDepartament] = useState('')
    const {headers} = getHeaders();
    const [fileData, setFileData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const fetchKafedra = () => {
        axios.get(BASE_URL + "/kafedra/getKafedrasForSelect", {headers})
            .then(res => {
                setDepartamentData(res?.data?.obj)
                setSelectedDepartament(res.data?.obj.find(i => i.value === dep.id)?.value)
            })
            .catch(err => {
                console.log(err)
                setDepartamentData([])
            })
    }
    const getTablesData = (kafedraId) => {
        if (kafedraId?.trim() !== '') {
            setIsLoading(true);
            axios.get(`${BASE_URL}/table/getTables/${kafedraId}`, {headers})
                .then(res => {
                    setFileData(res.data.obj);
                })
                .catch(err => {
                    console.log(err);
                    setFileData([]);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };



    useEffect(() => {
        fetchKafedra()
    }, []);

    useEffect(() => {
        getTablesData(selectedDepartament)
    }, [selectedDepartament]);

    return (
        <Container>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
                    <FormControl sx={{width: 300}}>
                        <InputLabel id="demo-simple-select-label">Department</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedDepartament}
                            label="Department"
                            onChange={e => setSelectedDepartament(e.target.value)}
                            disabled
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {departamentData?.map(option => (
                                <MenuItem key={option?.value} value={option?.value}>{option?.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Box>
           <HistoryDataGrid fileData={fileData} isLoading={isLoading}/>
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
    padding: 1rem;
`
export default memo(HistoryFileTabel);