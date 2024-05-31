import React, {memo, useState} from 'react';
import styled from "styled-components";
import {Stack, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import axios from "axios";
import {BASE_URL} from "../../../../utills/ServiceUrls";
import {toast} from "react-toastify";
import {extrasmall} from "../../../../responsiv";

const CreateFailsData = ({closeBtnFn,fetchData,putData}) => {

    const initialState = {
        studentId: '',
        year: '',
        semester: '',
        subject: '',
        credit: '',
        currents: '',
        finals: '',
        totals: '',
        penalty: '',
        retakeN: '',
        retakeData: '',
        note: '',
    }
    const inputChooseData = putData ? putData : initialState
    const [inputValues, setInputValues] = useState(inputChooseData)
    const dataSinglePost = (body) => {
        axios.post(BASE_URL + '/workOtherService/saveSingleFail', body)
            .then(res => {
                console.log(res)
                fetchData()
                toast.success('Successfully saved')
                closeBtnFn()
            })
            .catch(err => {
                console.log(err)
                toast.error('Error saving')
            })
    }
    const dataSinglePut = (body) => {
        axios.put(BASE_URL + '/workOtherService/updateSingleFail', body)
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
                    label={'Currents'}
                    value={inputValues.currents}
                    onChange={e => setInputValues(prevState => ({...prevState, currents: e.target.value}))}
                />
                <TextField
                    fullWidth
                    label={'Finals'}
                    value={inputValues.finals}
                    onChange={e => setInputValues(prevState => ({...prevState, finals: e.target.value}))}
                />
                <TextField
                    fullWidth
                    label={'Totals'}
                    value={inputValues.totals}
                    onChange={e => setInputValues(prevState => ({...prevState, totals: e.target.value}))}
                />
                <TextField
                    fullWidth
                    label={'Penalty'}
                    value={inputValues.penalty}
                    onChange={e => setInputValues(prevState => ({...prevState, penalty: e.target.value}))}
                />
             <TextField
                    fullWidth
                    label={'Contract N'}
                    value={inputValues.retakeN}
                    onChange={e => setInputValues(prevState => ({...prevState, retakeN: e.target.value}))}
                />
             <TextField
                    fullWidth
                    label={'Contract date'}
                    value={inputValues.retakeData}
                    onChange={e => setInputValues(prevState => ({...prevState, retakeData: e.target.value}))}
                />
             <TextField
                    fullWidth
                    label={'Note'}
                    value={inputValues.note}
                    onChange={e => setInputValues(prevState => ({...prevState, note: e.target.value}))}
                />
            </WrapperInputs>
            <Stack direction="row" spacing={2} justifyContent="flex-end"
                   alignItems="center">
                <Button variant="outlined" onClick={closeBtnFn}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}>
                    save
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
export default memo(CreateFailsData);