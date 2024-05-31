import React, {useEffect, useRef, useState} from 'react';
import styled from "styled-components";
import axios from "axios";
import {BASE_URL, getHeaders, mainColor} from "../../utills/ServiceUrls";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {Card, CardContent, Stack, TextField} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {AiFillDelete} from "react-icons/ai";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {FaUser, FaUserPlus} from "react-icons/fa";
import Modal from "@mui/material/Modal";
import {IoClose} from "react-icons/io5";
import {toast} from "react-toastify";
import {extrasmall} from "../../responsiv";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";

const AssistantUsers = () => {
    const columns = [
        {
            field: 'count',
            headerName: '№',
            sortable: true,
            width: 50,
            align: 'center',
            justifyContent: 'center',
        },
        {
            minWidth: 250,
            flex: 1,
            field: 'fullName',
            headerName: 'Full name',
            sortable: true,
            align: 'center',
            justifyContent: 'center'
        },
        {
            minWidth: 250,
            flex: 0.5,
            field: 'action',
            headerName: 'Action',
            sortable: true,
            align: 'center',
            justifyContent: 'center',
            renderCell: (cellValue) => {
                return <Stack direction={"row"} spacing={2} justifyContent="center">
                    <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => handleOpenDelete(cellValue.row.id)}
                    >
                        <AiFillDelete/>
                    </IconButton>
                </Stack>
            }
        },


    ]
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const {headers} = getHeaders()
    const [createUserModal, setCreateUserModal] = useState(false)
    const [autocompleteValue, setAutocompleteValue] = useState(null);
    const [autocompleteInputValue, setAutocompleteInputValue] = useState('');
    const [options, setOptions] = useState([])
    const [deleteId, setDeleteId] = useState(null)
    const [openDelete, setOpenDelete] = useState(false)
    const cancelTokenSourceRef = useRef(null);
    const [roleName, setRoleName] = useState('ROLE_MONITORING_ASSISTANT')
    const handleOpen = () => {
        setCreateUserModal(true)
    }
    const handleClose = () => {
        setCreateUserModal(false)
    }
    const getUsersData = () => {
        setIsLoading(true)
        axios.get(BASE_URL + '/dataOfLastActive/getAssistants', {headers})
            .then(res => {
                console.log(res.data.obj)
                setUsers(res.data.obj?.map((item, index) => ({...item, count: index + 1})))
            })
            .catch(err => console.log(err))
            .finally(() => {
                setIsLoading(false)
            })
    }
    const fetchUserOptions = async (inputValue) => {

        const newCancelTokenSource = axios.CancelToken.source();
        cancelTokenSourceRef.current = newCancelTokenSource;

        const delayDebounceFn = setTimeout(() => {
            if (inputValue.length >= 4) {
                axios.get(`${BASE_URL}/user/getUserForTeacherSavingSearch?keyword=${inputValue}`, {
                    headers,
                    cancelToken: newCancelTokenSource.token,
                })
                    .then((response) => {
                        const userData = response.data.obj;
                        setOptions(userData);
                    })
                    .catch((err) => {
                        if (axios.isCancel(err)) {
                            console.log('Request canceled:', err.message);
                        } else {
                            console.error(err);
                        }
                    });
            }
        }, 300);

        return () => {
            if (newCancelTokenSource) {
                newCancelTokenSource.cancel('Operation canceled due to component unmount.');
            }
            clearTimeout(delayDebounceFn);
        };
    };
    const handleOpenDelete = (id) => {
        setDeleteId(id);
        setOpenDelete(true);
    }
    const handleDelete = () => {
        deleteId && axios.delete(BASE_URL + '/dataOfLastActive/deleteAssistant/' + deleteId, {headers})
            .then(res => {
                console.log(res.data)
                toast.success('Deleted assistant')
                getUsersData()
                setOpenDelete(false)
            })
            .catch(err => {
                console.log(err)
                toast.error('Error')
            })
    }

    useEffect(() => {
        getUsersData()
    }, []);
    const handleAddUser = () => {
        if (autocompleteValue) {
            const body = {
                userId: autocompleteValue.value,
                roleName,
            }
            console.log(body)
            axios.post(`${BASE_URL}/dataOfLastActive/createAssistant`, body, {headers})
                .then((res) => {
                    console.log(res);
                    toast.success('Add user');
                    getUsersData();
                    setAutocompleteValue(null)
                })
                .catch((err) => {
                    console.log(err);
                    toast.error('Error adding user');
                });
        }

        setCreateUserModal(false);
    };
    const handleCloseDelete = () => {
        setDeleteId(null);
        setOpenDelete(false);
    }
    return (
        <Container>
            <Title>
                <FaUser size={23}/>
                <h1>Assistants</h1>
            </Title>
            <Card sx={{mt:2}}>
                <CardContent>
                    <Box sx={{display: 'flex', justifyContent: 'end', mb: 2}}>
                        <Button
                            onClick={handleOpen}
                            variant={'contained'}
                            color={'success'}
                            endIcon={<FaUserPlus/>}>
                            Add User
                        </Button>
                    </Box>
                    <DataGrid
                        columns={columns}
                        rows={users || []}
                        loading={isLoading}
                        components={{Toolbar: GridToolbar}}
                        rowsPerPageOptions={[10, 30, 50, 70, 100]}
                        autoHeight
                        initialState={{ // hide items
                            columns: {
                                columnVisibilityModel: {
                                    action: false,
                                },
                            },
                        }}
                    />
                </CardContent>
            </Card>

            {/*Modal add user*/}
            <Modal
                open={createUserModal}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={styleAddUser} component={styleAddSm}>
                    <ModalTitle>
                        <h4> Add user</h4>
                        <CloseBtnModal onClick={handleClose}> <IoClose size={22}/></CloseBtnModal>
                    </ModalTitle>
                    <Box>
                        <Box sx={{
                            marginY: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                        }}>
                            <Autocomplete
                                value={autocompleteValue}
                                fullWidth
                                onChange={(event, newValue) => {
                                    setAutocompleteValue(newValue);
                                }}
                                inputValue={autocompleteInputValue}
                                onInputChange={(event, newInputValue) => {
                                    setAutocompleteInputValue(newInputValue);
                                    fetchUserOptions(newInputValue);
                                }}
                                id="user-autocomplete"
                                options={options || []}
                                getOptionLabel={(option) => option?.label}
                                getOptionSelected={(option, value) => option?.value === value?.value}
                                renderInput={(params) => <TextField {...params} label="Select User"/>}
                            />
                            <TextField
                                size={'small'}
                                label={'Role'}
                                fullWidth
                                value={roleName}
                                onChange={(e) => setRoleName(e.target.value)}
                                disabled/>
                        </Box>

                        <Stack direction="row" spacing={2} justifyContent="flex-end"
                               alignItems="center">
                            <Button variant="outlined" onClick={handleClose}>Cancel</Button>
                            <Button variant="contained" onClick={handleAddUser}>
                                save
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Modal>

            {/*modal delete*/}
            <Modal
                open={openDelete}
                onClose={handleCloseDelete}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} component={style2}>
                    <ModalTitle>
                        <h5>
                            Delete
                        </h5>
                        <CloseBtnModal onClick={handleCloseDelete}> <IoClose size={22}/></CloseBtnModal>
                    </ModalTitle>
                    <Box>
                        <Stack sx={{height: "100px"}} direction="row" justifyContent="center" alignItems="center">
                            <Typography variant="h6" color="black">
                                Do you want to delete !
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing={2} justifyContent="flex-end"
                               alignItems="center">
                            <Button variant="outlined" onClick={handleCloseDelete}>Cancel</Button>
                            <Button variant="contained" color="error" onClick={handleDelete}>
                                Ok
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Modal>

        </Container>
    );
};

const style2 = styled.div`
    ${extrasmall({
        width: "95% !important",
    })}
`
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    padding: "15px",
    borderRadius: "8px",
};
const ModalTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    h4 {
        color: black;
    }

    h5 {
        color: red;
    }

`
const styleAddSm = styled.div`
    ${extrasmall({
        width: "97% !important"
    })}
`
const styleAddUser = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    padding: "15px",
    borderRadius: "8px",
};
const CloseBtnModal = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
    border-radius: 50%;
    border: none;
    background-color: ${mainColor};
    color: white;
    font-size: 12px;
`
const Title = styled.div`
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 5px;
    color: ${mainColor};

    h1 {
        font-size: 22px;
    }
`

const Container = styled.div`
    width: 100%;
    padding: 1rem;

    .MuiDataGrid-columnHeaderTitleContainer {
        justify-content: center;
    }
`;
export default AssistantUsers;