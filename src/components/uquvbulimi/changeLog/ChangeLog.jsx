import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {BASE_URL} from "../../../utills/ServiceUrls";
import {Card, CardContent} from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import NewData from "./NewData";
import OldData from "./OldData";
import {BsArrowLeft, BsClockHistory} from "react-icons/bs";
import axios from "axios";
import {useSelector} from "react-redux";

const ChangeLog = () => {

    const [data, setData] = useState([])
    const [dataOld, setDataOld] = useState([])
    const [toggleTable, setToggleTable] = useState(true)
    const [isLoadData, setIsLoadData] = useState(false)
    const educationYear = useSelector(state => state?.educationYear?.educationYear);


    const fetchPermissions = async () => {
        setIsLoadData(true)
        await axios.get(`${BASE_URL}/permissionForTeacherGrading/findAllPermissionsForTeacherGradingByEducationYearIdAndStatus/${educationYear?.id}?status=AT_PROCESS`)
            .then(response => {
                setData(response?.data?.obj)
                console.log(response, "------------------------- permissions found------------------------")
            })
            .catch(error => {
                console.log(error, "------------------------- permissions error------------------------")
                setData([])
            })
            .finally(() => {
                setIsLoadData(false)
            })


    }

    const fetchPermissionsHistory = async () => {
        setIsLoadData(true)
        await axios.get(`${BASE_URL}/permissionForTeacherGrading/getHistory`)
            .then(response => {
                setDataOld(response?.data?.obj)
                console.log(response, "------------------------- old permissions found------------------------")
            })
            .catch(error => {
                setDataOld([])
                console.log(error, "------------------------- old permissions error------------------------")
            })
            .finally(() => {
                setIsLoadData(false)
            })
    }

    useEffect(() => {
        fetchPermissions()
    }, [])

    useEffect(() => {
        fetchPermissionsHistory()
    }, [data]);

    return (
        <Container>
            <Box sx={{
                my: 2,
                display: 'flex',
                justifyContent: 'end',
            }}>
                {toggleTable ? (
                    <Button
                        onClick={() => setToggleTable(false)}
                        endIcon={<BsClockHistory/>}
                        variant={'contained'}>
                        history
                    </Button>
                ) : (
                    <Button
                        onClick={() => setToggleTable(true)}
                        startIcon={<BsArrowLeft/>}
                        variant={'outlined'}>
                        Back
                    </Button>
                )}

            </Box>
            <Card>
                <CardContent>

                    {toggleTable ?
                        <NewData data={data} setData={setData} isLoadData={isLoadData} fetchData={fetchPermissions}/> :
                        <OldData isLoadData={isLoadData} dataOld={dataOld}/>
                    }

                </CardContent>
            </Card>
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
    padding: 1rem;
`

export default ChangeLog;
