import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import axios from "axios";
import {toast} from "react-toastify";
import makeAnimated from "react-select/animated";
import Spinner from "../../spinner/Spinner";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {FaSave} from "react-icons/fa";
import {FiEdit} from "react-icons/fi";
import {BsTrash} from "react-icons/bs";
import {RiCloseLine} from "react-icons/ri";
import {extrasmall, medium, small} from "../../../responsiv";
import {motion as m} from "framer-motion";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete, {createFilterOptions} from "@mui/material/Autocomplete";
import Modal from "@mui/material/Modal";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Button from "@mui/material/Button";
import {Card, CardContent} from "@mui/material";


const icon = <CheckBoxOutlineBlankIcon fontSize="small"/>;
const checkedIcon = <CheckBoxIcon fontSize="small"/>;

const KafedraRoleSettings = () => {

    const [spinner, setSpinner] = useState(false);
    const [kafedras, setKafedras] = useState([]);
    const [userOption, setUserOption] = useState([]);
    const [open, setOpen] = useState(false);
    const [rolesOption, setRolesOption] = useState([]);
    const [positionsOption, setPositionsOption] = useState([]);
    const [updateKafedra, setUpdateKafedra] = useState({
        id: null,
        nameEn: null,
        nameRu: null,
        nameUz: null,
        owner: null,
        room: null,
        phone: null,
        roles: [],
        positions: [],
    })
    const [owner, setOwner] = useState(null);


    const columnsKafedras = [
        {
            field: 'count',
            headerName: '№',
            width: 40,
            align: 'center',
            editable: false
        },
        {
            field: 'nameEn',
            headerName: 'English name',
            flex: 1,
            minWidth: 300,
            editable: false,
        },
        {
            field: 'nameUz',
            headerName: 'O`zbekcha nomi',
            flex: 1,
            minWidth: 300,
            editable: false,
        },
        {
            field: 'nameRu',
            headerName: 'Русское имя',
            flex: 1,
            minWidth: 300,
            editable: false,
        },
        {
            field: 'owner',
            headerName: 'Head of the department',
            flex: 1,
            minWidth: 250,
            editable: false,
            renderCell: (cellValues) => {
                return (
                    <div>
                        {cellValues?.row?.owner?.label}
                    </div>
                );
            }
        },

        {
            field: 'positions',
            headerName: 'Positions',
            flex: 0.5,
            minWidth: 200,
            editable: false,
        },
        {
            field: 'roles',
            headerName: 'Roles',
            flex: 0.5,
            minWidth: 200,
            editable: false,
        },
        {
            field: 'room',
            headerName: 'Room',
            flex: 0.5,
            minWidth: 100,
            align: 'center',
            editable: false,
        },
        {
            field: 'phone',
            headerName: 'Phone',
            flex: 0.5,
            minWidth: 150,
            align: 'center',
            editable: false,
        },
        {
            field: 'service',
            headerName: 'Service',
            flex: 0.3,
            minWidth: 100,
            editable: false,
            renderCell: (cellValues) => {
                return (
                    <Wrapper2>
                        <BtnEditPosition
                            onClick={() => handleOpenEdit(cellValues?.row?.id)}><FiEdit/></BtnEditPosition>
                        <BtnEditPosition2
                            onClick={() => handleDeleted(cellValues?.row?.id, cellValues?.row?.nameEn)}><BsTrash/></BtnEditPosition2>
                    </Wrapper2>
                );
            }
        },
    ];

    const {headers} = getHeaders();

    useEffect(() => {
        fetchData()
        fetchKafedras();
    }, [])

    const fetchKafedras = () => {
        axios.get(BASE_URL + "/kafedra/allKafedra", {headers})
            .then(res => {
                setKafedras(res?.data?.obj?.map((item, index) => ({...item, count: index + 1})))
                setSpinner(false)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const fetchData = () => {
        axios.get(BASE_URL + "/dekanat/getDatasForSavedKafedraMudiri")
            .then(res => {

                setUserOption(res?.data?.obj?.users)
                setRolesOption(res?.data?.obj?.roles)
                setPositionsOption(res?.data?.obj?.positions)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handleDeleted = (id, name) => {
        console.log(id, "deleted")

        setUpdateKafedra({
            id: null,
            nameEn: null,
            nameRu: null,
            nameUz: null,
            owner: null,
            room: null,
            phone: null,
            roles: [],
            positions: [],
        });

        if (window.confirm(`Do you want to delete ${name}?`)) {
            axios.delete(`${BASE_URL}/kafedra/deleteKafedra/${id}`, {headers})
                .then(res => {
                    setKafedras(kafedras?.filter(i => i?.id !== id))
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


    const handleSearch = (e) => {
        if (e.length > 4) {
            axios.get(BASE_URL + "/user/getUsersForUserRole?keyword=" + e, {headers})
                .then(res => {
                    const resData = res.data?.obj
                    const uniqueArray = resData.reduce((acc, current) => {
                        const x = acc.find((item) =>
                            item.label === current.label
                        );

                        if (!x) {
                            return acc.concat([current]);
                        } else {
                            return acc;
                        }
                    }, []);
                    setUserOption(uniqueArray)
                })
                .catch(err => {
                    console.log(err);
                })

        } else {
            setUserOption([])
        }
    }
    console.log(userOption)

    const handleClose = () => {
        setOpen(false);
    }

    const handleOpenEdit = (id) => {
        setOpen(true);
        console.log(id, "edited")

        axios.get(`${BASE_URL}/kafedra/getKafedraV3ById?id=${id}`, {headers})
            .then(res => {
                console.log(res?.data, " <---- ")
                setOwner(res?.data?.obj?.owner);
                setUpdateKafedra(prevState => ({
                        ...prevState,
                        id: res?.data?.obj?.id,
                        nameEn: res?.data?.obj?.nameEn,
                        nameRu: res?.data?.obj?.nameRu,
                        nameUz: res?.data?.obj?.nameUz,
                        owner: res?.data?.obj?.owner,
                        ownerId: res?.data?.obj?.owner?.value,
                        room: res?.data?.obj?.room,
                        phone: res?.data?.obj?.phone,
                        roles: res?.data?.obj?.roles,
                        positions: res?.data?.obj?.positions
                    })
                )

            })
            .catch(err => {
                console.log(err)
            })

    }


    useEffect(() => {
        spinner && fetchKafedras()
    }, [spinner])




    const handleChangeValue = (e) => {
        setUpdateKafedra(prev => ({...prev, [e.target.name]: e.target.value}));
    };


    const onSaveKafedra = (kafedra) => {
        delete kafedra.owner
        delete kafedra.id
        console.log(kafedra, " for save kafedra")
        // console.log({...kafedra,id: null}," for save kafedra")

        Object.values(kafedra).every(
            value => value !== null && value
        )
            ?
            axios.post(BASE_URL + "/kafedra/createKafedraV2", {...kafedra, id: null}, {headers})
                .then(res => {
                    setOpen(false)
                    fetchKafedras();
                    toast.success(`${kafedra?.name} kafedra has been saved successfully!.`)
                })
                .catch(err => {
                    console.log(err)
                    toast.error(err?.response?.data?.message);
                })
            : toast.warning("Empty any field..");
    }

    const onUpdateKafedra = (kafedra) => {
        delete kafedra.owner
        console.log(kafedra, "edit kafedra")

        Object.values(kafedra).every(
            value => value !== null && value
        )
            ?
            axios.post(BASE_URL + "/kafedra/createKafedraV2", kafedra, {headers})
                .then(res => {
                    setOpen(false)
                    fetchKafedras();
                    toast.success("Updated kafedra successfully!.")
                })
                .catch(err => {
                    console.log(err)
                })
            : toast.warning("Empty any field..");

    }
    const filterOptions = createFilterOptions({
        stringify: (option) => option.label + option.login
    });

    return (
        <Container>
            <Box display={'flex'} justifyContent={'end'}>
                <Button sx={{width: "220px"}} variant={'contained'} onClick={() => {
                    setOwner(null);
                    setUpdateKafedra({
                        id: null,
                        nameEn: null,
                        nameRu: null,
                        nameUz: null,
                        owner: null,
                        room: null,
                        phone: null,
                        roles: [],
                        positions: [],
                    });
                    setOpen(true)
                }}> Add new department</Button>
            </Box>


            {spinner && kafedras?.length > 0 ? <Spinner/> : (
                <Card>
                    <CardContent>
                        <DataGrid
                            columns={columnsKafedras}
                            rows={kafedras}
                            components={{Toolbar: GridToolbar}}
                            autoHeight
                            rowsPerPageOptions={[10, 20, 30, 40, 50, 100]}
                            initialState={{
                                columns: {
                                    columnVisibilityModel: {
                                        nameRu: false,
                                        nameUz: false,
                                        positions:false,
                                        roles:false,
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


            {/*** ================= add or update kafedra =================== ***/}
            <Modal
                open={open}
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
                    <h3 style={{color: `${mainColor}`}}>{(updateKafedra?.id === null || !updateKafedra?.id) ? "Create new kafedra" : "Update kafedra"}</h3>


                    <WrapperScroll>
                        <TextField id="outlined-basic" label="English name" variant="outlined"
                                   value={updateKafedra?.nameEn}
                                   name={"nameEn"}
                                   onChange={handleChangeValue}
                        />
                        <TextField id="outlined-basic" label="Русское имя" variant="outlined"
                                   value={updateKafedra?.nameRu}
                                   name={"nameRu"}
                                   onChange={handleChangeValue}
                        />
                        <TextField id="outlined-basic" label="O`zbekcha nomi" variant="outlined"
                                   value={updateKafedra?.nameUz}
                                   name={"nameUz"}
                                   onChange={handleChangeValue}
                        />
                        <Autocomplete
                            id="checkboxes-tags-demo"
                            options={userOption}
                            onFocus={() => setUserOption([])}
                            getOptionLabel={(option) => option?.label}
                            value={owner}
                            filterOptions={filterOptions}
                            onChange={(event, newValue) => {
                                console.log(newValue, "new value")
                                setOwner(newValue)
                                setUpdateKafedra((prev) => ({...prev, ownerId: newValue?.value}));
                            }}
                            onInputChange={(event, newInputValue) => {
                                 handleSearch(newInputValue)
                            }}
                            isOptionEqualToValue={(option, value) => option.value === value.value}
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
                                <TextField {...params} label="Owner" placeholder="Owner"/>
                            )}
                        />
                        <TextField id="outlined-basic" label="Room" variant="outlined"
                                   value={updateKafedra?.room}
                                   name={"room"}
                                   onChange={handleChangeValue}
                        />

                        <TextField id="outlined-basic" label="Phone" variant="outlined"
                                   value={updateKafedra?.phone}
                                   name={"phone"}
                                   onChange={handleChangeValue}
                        />
                        <Autocomplete
                            multiple
                            id="checkboxes-tags-demo"
                            options={rolesOption}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option}
                            value={updateKafedra?.roles}
                            onChange={(event, newValue) => {
                                setUpdateKafedra((prev) => ({...prev, roles: newValue}));
                            }}
                            renderOption={(props, option, {selected}) => (
                                <li {...props}>
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        style={{marginRight: 8}}
                                        checked={selected}
                                    />
                                    {option}
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField {...params} label="Roles" placeholder="Roles"/>
                            )}
                        />

                        <Autocomplete
                            multiple
                            id="checkboxes-tags-demo"
                            options={positionsOption}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option}
                            value={updateKafedra?.positions}
                            onChange={(event, newValue) => {
                                setUpdateKafedra((prev) => ({...prev, positions: newValue}));
                            }}
                            renderOption={(props, option, {selected}) => (
                                <li {...props}>
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        style={{marginRight: 8}}
                                        checked={selected}
                                    />
                                    {option}
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField {...params} label="Positions" placeholder="Positions"/>
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
                            variant="contained"
                            endIcon={(updateKafedra?.id === null || !updateKafedra?.id) ? <FaSave/> : <FiEdit/>}
                            onClick={() => (updateKafedra?.id === null || !updateKafedra?.id) ? onSaveKafedra(updateKafedra) : onUpdateKafedra(updateKafedra)}
                        >{(updateKafedra?.id === null || !updateKafedra?.id) ? " Save" : "Update"}</Button>

                    </Box>
                </Box>

            </Modal>
            {/*** ================= add or update kafedra =================== ***/}


        </Container>
    );
};


const WrapperScroll = styled.div`
    height: 250px;
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
    width: "80vw",
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
        height: "97vh !important"
    })}
    ${small({
        width: "97vw !important",
        height: "97vh !important"
    })}
    ${extrasmall({
        width: "97vw !important",
        height: "97vh !important"
    })}
`

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


export default KafedraRoleSettings;