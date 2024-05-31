import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import Spinner from "../../spinner/Spinner";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import {FaSave, FaUserAlt} from "react-icons/fa";
import Button from "@mui/material/Button";
import moment from "moment";
import {FiEdit} from "react-icons/fi";
import {BsTrash} from "react-icons/bs";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {RiCloseLine} from "react-icons/ri";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import {motion as m} from "framer-motion";
import {toast} from "react-toastify";
import {fetchDekanGroups} from "../../../redux/actions/dekan/dekan_groups_actions";
import {useHttp} from "../../hook/useHttp";
import {extrasmall, small} from "../../../responsiv";
import {Card, CardContent} from "@mui/material";
import ButtonMui from "@mui/material/Button";

const DekanGroupsEdit = () => {

    const groups = useSelector(state => state?.dekanGroups?.dekanGroups);
    const load = useSelector(state => state?.dekanGroups?.dekanGroupsLoadingStatus);
    const [shortName, setShortName] = useState([]);
    const [types, setTypes] = useState([]);
    const [open, setOpen] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [edit, setEdit] = useState({
        id: '',
        name: '',
        language: '',
        type: '',
        form: '',
        faculty: ''
    });

    const handleChange = (e) => {
        setEdit(prev => ({...prev, [e.target.name]: e.target.value}));
    }


    const {headers} = getHeaders();

    const handleOpenEdit = (id) => {

        axios.get(BASE_URL + "/dekan/getFacultiesShortnamesWithDekanId", {headers})
            .then(res => {
                // console.log(res?.data,"**************************************")
                setShortName(res?.data?.shortNames);
                setTypes(res?.data?.educationTypes)
            })
            .catch(err => {
                console.log(err)
            })

        setEdit(prev => ({
            ...prev,
            id,
            name: groups.find(item => item.id === id).name,
            level: groups.find(item => item.id === id).level,
            type: groups.find(item => item.id === id).type,
            language: groups.find(item => item.id === id).language,
            form: groups.find(item => item.id === id).form,
            faculty: groups.find(item => item.id === id).faculty,
        }))

        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
        setOpenAdd(false);
    }
    const handleOpenAdd = () => {

        axios.get(BASE_URL + "/dekan/getFacultiesShortnamesWithDekanId", {headers})
            .then(res => {
                // console.log(res?.data,"**************************************")
                setShortName(res?.data?.shortNames);
                setTypes(res?.data?.educationTypes);
            })
            .catch(err => {
                console.log(err)
            })

        setEdit(prev => ({
            ...prev,
            name: '',
            level: '',
            type: '',
            language: '',
            form: '',
            faculty: '',
        }))

        setOpenAdd(true);

    }

    const handleDeleted = (id, name) => {

        axios.get(BASE_URL + `/group/changeActiveOfGroup/${id}`, {headers})
            .then(res => {


                toast.error(res?.data?.message, {
                    position: "top-right",
                    autoClose: false,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                })

                dispatch(fetchDekanGroups(request));

            })
            .catch(err => {
                console.log(err)
                toast.error(err?.response?.data?.message, {
                    position: "top-right",
                    autoClose: false,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                })
            })

    }

    const columns = [
        {
            field: 'count',
            headerName: '№',
            width: 40,
            align: 'center',
            justifyContent: 'center',
            editable: false
        },
        {
            field: 'name',
            headerName: 'Name',
            type: 'string',
            width: 150,
            align: 'center',
            justifyContent: 'center',
            editable: false
        },
        {
            field: 'level',
            headerName: 'Level',
            type: 'number',
            width: 100,
            align: 'center',
            justifyContent: 'center',
            editable: false
        },
        {
            field: 'language',
            headerName: 'Language',
            type: 'string',
            width: 150,
            align: 'center',
            justifyContent: 'center',
            editable: false,
        },
        {
            field: 'type',
            headerName: 'Type',
            type: 'string',
            width: 150,
            align: 'center',
            justifyContent: 'center',
            editable: false,
        },
        {
            field: 'form',
            headerName: 'Form',
            type: 'string',
            width: 200,
            align: 'center',
            justifyContent: 'center',
            editable: false,
        },
        {
            field: 'action', headerName: 'Action', type: 'string', width: 100, editable: false,
            renderCell: (cellValues) => {
                return (
                    <Wrapper2>
                        <BtnEditPosition onClick={() => handleOpenEdit(cellValues?.row?.id)}><FiEdit/></BtnEditPosition>
                        <BtnEditPosition2
                            onClick={() => handleDeleted(cellValues?.row?.id, cellValues?.row?.name)}><BsTrash/></BtnEditPosition2>
                    </Wrapper2>
                );
            }
        },
    ];

    const dispatch = useDispatch();
    const {request} = useHttp();

    const onEdit = () => {
        if (
            edit.name !== '' &&
            edit.name !== null &&
            edit.type !== '' &&
            edit.type !== null &&
            edit.form !== '' &&
            edit.form !== null &&
            edit.language !== '' &&
            edit.language !== null &&
            edit.faculty !== null &&
            edit.faculty !== ''
        ) {
            axios.put(BASE_URL + "/group/updateGroups", edit, {headers})
                .then(res => {
                    if (res?.data?.success) {
                        toast.success(res?.data?.message);
                    }
                    setEdit({
                        id: '',
                        name: '',
                        language: '',
                        type: '',
                        form: '',
                        faculty: ''
                    })
                    handleClose();
                    dispatch(fetchDekanGroups(request));
                })
                .catch(err => {
                    console.log(err);
                    if (!err?.response?.data?.success) {
                        toast.error(err?.response?.data?.message, {
                            position: "top-right",
                            autoClose: false,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "colored",
                        })
                    }
                })
        } else {
            toast.warning("Empty any fields..")
        }
    }
    const onSave = () => {

        if (types?.length !== 1) {
            if (
                edit.name !== '' &&
                edit.name !== null &&
                edit.type !== '' &&
                edit.type !== null &&
                edit.form !== '' &&
                edit.form !== null &&
                edit.language !== '' &&
                edit.language !== null &&
                edit.faculty !== null &&
                edit.faculty !== ''
            ) {
                axios.post(BASE_URL + "/group/createGroups", edit, {headers})
                    .then(res => {
                        if (res?.data?.success) {
                            toast.success(res?.data?.message);
                        }
                        setEdit({
                            id: '',
                            name: '',
                            language: '',
                            type: '',
                            form: '',
                            faculty: ''
                        })
                        handleClose();
                        dispatch(fetchDekanGroups(request));
                    })
                    .catch(err => {
                        console.log(err);
                        if (!err?.response?.data?.success) {
                            toast.error(err?.response?.data?.message);
                        }
                    })

            } else {
                toast.warning("Empty any fields..")
            }
        } else {
            if (
                edit.name !== '' &&
                edit.name !== null &&
                edit.form !== '' &&
                edit.form !== null &&
                edit.language !== '' &&
                edit.language !== null &&
                edit.faculty !== null &&
                edit.faculty !== ''
            ) {
                axios.post(BASE_URL + "/group/createGroups", {...edit, id: null, type: types[0]}, {headers})
                    .then(res => {
                        if (res?.data?.success) {
                            toast.success(res?.data?.message);
                        }
                        handleClose()
                        setEdit({
                            id: '',
                            name: '',
                            language: '',
                            type: '',
                            form: '',
                            faculty: ''
                        })
                        dispatch(fetchDekanGroups(request));
                    })
                    .catch(err => {
                        console.log(err);
                        if (!err?.response?.data?.success) {
                            toast.error(err?.response?.data?.message);
                        }
                    })

            } else {
                toast.warning("Empty any fields..")
            }
        }
    }


    useEffect(() => {
        dispatch(fetchDekanGroups(request));
    }, []);

    return (
        <Container>
            <Title>Groups <Button variant={'contained'} onClick={() => handleOpenAdd()}> Add New Group</Button></Title>
            <Card>
                <CardContent>
                    {load === 'done' && <DataGrid
                        style={{width: "500px!important", minHeight: "300px!important"}}
                        columns={columns}
                        rows={groups?.map((item,index)=>({...item,count: index+1}))}
                        components={{Toolbar: GridToolbar}}
                        autoHeight
                        pageSize={20}
                        initialState={{
                            ...groups?.initialState,
                            columns: {
                                columnVisibilityModel: {
                                    id: false,
                                    login: false,
                                    card: false,
                                    rfid: false,
                                    email: false,
                                    passport: false,
                                    action: false
                                },
                            },
                        }}
                    />}
                </CardContent>
            </Card>


            {/*** ================= edit group =================== ***/}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={styleEdit}>
                    <CloseMyButtonForChild onClick={handleClose}><RiCloseLine/></CloseMyButtonForChild>
                    <h3 style={{color: `${mainColor}`}}>{edit?.name}</h3>

                    <WrapInputs>
                        <TextField id="outlined-basic" label="Group Name"
                                   variant="outlined"
                                   value={edit?.name}
                                   name={"name"}
                                   onChange={handleChange}
                        />
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Course</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={edit?.level}
                                label="Course"
                                name={"level"}
                                onChange={handleChange}
                            >
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={4}>4</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Education Language</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={edit?.language}
                                label="Education Language"
                                name={"language"}
                                onChange={handleChange}
                            >
                                <MenuItem value={'UZBEK'}>UZBEK</MenuItem>
                                <MenuItem value={'RUSSIAN'}>RUSSIAN</MenuItem>
                                <MenuItem value={'ENGLISH'}>ENGLISH</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Education Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={edit?.type}
                                label="Education Type"
                                name={"type"}
                                onChange={handleChange}
                                disabled={types?.length === 1}
                            >
                                {
                                    types?.map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Education Form</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={edit?.form}
                                label="Education Form"
                                name={"form"}
                                onChange={handleChange}
                            >
                                <MenuItem value={'BACHELOR'}>BACHELOR</MenuItem>
                                <MenuItem value={'MASTER'}>MASTER</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Faculty</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={edit?.faculty}
                                label="Faculty"
                                name={"faculty"}
                                onChange={handleChange}
                            >
                                {
                                    shortName?.map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                    </WrapInputs>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'end',
                        }}
                    >
                        <ButtonMui
                            size={"large"}
                            variant={'contained'}
                            endIcon={<FaSave/>}
                            onClick={onEdit}>Update</ButtonMui>
                    </Box>

                </Box>
            </Modal>
            {/*** ================= edit group =================== ***/}


            {/*** ================= add group =================== ***/}
            <Modal
                open={openAdd}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={styleEdit}>
                    <CloseMyButtonForChild onClick={handleClose}><RiCloseLine/></CloseMyButtonForChild>
                    <h3 style={{color: `${mainColor}`}}>Create {edit?.name} group</h3>
                    <WrapInputs>

                        <TextField id="outlined-basic" label="Group Name"
                                   variant="outlined"
                                   value={edit?.name}
                                   name={"name"}
                                   onChange={handleChange}/>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Course</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={edit?.level}
                                label="Course"
                                name={"level"}
                                onChange={handleChange}
                            >
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={4}>4</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Education Language</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={edit?.language}
                                label="Education Language"
                                name={"language"}
                                onChange={handleChange}
                            >
                                <MenuItem value={'UZBEK'}>UZBEK</MenuItem>
                                <MenuItem value={'RUSSIAN'}>RUSSIAN</MenuItem>
                                <MenuItem value={'ENGLISH'}>ENGLISH</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Education Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={types?.length === 1 ? types[0] : edit?.type}
                                label="Education Type"
                                name={"type"}
                                onChange={handleChange}
                                disabled={types?.length === 1}
                            >
                                {
                                    types?.map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Education Form</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={edit?.form}
                                label="Education Form"
                                name={"form"}
                                onChange={handleChange}
                            >
                                <MenuItem value={'BACHELOR'}>BACHELOR</MenuItem>
                                <MenuItem value={'MASTER'}>MASTER</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Faculty</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={edit?.faculty}
                                label="Faculty"
                                name={"faculty"}
                                onChange={handleChange}
                            >
                                {
                                    shortName?.map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                    </WrapInputs>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'end',
                        }}
                    >
                        <ButtonMui
                            size={"large"}
                            variant={'contained'}
                            endIcon={<FaSave/>}
                            onClick={onSave}>Save</ButtonMui>
                    </Box>
                </Box>
            </Modal>
            {/*** ================= add group =================== ***/}


        </Container>
    );
};


const WrapInputs = styled.div`
    padding-top: 10px;
    display: grid;
    overflow-y: scroll;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    ${extrasmall({
        gridTemplateColumns: '1fr',
        gap: '15px',
    })}
`


const CloseMyButtonForChild = styled(m.button)`
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${mainColor};
    border-radius: 50%;
    color: white;
    font-size: 26px;
    border: none;
    position: absolute;
    top: 10px;
    right: 10px;
`;


const styleEdit = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "576px",
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 3,
    p: 4,
    ' @media only screen and  (max-width: 576px)': {
        width: "95vw !important",
        height: "95vh !important"
    }
};


const Wrapper2 = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin: 5px !important;
`;

const BtnEditPosition2 = styled.button`
    width: 30px;
    height: 30px;
    background-color: #fff;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid red;
    border-radius: 0.5rem;
    color: red;
    padding: 5px !important;

    &:hover {
        transform: scale(1.1);
    }

`

const BtnEditPosition = styled.button`
    width: 30px;
    height: 30px;
    background-color: #fff;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid ${mainColor};
    border-radius: 0.5rem;
    color: ${mainColor};
    padding: 5px !important;

    &:hover {
        transform: scale(1.1);
    }

`

const Title = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 30px;
    font-weight: bold;
    color: ${mainColor};

`


const Container = styled.div`
    display: flex;
    gap: 20px;
    flex-direction: column;
    height: 100%;
    min-height: 500px;
    border-radius: 10px;
    padding: 1rem;

    .MuiDataGrid-columnHeaderTitleContainer {
        justify-content: center;
    }
`;

export default DekanGroupsEdit;