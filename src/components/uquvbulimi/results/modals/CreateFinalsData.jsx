import React, {memo, useState} from 'react';
import styled from "styled-components";
import {Stack, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import axios from "axios";
import {BASE_URL} from "../../../../utills/ServiceUrls";
import {toast} from "react-toastify";
import {extrasmall} from "../../../../responsiv";

const CreateFinalsData = ({closeBtnFn, fetchData, putData}) => {

    const initialState = {
        studentId: '',
        subject: '',
        forms: '',
        datas: '',
        times: '',
        rooms: '',
    }
    const inputChooseData = putData ? putData : initialState
    const [inputValues, setInputValues] = useState(inputChooseData)
    const dataSinglePost = (body) => {
        axios.post(BASE_URL + '/workOtherService/saveSingleFinal', body)
            .then(res => {
                console.log(res)
                toast.success('Successfully saved')
                fetchData()
                closeBtnFn()
            })
            .catch(err => {
                console.log(err)
                toast.error('Error saving')
            })
    }
    const dataSinglePut = (body) => {
        axios.put(BASE_URL + '/workOtherService/updateSingleFinal', body)
            .then(res => {
                console.log(res)
                toast.success('Successfully updated')
                fetchData()
                closeBtnFn()
            })
            .catch(err => {
                console.log(err)
                toast.error('Error updated')
            })
    }
    const handleSave = () => {

        let isValid = true;

        for (const key in inputValues) {
            if (inputValues[key] === '') {
                isValid = false;
                break;
            }
        }
        if (isValid) {
                console.log(inputValues)
                if (putData) {
                    dataSinglePut(inputValues)
                } else {
                    dataSinglePost(inputValues)
                }
        } else {
            toast.error('Please fill in all the fields')
        }
    }

    return (
        <Container>
            <WrapperInputs>

                <TextField
                    fullWidth
                    disabled
                    label={'StudentId'}
                    value={inputValues.studentId}
                    onChange={e => setInputValues(prevState => ({...prevState, studentId: e.target.value}))}
                />
                <TextField
                    fullWidth
                    label={'Subject'}
                    value={inputValues.subject}
                    onChange={e => setInputValues(prevState => ({...prevState, subject: e.target.value}))}
                />
                <TextField
                    fullWidth
                    label={'Form'}
                    value={inputValues.forms}
                    onChange={e => setInputValues(prevState => ({...prevState, forms: e.target.value}))}
                />
                <TextField
                    fullWidth
                    label={'Data'}
                    value={inputValues.datas}
                    onChange={e => setInputValues(prevState => ({...prevState, datas: e.target.value}))}
                />

                <TextField
                    fullWidth
                    label={'Time'}
                    value={inputValues.times}
                    onChange={e => setInputValues(prevState => ({...prevState, times: e.target.value}))}
                />
                <TextField
                    fullWidth
                    label={'Room'}
                    value={inputValues.rooms}
                    onChange={e => setInputValues(prevState => ({...prevState, rooms: e.target.value}))}
                />

            </WrapperInputs>
            <Stack direction="row" spacing={2} justifyContent="flex-end"
                   alignItems="center">
                <Button variant="outlined" onClick={closeBtnFn}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}>
                    {putData ? "update" : "save"}
                </Button>
            </Stack>
        </Container>
    );
};

const WrapperInputs = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
  ${extrasmall({
    gridTemplateColumns:'1fr',
  })}
`

const Container = styled.div`
  margin: 20px 0;

`
export default memo(CreateFinalsData);