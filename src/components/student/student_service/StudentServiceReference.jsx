import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {Card, CardContent, Stack} from "@mui/material";
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import Button from "@mui/material/Button";
import {MdLibraryAdd} from "react-icons/md";
import Typography from "@mui/material/Typography";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import IconButton from "@mui/material/IconButton";
import {CgClose} from "react-icons/cg";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from "@mui/material/TextField";
import {BsDownload} from "react-icons/bs";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {fetchEducationYear} from "../../../redux/actions/educationYear/education_year_actions";
import {toast} from "react-toastify";
import moment from "moment";
import PdfNewChange from "./PdfNewChange";
import EmptyDataImg from "../../emptyDataImg/EmptyDataImg";
import NoticePageForStudent from "./NoticePageForStudent";
import PdfPracticeLetter from "../../../utills/pdfFiles/PdfPracticeLetter";


const StudentServiceReference = () => {

    const [open, setOpen] = useState(false);
    const [obj, setObj] = useState({
        studentId: null,
        deanId: null,
        educationYearId: null,
        description: null,
        type: null
    })
    const [types, setTypes] = useState([]);
    const handleClose = () => setOpen(false);
    const educationYear = useSelector(state => state?.educationYear?.educationYear) || null;
    const student = useSelector(state => state?.student?.student) || null;
    const dispatch = useDispatch()
    const {headers} = getHeaders()
    const [loading, setLoading] = useState(true);
    const [references, setReferences] = useState([]);


    const fetchCheckExistsReference = async () => {
        await axios.get(`${BASE_URL}/reference/checkPreference?studentId=${student.id}`)
            .then(res => {
                console.log(res, 'chekkk')
                if (res.data?.success) {
                    setOpen(true);
                } else {
                    toast.warning("File exist")
                }
            })
            .catch(err => {
                console.log(err)
                toast.error('Error')
            })
    }

    const fetchEducationYears = async () => {
        await axios.get(BASE_URL + '/education/educationYearsForSelected', {headers})
            .then(res => {
                // console.log(res?.data?.obj,"education years res come")
                dispatch(fetchEducationYear(res?.data?.obj?.[0]))
            })
            .catch(err => {
                console.log(err);
            })
    }

    const fetchTypeOfReference = async () => {
        await axios.get(`${BASE_URL}/reference/getTypesOfReference`)
            .then(response => {
                setTypes(response?.data?.obj)
            })
            .catch(err => {
                console.log(err)
            })
    }


    useEffect(() => {
        fetchEducationYears();
        fetchTypeOfReference();
    }, [])


    const fetchCreateReference = async () => {
        await axios.post(`${BASE_URL}/reference/create`, {
            ...obj,
            studentId: student?.id,
            deanId: student?.deanId,
            educationYearId: educationYear?.id
        }, {headers})
            .then(response => {
                handleClose();
                //console.log(response?.data,"create reference")
                toast.success(response?.data?.message);
            })
            .catch(err => {
                console.log(err)
            })
    }

    const save = async (e) => {
        e.preventDefault();
        obj?.description && obj?.type && await fetchCreateReference();
    }

    useEffect(() => {
        if (!loading) {
            const sse = new EventSource(BASE_URL + '/reference/stream?userId=' + student?.id + '&bool=false');

            sse.addEventListener("reference-list-event", (event) => {
                const data = JSON.parse(event.data);
                setReferences(data)

            });
            sse.onerror = () => {
                sse.close();
            };
            return () => {
                sse.close();
            };
        }
    }, [loading])

    useEffect(() => {
        student?.id && setLoading(false);

    }, [student])

    return (
        <>
            <Card sx={{mt: 3}}>
                <CardContent>
                    <Stack mt={1} direction="row" justifyContent="end">
                        <Button onClick={() => fetchCheckExistsReference()} variant="contained" color="success"
                                endIcon={<MdLibraryAdd/>}>
                            Apply
                        </Button>
                    </Stack>

                    <Bodybox>
                        <table>
                            <thead>
                            <tr>
                                <th>№</th>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>File</th>
                            </tr>
                            </thead>
                            <tbody>
                            {references.length > 0 && references?.map((reference, index) => (
                                <tr key={index}>
                                    <td style={{textAlign: "center"}}>{index + 1}</td>
                                    <td>{reference?.type}</td>
                                    <td>
                                        {moment(new Date(reference?.createdAt)).format("DD-MM-YYYY HH:mm:ss")}
                                    </td>
                                    <td>
                                        {reference?.description}
                                    </td>
                                    <td>
                                        <Stack direction="row" justifyContent="center">
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color={
                                                    reference?.status === "AT_PROCESS" ? "warning" :
                                                        reference?.status === "CONFIRM" ? "success" :
                                                            reference?.status === "REJECT" ? "error" : "default"}>{reference?.status}</Button>
                                        </Stack>
                                    </td>
                                    <td style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}>
                                        {
                                            reference?.status === "CONFIRM" ?
                                                <PdfNewChange id={reference?.id}/>
                                                :
                                                <Stack direction="row" justifyContent="center" width={"100%"}>
                                                    <Button
                                                        disabled={reference?.status !== "CONFIRM"}
                                                        variant="outlined" size="small"
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            padding: "10px",
                                                            cursor: "not-allowed"
                                                        }}
                                                    >
                                                        <BsDownload/>
                                                    </Button>
                                                </Stack>
                                        }
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </Bodybox>
                    {references.length === 0 && <Box>
                        <EmptyDataImg w={200} h={180}/>
                    </Box>}
                </CardContent>
            </Card>

          {/*  <PdfPracticeLetter/>*/}

            <NoticePageForStudent/>



            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <CloseBtn>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Apply
                        </Typography>
                        <IconButton onClick={handleClose} aria-label="close" size="medium">
                            <CgClose/>
                        </IconButton>
                    </CloseBtn>

                    <Box>
                        <form onSubmit={save}>
                            <FormControl sx={{mt: 3}} required fullWidth>
                                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={obj.type}
                                    label="Type"
                                    onChange={(e) => setObj(prev => ({...prev, type: e.target.value}))}
                                >
                                    {
                                        types?.map((type, index) => (
                                            <MenuItem
                                                disabled={references.some(item => item.type === type && item.status === "CONFIRM")}
                                                key={index}
                                                value={type}>{type}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>

                            <TextField
                                sx={{mt: 3}}
                                fullWidth
                                required
                                value={obj.description}
                                onChange={(e) => setObj(prevState => ({...prevState, description: e.target.value}))}
                                id="description"
                                label="Description"
                                multiline
                                rows={2}
                            />
                            <Stack sx={{mt: 3}} direction="row" spacing={3} justifyContent="end">
                                <Button variant="outlined" type='reset' onClick={handleClose}>cancel</Button>
                                <Button variant="contained" type='submit'>save</Button>
                            </Stack>
                        </form>
                    </Box>

                </Box>
            </Modal>

        </>
    );
};

const Bodybox = styled.div`
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
    }

`;
const CloseBtn = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: center;
`
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#fff',
    boxShadow: 24,
    p: 3,
    borderRadius: 1,
};

export default StudentServiceReference;
