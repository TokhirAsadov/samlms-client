import React, {useState, useEffect} from 'react';
import styled from "styled-components";
import {extrasmall, medium, small} from "../../../responsiv";
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import Spinner from "../../spinner/Spinner";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import axios from "axios";
import {FiEdit} from "react-icons/fi";
import {BsTrash} from "react-icons/bs";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {RiCloseLine} from "react-icons/ri";
import TextField from "@mui/material/TextField";
import {FaSave} from "react-icons/fa";
import {motion as m} from "framer-motion";
import {toast} from "react-toastify";
import Button from "@mui/material/Button";
import {Card, CardContent} from "@mui/material";

const SchoolService = () => {

    const {headers} = getHeaders();
    const [spinner, setSpinner] = useState(false);
    const [schools, setSchools] = useState([]);
    const [openCreate, setOpenCreate] = useState(false);
    const [updateSchool, setUpdateSchool] = useState({
        id: null,
        code: null,
        nameEn: null,
        nameRu: null,
        nameUz: null,
    })

    const columnsSchool = [
        {
            field: 'count',
            headerName: '№',
            width: 40,
            align: 'center',
            editable: false
        },
        {
            field: 'code',
            headerName: 'Code',
            width: 60,
            align: 'center',
            editable: false,
        },
        {
            field: 'nameEn',
            headerName: 'Name English',
            flex:1,
            minWidth: 250,
            editable: false,
        },
        {
            field: 'nameRu',
            headerName: 'Русское имя',
            flex:1,
            minWidth: 250,
            editable: false,
        },
        {
            field: 'nameUz',
            headerName: 'O`zbekcha nomi',
            flex:1,
            minWidth: 250,
            editable: false,
        },
        {
            field: 'service',
            headerName: 'Service',
            flex:0.3,
            minWidth: 100,
            editable: false,
            renderCell: (cellValues) => {
                return (
                    <Wrapper2>

                        <BtnEditPosition
                            color={mainColor}
                            onClick={() => handleOpenEdit(cellValues?.row?.id)}
                        >
                            <FiEdit/>
                        </BtnEditPosition>

                        <BtnEditPosition
                            color={"red"}
                            onClick={() => onDeleted(cellValues?.row?.id, cellValues?.row?.nameEn)}
                        >
                            <BsTrash/>
                        </BtnEditPosition>

                    </Wrapper2>
                );
            }
        },
    ];

    const fetchSchools = () => {
        axios.get(BASE_URL + "/school/findAll", {headers})
            .then(res => {
                setSchools(res?.data?.obj?.map((item, index) => ({...item, count: index + 1})))
                setSpinner(false)
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        fetchSchools()
    }, [])

    useEffect(() => {
        spinner && fetchSchools()
    }, [spinner])

    const openCreateModal = () => {
        setOpenCreate(true);
        setUpdateSchool({
            id: null,
            code: null,
            nameEn: null,
            nameRu: null,
            nameUz: null,
        })
    }

    const handleClose = () => {
        setOpenCreate(false)
    }

    const handleChangeValue = (e) => {
        setUpdateSchool(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleOpenEdit = (id) => {
        schools?.length > 0 && setUpdateSchool(prevState => ({
            ...prevState,
            ...schools?.find(school => school?.id === id)
        }))
        setOpenCreate(true)
    }

    const onSaveSchool = (school) => {
        delete school.id


        Object.values(school).every(
            value => value !== null && value
        )
            ?
            axios.post(BASE_URL + "/school/save", {...school, id: null}, {headers})
                .then(res => {
                    setOpenCreate(false)
                    fetchSchools();
                    toast.success(`${school?.name} school has been saved successfully!.`)
                })
                .catch(err => {
                    console.log(err)
                    toast.error(err?.response?.data?.message);
                })
            : toast.warning("Empty any field..");
    }

    const onUpdateSchool = (school) => {
        Object.values(school).every(
            value => value !== null && value
        )
            ?
            axios.post(BASE_URL + "/school/save", school, {headers})
                .then(res => {
                    setOpenCreate(false)
                    fetchSchools();
                    toast.success(`${school?.name} school has been updated successfully!.`)
                })
                .catch(err => {
                    console.log(err)
                    toast.error(err?.response?.data?.message);
                })
            : toast.warning("Empty any field..");
    }

    const onDeleted = (id, name) => {
        // setSchools([])
        setUpdateSchool({
            id: null,
            code: null,
            nameEn: null,
            nameRu: null,
            nameUz: null,
        });

        if (window.confirm(`Do you want to delete ${name}?`)) {
            axios.delete(`${BASE_URL}/school/deleteById/${id}`, {headers})
                .then(res => {
                    setSchools(schools?.filter(i => i?.id !== id))
                    toast.success(res?.data?.message, {
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
                .catch(err => {
                    console.log(err)
                })
            toast.success("Deleted successfully", {
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
    }


    return (
        <Container>
            <Box display={'flex'} justifyContent={'end'}>
                <Button sx={{width: "220px"}} variant={'contained'}
                        onClick={openCreateModal}
                >Create School</Button>
            </Box>

            {spinner && schools?.length > 0 ? <Spinner/> : (
                <Card>
                    <CardContent>
                        <DataGrid
                            columns={columnsSchool}
                            rows={schools}
                            components={{Toolbar: GridToolbar}}
                            rowsPerPageOptions={[10, 20, 30, 40, 50, 100]}
                            autoHeight
                            initialState={{
                                pagination: {
                                    pageSize: 10,
                                }
                            }}
                        />
                    </CardContent>
                </Card>
            )}

            {/*** ================= add  school =================== ***/}
            <Modal
                open={openCreate}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={styleEdit} component={styledEdit2}>
                    <CloseMyButtonForChild onClick={handleClose}
                                           whileHover={{rotate: 180, scale: 1.1}}
                                           whileTap={{scale: 0.9}}
                                           transition={{duration: 0.3}}
                    ><RiCloseLine/></CloseMyButtonForChild>
                    <h3 style={{color: `${mainColor}`}}>{(updateSchool?.id === null || !updateSchool?.id) ? "Create new school" : "Update school"}</h3>


                    <WrapperScroll>

                        <TextField id="outlined-basic" label="English name" variant="outlined"
                                   value={updateSchool?.nameEn}
                                   name={"nameEn"}
                                   onChange={handleChangeValue}
                        />
                        <TextField id="outlined-basic" label="Русское имя" variant="outlined"
                                   value={updateSchool?.nameRu}
                                   name={"nameRu"}
                                   onChange={handleChangeValue}
                        />
                        <TextField id="outlined-basic" label="O`zbekcha nomi" variant="outlined"
                                   value={updateSchool?.nameUz}
                                   name={"nameUz"}
                                   onChange={handleChangeValue}
                        />
                        <TextField label="Code" variant="outlined"

                                   id="outlined-number"
                                   type="number"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}

                                   value={updateSchool?.code}
                                   name={"code"}
                                   onChange={handleChangeValue}
                        />
                    </WrapperScroll>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'end',
                        }}
                    >
                        <Button
                            variant={'contained'}
                            endIcon={(updateSchool?.id === null || !updateSchool?.id) ? <FaSave/> : <FiEdit/>}
                            onClick={() => (updateSchool?.id === null || !updateSchool?.id) ? onSaveSchool(updateSchool) : onUpdateSchool(updateSchool)}
                        >{(updateSchool?.id === null || !updateSchool?.id) ? " Save" : "Update"}</Button>

                    </Box>
                </Box>
            </Modal>
            {/*** ================= add  school =================== ***/}

        </Container>
    );
};


const WrapperScroll = styled.div`
    height: 155px;
    padding-top: 10px;
    display: grid;
    overflow-y: scroll;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    ${medium({
        height: '100%',
        gridTemplateColumns: '1fr',
        gap: '15px',
    })}
    ${small({
        height: '100%',
        gridTemplateColumns: '1fr',
        gap: '15px',
    })}
    ${extrasmall({
        height: '100%',
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
    width: "900px",
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 3,
    p: 4,
};

const styledEdit2 = styled.div`
    ${medium({
        width: "97vw !important",
        height: "70vh !important"
    })}
    ${small({
        width: "97vw !important",
        height: "70vh  !important"
    })}
    ${extrasmall({
        width: "97vw !important",
        height: "70vh  !important"
    })}
`

const BtnEditPosition = styled.button`
    width: 30px;
    height: 30px;
    background-color: #fff;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid ${props => props.color};
    border-radius: 0.5rem;
    color: ${props => props.color};
    padding: 5px !important;

    &:hover {
        transform: scale(1.1);
    }

`

const Wrapper2 = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin: 5px !important;
`;


const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 1rem;
    .MuiDataGrid-columnHeaderTitleContainer {
        justify-content: center;
    }
`;

export default SchoolService;