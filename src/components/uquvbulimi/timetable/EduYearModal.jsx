import React, { useEffect, useState } from 'react';
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import { Fade } from "@mui/material";
import Box from "@mui/material/Box";
import { extrasmall } from "../../../responsiv";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { IoSend } from "react-icons/io5";
import { toast } from "react-toastify";
import axios from "axios";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import Typography from "@mui/material/Typography";
import PropTypes from 'prop-types';
import styled from "styled-components";

const EduYearModal = ({ dataForPut, setDataForPutEduYear,getEduYearsData }) => {
    const initialData = {
        id: null,
        name: '',
        start: '',
        end: '',
    };
    const [openModal, setOpenModal] = useState(false);
    const [dataForm, setDataForm] = useState(initialData);

    useEffect(() => {
        if (dataForPut) {
            setDataForm(dataForPut);
            handleOpen();
        }
    }, [dataForPut]);

    const handleOpen = () => setOpenModal(true);
    const handleClose = () => {
        setOpenModal(false);
        setDataForm(initialData);
        setDataForPutEduYear(null);
    };

    const handleSaveData = () => {
        if (!dataForm.name || !dataForm.start || !dataForm.end) {
            toast.warning("All fields are required.");
            return;
        }
        const body = {
            id:dataForm.id || null,
            name: dataForm.name,
            weeksIds:null,
            start: dataForm.start,
            end: dataForm.end
        };
        console.log(body)
        if (!body.id){
            axios.post(`${BASE_URL}/education/save`, body,getHeaders())
                .then(res => {
                    console.log(res.data);
                    getEduYearsData()
                    handleClose()
                    toast.success('SAVED');
                })
                .catch(err => {
                    console.log(err);
                    toast.error('ERROR');
                });
        }
        else {
            axios.put(`${BASE_URL}/education/update`, body)
                .then(res => {
                    console.log(res.data);
                    getEduYearsData()
                    handleClose()
                    toast.success('UPDATE');
                })
                .catch(err => {
                    console.log(err);
                    toast.error('ERROR');
                });
        }

    };

    return (
        <>
            <Button color={'success'} variant="contained" onClick={handleOpen}>Create an academic year</Button>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openModal}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={openModal}>
                    <Box sx={style} component={styleModal}>
                        <Typography variant="h6">Academic year</Typography>
                        <TextField sx={{ mt: 3 }} fullWidth label={'Name'} value={dataForm.name}
                                   onChange={(e) => setDataForm(prev => ({ ...prev, name: e.target.value }))} />
                        <Box display={'flex'} gap={3} mt={3}>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                    label="Start date"
                                    value={dataForm.start}
                                    onChange={(newValue) => setDataForm(prev => ({ ...prev, start: newValue }))}
                                    renderInput={(props) => <TextField {...props} />}
                                />
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                    label="End date"
                                    value={dataForm.end}
                                    onChange={(newValue) => setDataForm(prev => ({ ...prev, end: newValue }))}
                                    renderInput={(props) => <TextField {...props} />}
                                />
                            </LocalizationProvider>
                        </Box>
                        <Box sx={{
                            marginTop: "15px",
                            width: "100%",
                            display: "flex",
                            justifyContent: "end",
                            gap: "15px"
                        }}>
                            <Button onClick={handleClose} variant="outlined">Cancel</Button>
                            <Button onClick={handleSaveData} variant="contained" endIcon={<IoSend />}>Save</Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </>
    );
};

const style = {
    zIndex: 0,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "480px",
    bgcolor: 'background.paper',
    borderRadius: "5px",
    boxShadow: 24,
    p: 2,
};

const styleModal = styled.div`
    ${extrasmall({
        width: "330px !important",
    })}
`;

EduYearModal.propTypes = {
    dataForPut: PropTypes.object, // Ensure dataForPut is an object
    setDataForPutEduYear: PropTypes.func // Ensure setDataForPutEduYear is a function
};

export default EduYearModal;
