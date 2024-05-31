import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import axios from "axios";
import {FiEdit} from "react-icons/fi";
import {BsTrash} from "react-icons/bs";
import Spinner from "../../spinner/Spinner";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {RiCloseLine} from "react-icons/ri";
import TextField from "@mui/material/TextField";
import {FaSave} from "react-icons/fa";
import {motion as m} from "framer-motion";
import {extrasmall, medium, small} from "../../../responsiv";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import {toast} from "react-toastify";
import Button from "@mui/material/Button";
import {Card, CardContent} from "@mui/material";


const icon = <CheckBoxOutlineBlankIcon fontSize="small"/>;
const checkedIcon = <CheckBoxIcon fontSize="small"/>;

const FacultyService = () => {

    const {headers} = getHeaders();
    const [spinner, setSpinner] = useState(false);
    const [directions, setDirections] = useState([]);
    const [school, setSchool] = useState(null);
    const [schools, setSchools] = useState([]);
    const [openCreate, setOpenCreate] = useState(false);
    const [updateDirection, setUpdateDirection] = useState({
        id: null,
        name: null,
        shortName: null,
        schoolCode: null,
        school: null,
    })

    const columnsDirection = [
        {
            field: 'count',
            headerName: '№',
            width: 40,
            align: 'center',
            editable: false
        },
        {
            field: 'name',
            headerName: 'Name',
            flex:1,
            minWidth: 300,
            editable: false,
        },
        {
            field: 'shortName',
            headerName: 'Short name',
            flex:0.2,
            minWidth: 150,
            align: 'center',
            editable: false,
        },
        {
            field: 'school',
            headerName: 'School',
            flex:0.8,
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
                            onClick={() => handleOpenEdit(cellValues?.row?.id, cellValues?.row?.school)}
                        >
                            <FiEdit/>
                        </BtnEditPosition>

                        <BtnEditPosition
                            color={"red"}
                            onClick={() => onDeleted(cellValues?.row?.id, cellValues?.row?.name)}
                        >
                            <BsTrash/>
                        </BtnEditPosition>

                    </Wrapper2>
                );
            }
        },
    ];


    const openCreateModal = () => {
        setOpenCreate(true);
        setSchool(null);
        setUpdateDirection({
            id: null,
            name: null,
            shortName: null,
            schoolCode: null,
            school: null,
        });
    }

    const handleClose = () => {
        setOpenCreate(false)
    }

    const fetchSchools = () => {
        axios.get(BASE_URL + "/school/findAll", {headers})
            .then(res => {
                setSchools(res?.data?.obj?.map(i => ({label: i?.nameEn, value: i?.code})))
            })
            .catch(err => {
                console.log(err)
            })
    }

    const fetchDirections = () => {
        axios.get(BASE_URL + "/faculty/getDirectionsOfFaculty", {headers})
            .then(res => {
                setDirections(res?.data?.obj?.map((item, index) => ({...item, count: index + 1})))
                setSpinner(false)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handleChangeValue = (e) => {
        setUpdateDirection(prev => ({...prev, [e.target.name]: e.target.value}));
    };


    useEffect(() => {
        fetchSchools()
        fetchDirections();
    }, [])


    useEffect(() => {
        console.log(directions, "change directions")
        console.log(schools, "schools")
    }, [directions])

    useEffect(() => {
        console.log(updateDirection, "update directions")
    }, [updateDirection])

    useEffect(() => {
        spinner && fetchDirections()
    }, [spinner])


    const handleOpenEdit = (id, schoolName) => {
        schools?.length > 0 && setSchool(prevState => ({

            ...schools?.find(school => school?.label === schoolName)
        }))

        schools?.length > 0 && setUpdateDirection(prevState => ({

            ...directions?.find(direction => direction?.id === id),
            schoolCode: schools?.find(school => school?.label === schoolName)?.value
        }))

        setOpenCreate(true)
    }

    const onDeleted = (id, name) => {

        setUpdateDirection({
            id: null,
            shortName: null,
            schoolCode: null,
            school: null,
        });

        if (window.confirm(`Do you want to delete ${name}?`)) {
            axios.delete(`${BASE_URL}/faculty/deleteFaculty/${id}`, {headers})
                .then(res => {
                    setDirections(directions?.filter(i => i?.id !== id));
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

    const onSaveSchool = (direction) => {
        delete direction.id
        delete direction.school
        console.log(direction, " for save direction")


        Object.values(direction).every(
            value => value !== null && value
        )
            ?
            axios.post(BASE_URL + "/faculty/saveDirection", {...direction, id: null}, {headers})
                .then(res => {
                    setOpenCreate(false)
                    setSchool(null)
                    fetchDirections();
                    toast.success(`${direction?.name} direction has been saved successfully!.`)
                })
                .catch(err => {
                    console.log(err)
                    toast.error(err?.response?.data?.message);
                })
            : toast.warning("Empty any field..");
    }

    const onUpdateSchool = (direction) => {
        delete direction.school
        Object.values(direction).every(
            value => value !== null && value
        )
            ?
            axios.post(BASE_URL + "/faculty/saveDirection", direction, {headers})
                .then(res => {
                    setOpenCreate(false)
                    fetchDirections();
                    toast.success(`${direction?.name} direction has been updated successfully!.`)
                })
                .catch(err => {
                    console.log(err)
                    toast.error(err?.response?.data?.message);
                })
            : toast.warning("Empty any field..");
    }


    return (
        <Container>
            <Box display={'flex'} justifyContent={'end'}>
                <Button sx={{width: "220px"}} variant={'contained'}
                        onClick={openCreateModal}
                >Create new direction</Button>
            </Box>

            {spinner && directions?.length > 0 ? <Spinner/> : (
                <Card>
                    <CardContent>
                        <DataGrid
                            columns={columnsDirection}
                            rows={directions}
                            components={{Toolbar: GridToolbar}}
                            rowsPerPageOptions={[10, 20, 30, 40, 50, 100]}
                            autoHeight
                            initialState={{
                                columns: {
                                    columnVisibilityModel: {
                                        id: false,
                                    },
                                },
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
                    <h3 style={{color: `${mainColor}`}}>{(updateDirection?.id === null || !updateDirection?.id) ? "Create new direction" : "Update direction"}</h3>


                    <WrapperScroll>
                        <TextField id="outlined-basic" label="Name" variant="outlined"
                                   value={updateDirection?.name}
                                   name={"name"}
                                   onChange={handleChangeValue}
                        />
                        <TextField id="outlined-basic" label="Short name" variant="outlined"
                                   value={updateDirection?.shortName}
                                   name={"shortName"}
                                   onChange={handleChangeValue}
                        />
                        <Autocomplete
                            id="checkboxes-tags-demo"
                            options={schools}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option?.label}
                            value={school}
                            onChange={(event, newValue) => {
                                console.log(newValue, "new value")
                                setSchool(newValue)
                                setUpdateDirection((prev) => ({...prev, schoolCode: newValue?.value}));
                            }}
                            renderOption={(props, option, {selected}) => (
                                <li {...props}>
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        style={{marginRight: 8}}
                                        checked={selected}
                                    />
                                    {option?.label}
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField {...params} label="School" placeholder="School"/>
                            )}
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
                            endIcon={(updateDirection?.id === null || !updateDirection?.id) ? <FaSave/> : <FiEdit/>}
                            onClick={() => (updateDirection?.id === null || !updateDirection?.id) ? onSaveSchool(updateDirection) : onUpdateSchool(updateDirection)}
                        >{(updateDirection?.id === null || !updateDirection?.id) ? " Save" : "Update"}</Button>

                    </Box>
                </Box>
            </Modal>
            {/*** ================= add  school =================== ***/}


        </Container>
    );
};


const WrapperScroll = styled.div`
    height: 80px;
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
        height: "60vh !important"
    })}
    ${small({
        width: "97vw !important",
        height: "60vh !important"
    })}
    ${extrasmall({
        width: "97vw !important",
        height: "60vh !important"
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

export default FacultyService;