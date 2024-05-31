import React, {useEffect, useState} from 'react';
import {Card, CardContent, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import styled from "styled-components";
import moment from "moment/moment";
import EmptyDataImg from "../../emptyDataImg/EmptyDataImg";
import {extrasmall} from "../../../responsiv";
import axios from "axios";
import {useSelector} from "react-redux";
import Modal from "@mui/material/Modal";
import {IoClose} from "react-icons/io5";
import Button from "@mui/material/Button";
import {toast} from "react-toastify";
import {MdLibraryAdd} from "react-icons/md";

const QueueDeanForStudent = () => {

    const student = useSelector(state => state?.student?.student);
    const isSirtqi = student.groupData?.educationTypeName === "SIRTQI"
    const [data, setData] = useState([])
    const [currentQueue, setCurrentQueue] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const {headers} = getHeaders()
    const getAllStudentQueue = () => {
        setIsLoading(true)
        axios.get(BASE_URL + `/queue/getAllStudentQueues/${student.id}`, {headers})
            .then(res => {
                console.log(res.data.obj)
                setCurrentQueue(res.data.obj[0])
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }
    const findAllQueuesOfTodayForDean = () => {
        axios.get(BASE_URL + '/queue/findAllQueuesOfTodayForDean', {headers})
            .then(res => {
                console.log(res)
                setData(res.data.obj.sort((a, b) => {
                    if (a.number > b.number) return 1;
                    else if (a.number < b.number) return -1;
                    return 0;
                }))
            })
            .catch(err => {
                console.log(err)
            })
    }
    const queueCreate = () => {
        axios.post(BASE_URL + '/queue/createQueue', {}, {headers})
            .then(res => {
                console.log(res.data)
                getAllStudentQueue()
                findAllQueuesOfTodayForDean()
                setOpenModal(false)
                toast.success('Successfully created')
            })
            .catch(err => {
                console.log(err)
                toast.error('Error creating')
            })
    }
    useEffect(() => {
        getAllStudentQueue()
        findAllQueuesOfTodayForDean()
    }, []);

    const handleCloseModal = () => {
        setOpenModal(false);
    }

    return (
        isSirtqi ? (
            <>
                <QueueCard>
                    {moment().format('DD.MM.YYYY') === moment(currentQueue?.createdAt).format('DD.MM.YYYY') && currentQueue?.number &&
                        <Card sx={{width: '320px', mt: 3}}>
                            <CardContent sx={{pb: '16px !important'}}>
                                <Box
                                    sx={{
                                        color: mainColor,
                                    }}
                                >
                                    <Typography fontWeight={'bold'} fontSize={20}>
                                        Queue : {currentQueue?.number}
                                    </Typography>
                                    <Typography fontWeight={'bold'} fontSize={20}>
                                        Status : {currentQueue?.status}
                                    </Typography>
                                    <Typography fontWeight={'bold'} fontSize={20}>
                                        Create date :{moment(currentQueue?.createdAt).format('DD.MM.YYYY HH:mm')}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>}
                </QueueCard>
                <Card sx={{mt: 3}}>
                    <CardContent>
                        <Stack mt={1} direction="row" justifyContent="end">
                            <Button onClick={() => setOpenModal(true)} variant="contained" color="success"
                                    endIcon={<MdLibraryAdd/>}>
                                Apply
                            </Button>
                        </Stack>
                        <BodyBox>
                            <table>
                                <thead>
                                <tr>
                                    <th style={{width: '100px'}}>№</th>
                                    <th>Full name</th>
                                    <th style={{width: '250px'}}> Date of creation</th>
                                    <th style={{width: '250px'}}> Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {data?.map(item => (
                                    <tr key={item?.id}
                                        style={{background: student.fullName === item?.studentData?.fullName && '#e7e7e7'}}>
                                        <td>{item?.number}</td>
                                        <td>{item?.studentData?.fullName}</td>
                                        <td>{moment(item?.createdAt).format('DD.MM.YYYY HH:mm')}</td>
                                        <td>{item?.status}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </BodyBox>
                        {data?.length === 0 && <Box>
                            <EmptyDataImg w={200} h={180}/>
                        </Box>}
                    </CardContent>
                </Card>
                {/*modal create*/}
                <Modal
                    open={openModal}
                    onClose={handleCloseModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style} component={style2}>
                        <ModalTitle>
                            <h5>

                            </h5>
                            <CloseBtnModal onClick={handleCloseModal}> <IoClose size={22}/></CloseBtnModal>
                        </ModalTitle>
                        <Box>
                            <Stack sx={{height: "100px"}} direction="row" justifyContent="center" alignItems="center">
                                <Typography variant="h6" color="black">
                                    Do you want to meet with the dean?
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing={2} justifyContent="flex-end"
                                   alignItems="center">
                                <Button variant="outlined" onClick={handleCloseModal}>Cancel</Button>
                                <Button variant="contained" onClick={() => queueCreate()}>
                                    Ok
                                </Button>
                            </Stack>
                        </Box>
                    </Box>
                </Modal>
            </>
        ) : (
            <Card sx={{mt: 3}}>
                <CardContent>
                    <Typography textAlign={'center'} fontWeight={'bold'} color={'error'} fontSize={25}>For external
                        education only !</Typography>
                </CardContent>
            </Card>
        )

    );
};

const ModalTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    h4 {
        color: black;
    }

    h5 {
        color: red;
    }

`
const CloseBtnModal = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
    border-radius: 50%;
    border: none;
    background-color: ${mainColor};
    color: white;
    font-size: 12px;
`
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    padding: "15px",
    borderRadius: "8px",
};
const style2 = styled.div`
    ${extrasmall({
        width: "95% !important",
    })}
`
const QueueCard = styled.div`
    display: flex;
    justify-content: end;
    ${extrasmall({
        justifyContent: 'center',
    })}
`;
const BodyBox = styled.div`
    margin-top: 25px;
    width: 100%;
    overflow-x: scroll;

    table {
        min-width: 700px;
        border-collapse: collapse;
        width: 100%;
        border-radius: 5px;
        overflow: hidden;

        td, th {
            border: 1px solid #ddd;
            padding: 8px;
            font-size: 15px;
            text-align: center;
        }

        th {
            text-align: center;
        }

        tr {
            &:nth-child(even) {
                background-color: #fcf9f9;
            }
        }

        th {
            background-color: ${mainColor};
            color: white;
        }
    }`;
export default QueueDeanForStudent;