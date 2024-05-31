import React, {memo, useState} from 'react';
import styled from "styled-components";
import {Stack, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import axios from "axios";
import {BASE_URL} from "../../../../utills/ServiceUrls";
import {toast} from "react-toastify";
import {extrasmall} from "../../../../responsiv";

const CreateResultsData = ({closeBtnFn, fetchData, putData}) => {

    const initialState = {
        studentId: '',
        year: '',
        semester: '',
        subject: '',
        credit: '',
        score: '',
    }
    const inputChooseData = putData ? putData : initialState
    const [inputValues, setInputValues] = useState(inputChooseData)
    const dataSinglePost = (body) => {
        axios.post(BASE_URL + '/workOtherService/saveSingleResult', body)
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
        axios.put(BASE_URL + '/workOtherService/updateSingleResult', body)
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
            const creditValue = parseInt(inputValues.credit, 10);

            if (!isNaN(creditValue)) {
                const body = {...inputValues, credit: creditValue}
                console.log(body)
                if (putData) {
                    dataSinglePut(body)
                } else {
                    dataSinglePost(body)
                }

            } else {
                toast.error('Please enter a valid number for Credit.')
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
                    label={'Year'}
                    value={inputValues.year}
                    onChange={e => setInputValues(prevState => ({...prevState, year: e.target.value}))}
                />
                <TextField
                    fullWidth
                    label={'Semester'}
                    value={inputValues.semester}
                    onChange={e => setInputValues(prevState => ({...prevState, semester: e.target.value}))}
                />
                <TextField
                    fullWidth
                    label={'Subject'}
                    value={inputValues.subject}
                    onChange={e => setInputValues(prevState => ({...prevState, subject: e.target.value}))}
                />
                <TextField
                    fullWidth
                    label={'Credit'}
                    type="number"
                    value={inputValues.credit}
                    onChange={e => setInputValues(prevState => ({...prevState, credit: e.target.value}))}
                />
                <TextField
                    fullWidth
                    label={'Score'}
                    value={inputValues.score}
                    onChange={e => setInputValues(prevState => ({...prevState, score: e.target.value}))}
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
export default memo(CreateResultsData);