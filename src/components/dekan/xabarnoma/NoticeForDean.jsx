import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import Button from "@mui/material/Button";
import ModalCreate from "./ModalCreate";
import Box from "@mui/material/Box";
import NoticeDataGrid from "./NoticeDataGrid";
import axios from "axios";
import {BASE_URL} from "../../../utills/ServiceUrls";
import {useSelector} from "react-redux";
import {Card, CardContent} from "@mui/material";
import Typography from "@mui/material/Typography";
import {FaFileAlt} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import {MdCreateNewFolder} from "react-icons/md";

const NoticeForDean = () => {
    const isDeanExternal = useSelector(state => state.dekanat.dekanat?.name) === "Sirtqi ta'lim"
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [modalCreate, setModalCreate] = useState(false)
    const [putData, setPutData] = useState(null)
    const navigate = useNavigate()
    const handleCloseModalCreate = () => {
        setModalCreate(false)
        setPutData(null)
    }

    const getNoticeFOrDean = () => {
        setIsLoading(true)
        axios.get(BASE_URL + '/notificationOuter/getAllOuterNotifications ')
            .then(response => {
                setData(response.data.obj?.sort((a, b) => {
                    if (a.fromDate < b.fromDate) return 1;
                    if (a.fromDate > b.fromDate) return -1;
                    return 0;
                })?.map((item, index) => ({...item, count: index + 1})))
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }


    useEffect(() => {
        getNoticeFOrDean()
    }, []);

    return (
        <Container>
            {isDeanExternal ? (
                <>
                    <Box mt={3} display={'flex'} justifyContent={'end'} gap={5}>
                        <Button variant={'contained'} endIcon={<MdCreateNewFolder/>}
                                onClick={() => setModalCreate(true)}>
                            create
                        </Button>
                        <Button variant={'contained'} color={'inherit'} endIcon={<FaFileAlt/>}
                                onClick={() => navigate('history')}>
                            History
                        </Button>
                    </Box>
                    <NoticeDataGrid
                        getNoticeFOrDean={()=>getNoticeFOrDean()}
                        data={data}
                        isLoading={isLoading}
                        setPutData={setPutData}
                        setModalCreate={setModalCreate}
                    />
                </>) : (
                <Card sx={{mt: 3}}>
                    <CardContent>
                        <Typography textAlign={'center'} fontWeight={'bold'} color={'error'} fontSize={25}>For external
                            education only !</Typography>
                    </CardContent>
                </Card>
            )}

            {/*modal create*/}
            <ModalCreate
                modalCreate={modalCreate}
                getNoticeFOrDean={getNoticeFOrDean}
                handleCloseModalCreate={handleCloseModalCreate}
                putData={putData}
            />
        </Container>
    );
};

const Container = styled.div`
    width: 100%;

    .MuiDataGrid-columnHeaderTitleContainer {
        justify-content: center;
    }
`
export default NoticeForDean;