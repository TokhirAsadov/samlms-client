import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {Card, CardContent, ListItemText} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import Checkbox from "@mui/material/Checkbox";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import TextField from "@mui/material/TextField";
import DataTable from "./DataTable";
import moment from "moment";
import axios from "axios";
import {BASE_URL, getHeaders} from "../../utills/ServiceUrls";
import {useDispatch, useSelector} from "react-redux";
import {getTableDataTeachers} from "../../redux/actions/tableData/table_action";
import Button from "@mui/material/Button";
import {FaFileAlt} from "react-icons/fa";
import {useNavigate} from "react-router-dom";


const ITEM_HEIGHT = 80;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 300,
        },
    },
};
const TabelForTeachers = () => {
    const dep=useSelector(state => state.section.section)
    const {headers} = getHeaders();
    const dispatch=useDispatch()
    const [departamentData, setDepartamentData] = useState([])
    const [staffData, setStaffData] = useState([])
    const navigate=useNavigate()
    const [valueData, setValueData] = useState(
        {
            department: '',
            personData: [],
            selectedDate: moment()
        }
    )


    const fetchKafedra = () => {
        axios.get(BASE_URL + "/kafedra/getKafedrasForSelect", {headers})
            .then(res => {
                setDepartamentData(res?.data?.obj)
                setValueData(prev=>({...prev, department: res.data?.obj.find(i => i.value === dep.id)?.value}))
            })
            .catch(err => {
                console.log(err)
                setDepartamentData([])
            })
    }
    const fetchKafedraStaff = (id) => {
        if (id && id?.trim() !== '') {
            axios.get(BASE_URL + "/kafedra/getTeachersForTableByKafedraId?kafedraId=" + id, {headers})
                .then(res => {
                    setStaffData(res?.data?.obj)
                })
                .catch(err => {
                    console.log(err)
                    setStaffData([])
                })
        }
    }
    const handleChangeTeacher = (event) => {
        const {target: {value}} = event;
        setValueData((prevState) => ({...prevState, personData:value}));

    };

    const handleChange = (event) => {
        setValueData((prevState) => ({...prevState, department: event.target.value}));
        setValueData((prevState) => ({...prevState,personData: []}))
    };

    useEffect(() => {
        fetchKafedra()
    }, []);

    useEffect(() => {
        fetchKafedraStaff(valueData?.department)
    }, [valueData.department]);

    useEffect(() => {
     valueData.personData.length >0 &&  dispatch(getTableDataTeachers({valueData, staffData}))
    }, [valueData]);

    return (
        <Container>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
                    <FormControl sx={{width: 300}}>
                        <InputLabel id="demo-simple-select-label">Department</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={valueData.department}
                            label="Department"
                            onChange={handleChange}
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

                    <FormControl sx={{width: 300}}>
                        <InputLabel id="demo-multiple-checkbox-label">Choose teachers</InputLabel>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={valueData.personData}
                            onChange={handleChangeTeacher}
                            input={<OutlinedInput label="Choose teachers"/>}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                        >
                            {staffData.map((option) => (
                                <MenuItem key={option?.value} value={option?.label}>
                                    <Checkbox checked={valueData.personData.indexOf(option?.label) > -1}/>
                                    <ListItemText primary={option?.label}/>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={'en'}>
                        <DatePicker
                            inputFormat={'MMMM YYYY'}
                            value={valueData.selectedDate}
                            label={'month'}
                            views={['month']}
                            openTo={'month'}
                            onChange={(date) => {
                                setValueData((prevState) => ({...prevState, selectedDate: date}));
                            }}
                            renderInput={(props) => (
                                <TextField {...props} variant="outlined" label="Choose month"/>
                            )}
                            disableMaskedInput
                        />
                    </LocalizationProvider>
                </Box>
            </Box>
            <Box sx={{display:'flex',justifyContent:'end',my:2}}>
                <Button
                variant={"contained"}
                color={'inherit'}
                endIcon={<FaFileAlt size={18} />}
                onClick={()=>navigate('history')}
                >
                    History
                </Button>
            </Box>
            <Card sx={{mt: '1.5rem'}}>
                <CardContent>
                    <DataTable departmentId={valueData.department}/>
                </CardContent>
            </Card>
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
    padding: 1rem;
`
export default TabelForTeachers;