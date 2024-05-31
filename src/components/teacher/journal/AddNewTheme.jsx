import React, {useEffect, useRef, useState} from 'react';
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";

const AddNewTheme = ({open, setThemeModal, educationYearId, groupId, subjectId,getThemeAll}) => {
    const {headers} = getHeaders()
    const updateData = useSelector(state => state.dataForUpdateThemeGrade.data)
    const initialState = {
        name: '',
        maxGrade: '',
    }
    const [data, setData] = useState(initialState)
    const handleClose = () => {
        setThemeModal(false);
        setData(initialState)

    };

    useEffect(() => {
        updateData && setData(updateData)
    }, [updateData]);
    const handleSubmit = () => {

        const body = {
            ...data,
            maxGrade: parseFloat(data.maxGrade),
            educationYearId,
            groupId,
            subjectId,
        };
        console.log(body)
        if (
            body.name?.trim() === '' ||
            body.maxGrade <= 0 ||
            body.maxGrade === '' ||
            isNaN(body.maxGrade)
        ) {
            return toast.error('Error')
        }
if (body?.id){
    axios.put(`${BASE_URL}/themeOfSubjectForGrading/updateTheme`, body, {headers})
        .then(res => {
            console.log(res.data);
            toast.success(res.data.message);
            getThemeAll()
            handleClose();
        })
        .catch(err => {
            const errorMessage = err.response.data.message
            console.log(err);
            toast.error(errorMessage);
        });
}
else {
    axios.post(`${BASE_URL}/themeOfSubjectForGrading/createTheme`, body, {headers})
        .then(res => {
            console.log(res.data);
            toast.success(res.data.message);
            getThemeAll()
            handleClose();
        })
        .catch(err => {
            const errorMessage = err.response.data.message
            console.log(err);
            toast.error(errorMessage);
        });
}

    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Add a new theme
                </Typography>

                <Box>
                    <TextField
                        value={data.name}
                        required
                        onChange={e => setData(prev => ({...prev, name: e.target.value}))}
                        sx={{margin: '15px 0'}}
                        fullWidth
                        type="text"
                        label={'Theme'}
                        inputProps={{minLength: 4}}
                    />
                    <TextField
                        value={data.maxGrade}
                        onChange={e => setData(prev => ({...prev, maxGrade: e.target.value}))}
                        sx={{marginBottom: '15px'}}
                        fullWidth
                        type="number"
                        label={'Max grade'}
                        InputProps={{inputProps: {min: 0}}}
                    />
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'end', gap: '15px'}}>
                    <Button variant={'outlined'} onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type={'submit'} onClick={handleSubmit} variant={'contained'}>
                        {data?.id ? "Update" : "Save"}
                    </Button>
                </Box>

            </Box>
        </Modal>
    );
};
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 330,
    bgcolor: 'background.paper',
    border: 'none',
    outline: 'none',
    borderRadius: "5px",
    p: 2,
};
export default AddNewTheme;
