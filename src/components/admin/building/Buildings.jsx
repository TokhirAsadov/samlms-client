import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {ADMIN, BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import Spinner from "../../spinner/Spinner";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import {RiCloseLine} from "react-icons/ri";
import FormForItem from "../../form/FormForItem";
import Modal from "@mui/material/Modal";
import axios from "axios";
import {toast} from "react-toastify";
import ButtonMui from "@mui/material/Button";
import {BsBuildingAdd} from "react-icons/bs";
import {FaEdit, FaListUl} from "react-icons/fa";
import {MdDelete} from "react-icons/md";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 365,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
};

const Buildings = () => {

    const [spinner, setSpinner] = useState(true);
    const [updateItem, setUpdateItem] = useState({})

    const columns = [
        {
            field: 'count',
            headerName: '№',
            width: 40,
            align:'center',
            editable: false
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 300,
            align:'center',
            editable: false,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 240,
            align:'center',
            editable: false,
            renderCell: (cellValues) => {
                return (
                    <Wrapper>
                        <ButtonMui
                            size={'small'}
                            startIcon={<FaEdit size={17}/>}
                            variant="contained"
                            onClick={(e) => {
                                e.preventDefault();
                                getUpdateItem(cellValues.id);
                            }}
                        >
                            Update
                        </ButtonMui>

                        <ButtonMui
                            size={'small'}
                            startIcon={<MdDelete size={17}/>}
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
    const [data, setData] = useState([])

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
    }
    const {headers} = getHeaders();

    const addModalOpen = () => {
        setUpdateItem({...updateItem, id: null, name: null})
        handleOpen();
    }

    const saveBuilding = (form) => {
        if (form?.id === "") {
            form.id = null
        }

        axios.post(BASE_URL + ADMIN.BUILDING_SAVE, form, {headers})
            .then(response => {
                toast.success("Building success saved");
                getAllBuildings();
            })
            .catch(err => {
                console.log(err);
                toast.error(err.message);
            });
    }


    const checkDelete = (id) => {
        axios.get(BASE_URL + ADMIN.BUILDING_GET_ELEMENT_BY_ID + id, {headers})
            .then(res => {
                if (res.status === 200) {
                    if (window.confirm("Do you agree to delete " + res.data?.obj?.name + " building?")) {
                        onDelete(id);
                    }
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    const onDelete = (id) => {
        axios.delete(BASE_URL + ADMIN.BUILDING_DELETE + id, {headers})
            .then(res => {
                if (res.status === 204) {
                    toast.success("Deleted building successfully!...")
                    setData(data.filter(item => item.id !== id));
                    getAllBuildings();
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    const getUpdateItem = (id) => {
        axios.get(BASE_URL + ADMIN.BUILDING_GET_ELEMENT_BY_ID + id, {headers})
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

    const onUpdate = (building) => {
        axios.put(BASE_URL + ADMIN.BUILDING_UPDATE, building, {headers})
            .then(res => {
                if (res.status === 202) toast.success("Building updated successfully!...")
                getAllBuildings();
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        getAllBuildings()
    }, [])

    const getAllBuildings = () => {
        axios.get(BASE_URL + ADMIN.ALL_BUILDINGS, {headers})
            .then(res => {
                const resData = res.data.obj?.sort((a, b) => a?.name > b?.name ? 1 : -1)?.map((item,index)=>({...item,count:index+1}));
                setSpinner(false);
                setData(resData);
            })
            .catch(err => {
                console.log(err)
            })
    }


    return (
        <Container>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <Title><FaListUl size={22}/> Table of Buildings</Title>
                <ButtonMui
                    sx={{
                        margin: '0 0 0 auto',
                    }}
                    variant={'contained'}
                    color={'success'}
                    onClick={addModalOpen}
                    endIcon={<BsBuildingAdd/>}
                > Add Building</ButtonMui>
            </Box>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    <CloseButtonForChild onClick={handleClose}><RiCloseLine/></CloseButtonForChild>
                    <FormForItem
                        title={updateItem?.id !== null ? "UPDATE BUILDING" : "ADD BUILDING"}
                        formArr={[
                            {
                                label: "id",
                                name: "id",
                                placeholder: "Enter id of build",
                                type: "text",
                            },
                            {
                                label: "add build",
                                name: "name",
                                placeholder: "Enter name of build",
                                type: "text",
                            }
                        ]}
                        submitBtn={updateItem?.id !== null ? "Update" : "Save"}
                        onSubmit={(form) => updateItem?.id !== null ? onUpdate(form) : saveBuilding(form)}
                        updateItem={updateItem}
                    />
                </Box>
            </Modal>
            <Body>
                {
                    spinner ? <Spinner/> : <DataGrid
                        columns={columns}
                        rows={data}
                        components={{Toolbar: GridToolbar}}
                        autoHeight
                        rowsPerPageOptions={[10,20,30]}
                        initialState={{
                            pagination: {
                                pageSize: 10,
                            }
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


const Button = styled.button`
    margin-top: 5px;
    float: ${props => props.float};
    width: ${props => props.width ? props.width : "100%"};
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: #ffffff;
    gap: 10px;
    background-color: ${props => props.bg};
    padding: ${props => props.padding ? props.padding : "5px 10px"};
    font-size: 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: 1.2px;

    &:focus {
        transform: scale(0.95);
    }
`;

const Body = styled.div`
    width: 100%;
    background-color: #fff;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Title = styled.h3`
    margin: 10px 15px 20px;
    color: ${mainColor};
`;

const Container = styled.div`
    padding: 1rem;
    .MuiDataGrid-columnHeaderTitleContainer {
        justify-content: center;
    }
`;


export default Buildings;