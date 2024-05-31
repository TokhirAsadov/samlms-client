import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import axios from "axios";
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import {toast} from "react-toastify";
import Spinner from "../../spinner/Spinner";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {FiEdit} from "react-icons/fi";
import {BsTrash} from "react-icons/bs";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {RiCloseLine} from "react-icons/ri";
import TextField from "@mui/material/TextField";
import Autocomplete, {createFilterOptions} from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import {motion as m} from "framer-motion";
import {extrasmall, medium, small} from "../../../responsiv";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import {FaSave} from "react-icons/fa";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from '@mui/material/Select';
import Button from "@mui/material/Button";
import {Card, CardContent} from "@mui/material";


const icon = <CheckBoxOutlineBlankIcon fontSize="small"/>;
const checkedIcon = <CheckBoxIcon fontSize="small"/>;

const CreateDekanat = () => {

    const [option, setOption] = useState([]);

    const [spinner, setSpinner] = useState(false);
    const [deans, setDeans] = useState([]);

    const [userOption, setUserOption] = useState([]);
    const [open, setOpen] = useState(false);
    const [facultiesOption, setFacultiesOption] = useState([]);
    const [rolesOption, setRolesOption] = useState([]);
    const [positionsOption, setPositionsOption] = useState([]);
    const [updateDekanat, setUpdateDekanat] = useState({
        id: null,
        name: null,
        owner: null,
        room: null,
        phone: null,
        eduType: null,
        facultiesName: [],
        roles: [],
        positions: [],
    })

    const [owner, setOwner] = useState(null);

    useEffect(() => {
        console.log(updateDekanat, "< - updateDekanat")
    }, [updateDekanat])

    useEffect(() => {
        spinner && fetchDeans()
    }, [spinner])

    const columnsDean = [
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
            flex: 1,
            minWidth: 300,
            editable: false,
        },
        {
            field: 'owner',
            headerName: 'Dean',
            type: 'string',
            flex: 1,
            minWidth: 350,
            editable: false,
            renderCell: (cellValues) => {
                return (
                    <div>
                        {cellValues?.row?.owner?.fullName}
                    </div>
                );
            }
        },
        {
            field: 'roles',
            headerName: 'Roles',
            flex: 0.8,
            minWidth: 300,
            editable: false,
            renderCell: (cellValues) => {
                return cellValues?.row?.owner?.authorities?.map((item, index) => (
                    <div key={index}>
                        {item?.roleName},&nbsp;
                    </div>
                ))
            }
        },
        {
            field: 'faculties',
            headerName: 'Faculties',
            flex: 0.8,
            align: 'left',
            minWidth: 300,
            editable: false,
            renderCell: (cellValues) => {
                return cellValues?.row?.faculties?.map((item, index) => (
                    <div key={index}>
                        {item?.shortName},&nbsp;
                    </div>
                ))
            }
        },
        {
            field: 'room',
            headerName: 'Room',
            flex: 0.2,
            minWidth: 110,
            align: 'center',
            editable: false,
        },
        {
            field: 'phone',
            headerName: 'Phone',
            flex: 0.2,
            minWidth: 200,
            align: 'center',
            editable: false,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'string',
            flex: 0.3,
            minWidth: 200,
            editable: false,
            renderCell: (cellValues) => {
                return (
                    <Wrapper2>
                        <BtnEditPosition
                            onClick={() => handleOpenEdit(cellValues?.row?.id)}><FiEdit/></BtnEditPosition>
                        <BtnEditPosition2
                            onClick={() => handleDeleted(cellValues?.row?.id, cellValues?.row?.name)}><BsTrash/></BtnEditPosition2>
                    </Wrapper2>
                );
            }
        },
    ];

    const {headers} = getHeaders();


    const handleDeleted = (id, name) => {
        console.log(id, "deleted")

        setUpdateDekanat({
            id: null,
            nameEn: null,
            nameRu: null,
            nameUz: null,
            owner: null,
            eduType: null,
            room: null,
            phone: null,
            roles: [],
            positions: [],
        });

        if (window.confirm(`Do you want to delete ${name}?`)) {
            axios.delete(`${BASE_URL}/dekanat/deleteById/${id}`, {headers})
                .then(res => {
                    console.log("-------------------------------------------------------")
                    setDeans(deans?.filter(i => i?.id !== id))
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

    const handleOpenEdit = (id) => {
        axios.get(BASE_URL + "/dekanat/getDekanatById?id=" + id, {headers})
            .then(res => {
                console.log(res?.data)
                setOwner(res?.data?.obj?.owner)
                setUpdateDekanat(prevState => ({
                        ...prevState,
                        id: res?.data?.obj?.id,
                        name: res?.data?.obj?.name,
                        owner: res?.data?.obj?.owner,
                        phone: res?.data?.obj?.phone,
                        room: res?.data?.obj?.room,
                        eduType: res?.data?.obj?.eduType,
                        facultiesName: res?.data?.obj?.facultiesName,
                        roles: res?.data?.obj?.roles,
                        positions: res?.data?.obj?.positions
                    })
                )
            })
        setOpen(true)
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


    useEffect(() => {
        axios.get(BASE_URL + "/faculty/getFacultyForDekanatSaved")
            .then(res => {
                setOption(res?.data?.obj);
                setFacultiesOption(res?.data?.obj?.map(i => i?.label))
                setRolesOption(res?.data?.secondObj?.roles)
                setPositionsOption(res?.data?.secondObj?.positions)
            })
            .catch(err => {
                console.log(err)
            })

        fetchDeans()

    }, [])

    const fetchDeans = () => {
        axios.get(BASE_URL + "/dekanat/all", {headers})
            .then(res => {
                console.log(res?.data, "dekanats")
                setDeans(res?.data?.obj?.map((item, index) => ({...item, count: index + 1})))
            })
            .catch(err => {
                console.log(err)
            })
    }


    const handleClose = () => {
        setOpen(false);
    }

    const handleChangeValue = (e) => {
        setUpdateDekanat(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const onSaveDean = (dean) => {
        delete dean.id
        console.log(dean, "save dean")

        Object.values(dean).every(
            value => value !== null && value
        )
            ?
            axios.post(BASE_URL + "/dekanat/saveV2", {...dean, id: null}, {headers})
                .then(res => {
                    setOpen(false)
                    fetchDeans();
                    toast.success(`${dean?.name} dean's office has been saved successfully!.`)
                })
                .catch(err => {
                    console.log(err)
                    toast.error(err?.response?.data?.message);
                })
            : toast.warning("Empty any field..");

    }


    const onUpdateDean = (dean) => {

        console.log(dean, "edit section")
        Object.values(dean).every(
            value => value !== null && value
        )
            ?
            axios.post(BASE_URL + "/dekanat/saveV2", dean, {headers})
                .then(res => {
                    setOpen(false)
                    fetchDeans();
                    toast.success("Updated dean successfully!.")
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
                    setUpdateDekanat({
                        id: null,
                        name: null,
                        owner: null,
                        room: null,
                        phone: null,
                        eduType: null,
                        facultiesName: [],
                        roles: [],
                        positions: [],
                    });
                    setOpen(true)
                }}>Add new dean's office</Button>
            </Box>

            {spinner && deans?.length > 0 ? <Spinner/> : (
                <Card>
                    <CardContent>
                        <DataGrid
                            columns={columnsDean}
                            rows={deans}
                            components={{Toolbar: GridToolbar}}
                            rowsPerPageOptions={[10, 20, 30, 40, 50, 100]}
                            autoHeight
                            initialState={{
                                columns: {
                                    columnVisibilityModel: {
                                        name: false,
                                        roles: false,
                                        actions: false,
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

            {/*** ================= edit staff =================== ***/}
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
                    <h3 style={{color: `${mainColor}`}}>{(updateDekanat?.id === null || !updateDekanat?.id) ? "Create new dean's office" : "Update dean's office"}</h3>


                    <WrapperScroll>
                        <TextField id="outlined-basic" label="Name" variant="outlined"
                                   value={updateDekanat?.name}
                                   name={"name"}
                                   onChange={handleChangeValue}
                        />
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Education Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={updateDekanat?.eduType}
                                name={"eduType"}
                                label="Education Type"
                                onChange={handleChangeValue}
                            >
                                <MenuItem value={"KUNDUZGI"}>KUNDUZGI</MenuItem>
                                <MenuItem value={"KECHKI"}>KECHKI</MenuItem>
                                <MenuItem value={"SIRTQI"}>SIRTQI</MenuItem>
                            </Select>
                        </FormControl>
                        <Autocomplete
                            id="checkboxes-tags-demo"
                            options={userOption}
                            disableCloseOnSelect
                            onFocus={() => setUserOption([])}
                            getOptionLabel={(option) => option?.label}
                            value={owner}
                            filterOptions={filterOptions}
                            onChange={(event, newValue) => {
                                setOwner(newValue)
                                setUpdateDekanat((prev) => ({...prev, owner: newValue}));
                            }}
                            onInputChange={(event, newInputValue) => {
                                event?.type === "change" && handleSearch(newInputValue)
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
                                <TextField {...params} label="Owner" placeholder="Owner"/>
                            )}
                        />
                        <TextField id="outlined-basic" label="Room" variant="outlined"
                                   value={updateDekanat?.room}
                                   name={"room"}
                                   onChange={handleChangeValue}
                        />
                        <TextField id="outlined-basic" label="Phone" variant="outlined"
                                   value={updateDekanat?.phone}
                                   name={"phone"}
                                   onChange={handleChangeValue}
                        />
                        <Autocomplete
                            multiple
                            id="checkboxes-tags-demo"
                            options={rolesOption}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option}
                            value={updateDekanat?.roles}
                            onChange={(event, newValue) => {
                                setUpdateDekanat((prev) => ({...prev, roles: newValue}));
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
                            value={updateDekanat?.positions}
                            onChange={(event, newValue) => {
                                setUpdateDekanat((prev) => ({...prev, positions: newValue}));
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
                        <Autocomplete
                            multiple
                            id="checkboxes-tags-demo"
                            options={facultiesOption}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option}
                            value={updateDekanat?.facultiesName}
                            onChange={(event, newValue) => {
                                setUpdateDekanat((prev) => ({...prev, facultiesName: newValue}));
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
                                <TextField {...params} label="Faculties" placeholder="Faculties"/>
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
                            endIcon={(updateDekanat?.id === null || !updateDekanat?.id) ? <FaSave/> :
                                <FiEdit/>}
                            onClick={() => (updateDekanat?.id === null || !updateDekanat?.id) ? onSaveDean(updateDekanat) : onUpdateDean(updateDekanat)}
                        >{(updateDekanat?.id === null || !updateDekanat?.id) ? " Save" : "Update"}</Button>

                    </Box>
                </Box>
            </Modal>
            {/*** ================= edit staff =================== ***/}

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
    })}`


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
export default CreateDekanat;