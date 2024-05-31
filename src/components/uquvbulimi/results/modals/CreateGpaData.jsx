import React, {memo, useState} from 'react';
import styled from "styled-components";
import {Stack, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import axios from "axios";
import {BASE_URL} from "../../../../utills/ServiceUrls";
import {toast} from "react-toastify";
import {extrasmall} from "../../../../responsiv";

const CreateGpaData = ({closeBtnFn,fetchData,putData}) => {

    const initialState ={
        fullName: '',
        studentId: '',
        passport: '',
        stGroup:'',
        unv:'',
        educationType: '',
        course:'',
        yunalish: '',
        fails: '',
        stGpa: '',
    }
    const inputChooseData = putData ? putData : initialState
    const [inputValues, setInputValues] = useState(inputChooseData)

    const dataSinglePost=(body)=>{
        axios.post(BASE_URL+'/workOtherService/saveSingleGPA',body)
            .then(res=>{
                console.log(res)
                toast.success('Successfully saved')
                fetchData()
                closeBtnFn()
            })
            .catch(err=>{
                console.log(err)
                toast.error('Error saving')
            })
    }
    const dataSinglePut = (body) => {
        axios.put(BASE_URL + '/workOtherService/updateSingleGPA', body)
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
            const failsValue = parseInt(inputValues.fails, 10);

            if (!isNaN(failsValue)) {
                const body= {...inputValues, fails: failsValue}
                dataSinglePost(body)
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
                    label={'Full name'}
                    value={inputValues.fullName}
                    onChange={e=>setInputValues(prevState => ({...prevState,fullName:e.target.value}))}
                />
                <TextField
                    fullWidth
                    disabled
                    label={'StudentId'}
                    value={inputValues.studentId}
                    onChange={e=>setInputValues(prevState => ({...prevState,studentId:e.target.value}))}
                />
                <TextField
                    fullWidth
                    disabled
                    label={'Passport'}
                    value={inputValues.passport}
                    onChange={e=>setInputValues(prevState => ({...prevState,passport:e.target.value}))}
                />
                <TextField
                    fullWidth
                    label={'Group name'}
                    value={inputValues.stGroup}
                    onChange={e=>setInputValues(prevState => ({...prevState,stGroup:e.target.value}))}
                />
                 <TextField
                    fullWidth
                    label={'Unv'}
                    value={inputValues.unv}
                    onChange={e=>setInputValues(prevState => ({...prevState,unv:e.target.value}))}
                />
                <TextField
                    fullWidth
                    label={'Education type'}
                    value={inputValues.educationType}
                    onChange={e=>setInputValues(prevState => ({...prevState,educationType:e.target.value}))}
                />
                 <TextField
                    fullWidth
                    label={'Course'}
                    value={inputValues.course}
                    onChange={e=>setInputValues(prevState => ({...prevState,course:e.target.value}))}
                />
                 <TextField
                    fullWidth
                    label={'Direction'}
                    value={inputValues.yunalish}
                    onChange={e=>setInputValues(prevState => ({...prevState,yunalish:e.target.value}))}
                />
                <TextField
                    fullWidth
                    label={'Fails'}
                    type="number"
                    value={inputValues.fails}
                    onChange={e=>setInputValues(prevState => ({...prevState,fails:e.target.value}))}
                />
                <TextField
                    fullWidth
                    label={'GPA'}
                    value={inputValues.stGpa}
                    onChange={e=>setInputValues(prevState => ({...prevState,stGpa:e.target.value}))}
                />
            </WrapperInputs>
            <Stack direction="row" spacing={2} justifyContent="flex-end"
                   alignItems="center">
                <Button variant="outlined" onClick={closeBtnFn}>Cancel</Button>
                <Button variant="contained" onClick={handleSave} >
                    {putData ? "update" : "save"}
                </Button>
            </Stack>
        </Container>
    );
};

const WrapperInputs=styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap:20px;
  margin-bottom: 20px;
  ${extrasmall({
    gridTemplateColumns:'1fr',
  })}
`

const Container = styled.div`
    margin: 20px 0;
 
`
export default memo(CreateGpaData);