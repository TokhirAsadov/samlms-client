import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {ADMIN, BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import Spinner from "../../spinner/Spinner";
import Modal from '@mui/material/Modal';
import {RiCloseLine} from "react-icons/ri";
import Box from "@mui/material/Box";
import FormForItem from "../../form/FormForItem";
import axios from "axios";
import {toast} from "react-toastify";
import {extrasmall} from "../../../responsiv";
import ButtonMui from "@mui/material/Button";
import {MdAddHome} from "react-icons/md";
import {FaEdit, FaList, FaTrash} from "react-icons/fa";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 365,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

const Rooms = () => {
    const [spinner, setSpinner] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [data, setData] = useState([])
    const {headers} = getHeaders();
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [updateItem, setUpdateItem] = useState({})

    const columns = [
        {
            field: 'count',
            headerName: '№',
            width: 40,
            align: 'center',
            justifyContent: 'center',
            editable: false},
        {
            field: 'name',
            headerName: 'Name',
            width: 300,
            align: 'center',
            justifyContent: 'center',
            editable: false,},
        {
            field: 'actions',
            headerName: 'Actions',
            width: 240,
            align: 'center',
            justifyContent: 'center',
            editable: false,
            renderCell: (cellValues) => {
                return (
                    <Wrapper>
                        <ButtonMui
                            startIcon={<FaEdit size={17} />}
                            size={'small'}
                            variant="contained"
                            onClick={(e) => {
                                e.preventDefault();
                                getUpdateItem(cellValues.id);
                            }}
                        >

                            Update
                        </ButtonMui>

                        <ButtonMui
                            startIcon={<FaTrash size={17}/>}
                            size={'small'}
                            variant="contained"
                            color="error"
                            onClick={(e) => {
                                e.preventDefault();
                                checkDelete(cellValues.id);
                            }}
                        >

                            Delete
                        </ButtonMui>
                    </Wrapper>
                );
            }
        },
    ];


    const saveRoom = (form) => {

        axios.post(BASE_URL + ADMIN.ROOM_SAVE, form, {headers})
            .then(response => {
                toast.success("Room success saved");
                getAllRooms();
            })
            .catch(err => {
                console.log(err);
                toast.error(err.message);
            });

    }


    const addModalOpen = () => {
        setUpdateItem({...updateItem, id: null, name: null})
        handleOpen();
    }

    const checkDelete = (id) => {
        axios.get(BASE_URL + ADMIN.ROOM_GET_ELEMENT_BY_ID + id, {headers})
            .then(res => {
                if (res.status === 200) {
                    if (window.confirm("Do you agree to delete " + res.data?.obj?.name + " room?")) {
                        onDelete(id);
                    }
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    const onDelete = (id) => {
        axios.delete(BASE_URL + ADMIN.ROOM_DELETE + id, {headers})
            .then(res => {
                if (res.status === 204) {
                    toast.success("Deleted room successfully!...")
                    setData(data.filter(item => item.id !== id));
                    getAllRooms();
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    const getUpdateItem = (id) => {
        axios.get(BASE_URL + ADMIN.ROOM_GET_ELEMENT_BY_ID + id, {headers})
            .then(res => {
                setUpdateItem(res.data.obj);
                if (res.data?.obj !== null) {
                    handleOpen();
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    const onUpdate = (room) => {
        axios.put(BASE_URL + ADMIN.ROOM_UPDATE, room, {headers})
            .then(res => {
                if (res.status === 202) toast.success("Room updated successfully!...")
                getAllRooms();
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        getAllRooms()
    }, [])

    const getAllRooms = () => {
        setSpinner(true)
        axios.get(BASE_URL + ADMIN.ALL_ROOMS, {headers})
            .then(res => {
                let resData = res.data.obj.sort((a, b) => a.name > b.name ? 1 : -1)?.map((item,index)=>({...item,count:index+1}));
                setData(resData);
            })
            .catch(err => {
                console.log(err)
            })
            .finally(()=>{
                setSpinner(false);
            })
    }


    return (
        <Container>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    <CloseButtonForChild onClick={handleClose}><RiCloseLine/></CloseButtonForChild>
                    <FormForItem
                        title={updateItem?.id !== null ? "UPDATE ROOM" : "ADD ROOM"}
                        formArr={[
                            {
                                label: "add room",
                                name: "name",
                                placeholder: "Enter name of room",
                                type: "text"
                            }
                        ]}
                        submitBtn={updateItem?.id !== null ? "Update" : "Save"}
                        updateItem={updateItem}
                        onSubmit={(form) => updateItem?.id !== null ? onUpdate(form) : saveRoom(form)}
                    />
                </Box>
            </Modal>
            <TitleMain>
                <p><FaList /> Table of Rooms</p>
                <ButtonMui
                    variant={'contained'}
                    color={'success'}
                    endIcon={<MdAddHome/>}
                    onClick={addModalOpen}> Add Room</ButtonMui></TitleMain>
            <Body>
                {
                     <DataGrid
                        style={{width: "500px!important", minHeight: "300px!important"}}
                        columns={columns}
                        loading={spinner}
                        rows={data}
                        components={{Toolbar: GridToolbar}}
                        autoHeight
                        rowsPerPageOptions={[25,50,75,100]}
                        initialState={{
                            columns: {
                                columnVisibilityModel: {
                                    id: false,
                                    login: false,
                                    card: false,
                                    passport: false
                                },
                            },
                            pagination: {
                                pageSize: 25,
                            },
                        }}
                    />
                }
            </Body>
        </Container>
    );
};

const CloseButtonForChild = styled.button`
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    color: ${mainColor};
    font-size: 26px;
    border: none;
    position: absolute;
    top: 10px;
    right: 10px;
`;

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    gap: 10px;
    margin: 5px !important;
`;




const Body = styled.div`
    margin-top: 1rem;
    width: 100%;
    background-color: #fff;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const TitleMain = styled.h1`
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    p {
        color: ${mainColor};
        font-size: 25px;
        font-weight: bold;

        ${extrasmall({
            textAlign: "start",
            fontSize: "15px",
        })}

    }
`;

const Container = styled.div`
    padding: 1rem;
    .MuiDataGrid-columnHeaderTitleContainer {
        justify-content: center;
    }
`;


export default Rooms;