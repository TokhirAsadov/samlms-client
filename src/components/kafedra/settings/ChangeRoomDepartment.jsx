import React, {useState} from 'react';
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import axios from "axios";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";

const ChangeRoomDepartment = ({handleClose}) => {
    const {headers} = getHeaders()
    const [roomName, setRoomName] = useState('')
    const depId=useSelector(state => state.section?.section.id)
    const handleSave = () => {
        const body = {
            id: depId,
            name: roomName,
        }
        if (body.name.trim() === '') return toast.error('Empty')
        axios.put(`${BASE_URL}/kafera-mudiri/changeRoomOfKafedra`, body, {headers})
            .then(res => {
                console.log(res.data)
                toast.success('Success')
                setRoomName('')
                handleClose()
            })
            .catch(err => {
                console.log(err)
                toast.error('Error')
            })
    }

    return (
        <Box sx={{display: 'grid', gridTemplateColumns: '1fr', gap: '20px', mt: '20px'}}>
            <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment-passwovbnrd">Audience</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-passwovbnrd"
                    type={'text'}
                    onChange={e => setRoomName(e.target.value)}
                    name={'password'}
                    value={roomName}
                    label="Audience"
                />
            </FormControl>
            <Button variant={'contained'} onClick={handleSave}>Save</Button>
        </Box>
    );
};

export default ChangeRoomDepartment;