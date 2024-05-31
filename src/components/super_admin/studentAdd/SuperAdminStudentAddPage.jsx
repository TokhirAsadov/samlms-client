import React, {useState} from 'react';
import styled from "styled-components";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import {BASE_URL, getHeaders, mainColor, TOKEN, TokenType} from "../../../utills/ServiceUrls";
import axios from "axios";
import {toast} from "react-toastify";
import {AiOutlineCloudUpload} from "react-icons/ai";
import {extrasmall, small} from "../../../responsiv";
import Button from "@mui/material/Button";
import {Card, CardContent} from "@mui/material";

const SuperAdminStudentAddPage = () => {

    const [fullName, setFullName] = React.useState('');
    const [rfid, setRfid] = React.useState('');
    const [passport, setPassport] = React.useState('');
    const [group, setGroup] = React.useState('');
    const [login, setLogin] = React.useState('');
    const [level, setLevel] = React.useState(1);
    const [password, setPassword] = React.useState('');

    const handleChange = (event) => {
        setLevel(event.target.value);
    };

    const handleChangeFullName = (event) => {
        setFullName(event.target.value);
    };

    const handleChangeRFID = (event) => {
        setRfid(event.target.value);
    };

    const handleChangePassport = (event) => {
        setPassport(event.target.value);
    };

    const handleChangeGroup = (event) => {
        setGroup(event.target.value);
    };
    const handleChangeLogin = (event) => {
        setLogin(event.target.value);
    };

    const handleChangePassword = (event) => {
        setPassword(event.target.value);
    };

    const {headers} = getHeaders();

    const onSubmit = () => {
        if (fullName !== "" && login !== "" && password !== "" && passport !== "" && group !== "" && rfid !== "") {

            axios.post(BASE_URL + "/user/saveStudentFromSuperAdmin", {
                fullName,
                login,
                passport,
                password,
                rfid,
                group,
                level
            }, {headers})
                .then(res => {
                    console.log(res, " save super admin")
                })
                .catch(err => {
                    console.log(err)
                })
        } else {
            toast.warning("Empty any fields..")
        }
    }


    const savePhoto = (e) => {
        const url = BASE_URL + "/student/uploadStudent";
        const formData = new FormData();
        formData.append('file', e.target.files[0]);
        const token = localStorage.getItem(TOKEN)
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': TokenType + token,
                'Access-Control-Allow-Origin': '*'
            }
        }
        axios.post(url, formData, config)
            .then((response) => {
                console.log(response.data, 'RES upload');

                toast.success("Saved photo successfully...", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                })
            })
            .catch(err => {
                console.log(err, "err upload")
            })
    }

    const [show, setShow] = useState(false);


    return (
        <Container>

            <Box display={'flex'} gap={"30px"} flexWrap={'wrap'} component={BtnWrapper}>
                <label
                    style={{
                        width: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        cursor: "pointer",
                        backgroundColor: mainColor,
                        color: "white",
                        padding: "10px ",
                        borderRadius: "5px"
                    }}
                >
                    <AiOutlineCloudUpload style={{width: "20px", height: "20px"}}/>{'\xa0'}
                    Import students from file
                    <input type="file" style={{display: "none"}} onChange={savePhoto}
                           accept={"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}
                    />
                </label>

                <Btn onClick={() => setShow(!show)}>Create Student</Btn>
            </Box>

            {
                show && <>
                    <Card>
                        <CardContent>
                            <BoxAllInput>
                                {/*** --- ---   left   --- --- ***/}


                                <TextField sx={{width: 200, margin: "0 auto"}} id="outlined-basic" label="Full Name"
                                           variant="outlined"
                                           value={fullName}
                                           onChange={handleChangeFullName}
                                />

                                <TextField sx={{width: 200, margin: "0 auto",}} id="outlined-basic" label="RFID"
                                           variant="outlined"
                                           value={rfid}
                                           onChange={handleChangeRFID}
                                />


                                <Box sx={{width: 200, margin: "0 auto"}}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Course</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={level}
                                            label="Course"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value={1}>1</MenuItem>
                                            <MenuItem value={2}>2</MenuItem>
                                            <MenuItem value={3}>3</MenuItem>
                                            <MenuItem value={4}>4</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>

                                <TextField sx={{width: 200, margin: "0 auto"}} id="outlined-basic" label="Login"
                                           variant="outlined"
                                           value={login}
                                           onChange={handleChangeLogin}
                                />

                                <TextField sx={{width: 200, margin: "0 auto"}} id="outlined-basic" label="Password"
                                           variant="outlined"
                                           value={password}
                                           onChange={handleChangePassword}
                                />

                                <TextField sx={{width: 200, margin: "0 auto"}} id="outlined-basic" label="Passport"
                                           variant="outlined"
                                           value={passport}
                                           onChange={handleChangePassport}
                                />

                                <TextField sx={{width: 200, margin: "0 auto"}} id="outlined-basic" label="Group"
                                           variant="outlined"
                                           value={group}
                                           onChange={handleChangeGroup}
                                />


                            </BoxAllInput>
                            <Box display={'flex'} justifyContent={'center'}>
                                <Button variant={'contained'} sx={{width: 200, mt: "30px"}} onClick={onSubmit}>Save</Button>
                            </Box>
                        </CardContent>
                    </Card>
                </>
            }


        </Container>
    );
};

const BtnWrapper = styled.div`
    ${extrasmall({
        justifyContent: 'center',
    })}
`
const BoxAllInput = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 30px;
    ${small({
        gridTemplateColumns: "1fr 1fr",
    })}
    ${extrasmall({
        gridTemplateColumns: "1fr",
    })}
`
const Btn = styled.button`
    width: 200px;
    align-self: start;
    border: 1px solid ${mainColor};
    background-color: #fff;
    color: ${mainColor};
    border-radius: 0.3rem;
    padding: 10px !important;

    &:hover {
        background-color: ${mainColor};
        color: white;
    }
`



const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 20px;
`;


export default SuperAdminStudentAddPage;