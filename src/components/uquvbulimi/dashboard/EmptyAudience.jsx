import React, { useEffect, useState } from 'react';
import axios from "axios";
import { BASE_URL, getHeaders } from "../../../utills/ServiceUrls";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import styled from "styled-components";
import moment from "moment";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const EmptyAudience = () => {
    const { headers } = getHeaders();
    const [buildingData, setBuildingData] = useState([]);
    const [floorData, setFloorData] = useState([]);
    const [chooseBuilding, setChooseBuilding] = useState('');
    const [chooseFloor, setChooseFloor] = useState('');
    const [chooseDate, setChooseDate] = useState(moment());

    useEffect(() => {
        getBuildings();
    }, []);

    useEffect(() => {
        getMainStatistics();
    }, [chooseBuilding, chooseFloor, chooseDate]);

    const getBuildings = async () => {
        try {
            const res = await axios.get(BASE_URL + "/building/getBuildingsForSelect", { headers });
            const resData = res?.data?.obj;
            if (resData && resData.length > 0) {
                const defaultBuilding = resData[0];
                setBuildingData(resData);
                setChooseBuilding(defaultBuilding.label);
                setFloorData(generateFloorData(defaultBuilding.minFloor, defaultBuilding.maxFloor));
                setChooseFloor(defaultBuilding.minFloor);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const getMainStatistics = () => {
        if (chooseBuilding !== '' && chooseFloor !== '') {
            console.log(chooseBuilding, 'b');
            console.log(chooseFloor, 'f');
            console.log(chooseDate, 'd');
        }
    }

    const generateFloorData = (min, max) => {
        return Array.from({ length: max - min + 1 }, (_, i) => i + min);
    }

    const handleChangeBuilding = (value) => {
        setChooseBuilding(value);
        const selectedBuilding = buildingData.find(b => b.label === value);
        if (selectedBuilding) {
            setFloorData(generateFloorData(selectedBuilding.minFloor, selectedBuilding.maxFloor));
            setChooseFloor(selectedBuilding.minFloor);
        }
    }

    const handleChangeDate = (newValue) => {
        if (newValue instanceof moment) {
            setChooseDate(newValue);
        }
    }

    return (
        <Container>
            <div className='wrapperInput'>
                <div className="selectBox">
                    <FormControl fullWidth>
                        <InputLabel id="bbdemo-simple-select-label">Buildings</InputLabel>
                        <Select
                            labelId="bbdemo-simple-select-label"
                            id="demo-simple-select"
                            value={chooseBuilding}
                            label="Buildings"
                            onChange={(e) => handleChangeBuilding(e.target.value)}
                        >
                            {buildingData.map((build, index) => (
                                <MenuItem key={index} value={build.label}>{build.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className="selectBox">
                    <FormControl fullWidth>
                        <InputLabel id="ffdemo-simple-select-label">Floor</InputLabel>
                        <Select
                            labelId="ffdemo-simple-select-label"
                            id="demo-simple-select"
                            value={chooseFloor}
                            label="Floor"
                            onChange={(e) => setChooseFloor(e.target.value)}
                        >
                            {floorData.map((floor, index) => (
                                <MenuItem key={index} value={floor}>{floor}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className="selectBox">
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DesktopDatePicker
                            label="Date"
                            inputFormat="DD/MM/YYYY"
                            value={chooseDate}
                            onChange={(newValue) => handleChangeDate(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </div>
            </div>
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 1rem;

    .wrapperInput {
        overflow: hidden;
        margin: 15px 0 0;
        padding: 10px 0;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 25px;

        .selectBox {
            width: 300px;
        }
    }
`;

export default EmptyAudience;
