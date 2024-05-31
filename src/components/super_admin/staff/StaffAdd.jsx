import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import axios from "axios";
import {toast} from "react-toastify";
import {FiEdit} from "react-icons/fi";
import {BsTrash} from "react-icons/bs";
import Spinner from "../../spinner/Spinner";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {RiCloseLine} from "react-icons/ri";
import TextField from "@mui/material/TextField";
import Autocomplete, {createFilterOptions} from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import {motion as m} from "framer-motion";
import {extrasmall, medium, small} from "../../../responsiv";
import {FaSave} from "react-icons/fa";
import Button from "@mui/material/Button";
import ButtonMui from "@mui/material/Button";
import {Card, CardContent} from "@mui/material";


const icon = <CheckBoxOutlineBlankIcon fontSize="small"/>;
const checkedIcon = <CheckBoxIcon fontSize="small"/>;

const StaffAdd = () => {

    const [spinner, setSpinner] = useState(true);
    const [owner, setOwner] = useState(null);
    const [roles, setRoles] = useState([]);
    const [sections, setSections] = useState([]);
    const [userOptions, setUserOptions] = useState([]);

    const [spinnerKafedra, setSpinnerKafedra] = useState(false);
    const [kafedras, setKafedras] = useState([]);

    const [save, setSave] = useState(false);
    const [edit, setEdit] = useState(false);
    const [rolesOption, setRolesOption] = useState([]);
    const [positionsOption, setPositionsOption] = useState([]);
    const [updateSection, setUpdateSection] = useState({
        id: null,
        name: null,
        owner: null,
        room: null,
        phone: null,
        roles: [],
        positions: [],
    })

    const {headers} = getHeaders();


    const handleSearch = (e) => {
        if (e.length > 4) {

            axios.get(BASE_URL + "/user/getUsersForUserRole?keyword=" + e, {headers})
                .then(res => {
                    const resData = res?.data?.obj
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
                    console.log(uniqueArray)
                    setUserOptions(uniqueArray)
                })
                .catch(err => {
                    console.log(err);
                })
        } else {
            setUserOptions([])
        }
    }


    useEffect(() => {
        axios.get(BASE_URL + "/user/getDataForStaffSaving", {headers})
            .then(res => {
                setRoles(res.data?.roles?.map(i => {
                    i.label = i.label.startsWith("ROLE_") ? i.label.substring(5) : i.label;

                    return i;
                }));
                setSections(res.data?.sections);
                setSpinner(false);

                setRolesOption(res?.data?.roles2)
                setPositionsOption(res?.data?.positions)
            })
            .catch(err => {
                console.log(err)
            })

        fetchSections();

    }, [])


    const fetchSections = () => {
        axios.get(BASE_URL + "/section/allSections", {headers})
            .then(res => {
                console.log(res?.data, "sections")
                setKafedras(res?.data?.obj?.map((item, index) => ({...item, count: index + 1})))
                setSpinnerKafedra(false)
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        spinnerKafedra && fetchSections()
    }, [spinnerKafedra])


    const columnsSection = [
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
            minWidth: 250,
            editable: false,
        },
        {
            field: 'owner',
            headerName: 'Department head',
            flex: 1,
            minWidth: 300,
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
            field: 'positions',
            headerName: 'Positions',
            flex: 0.8,
            minWidth: 300,
            editable: false,
            renderCell: (cellValues) => {
                return cellValues?.row?.positions?.map((item, index) => (
                    <div key={index}>
                        {item?.userPositionName},&nbsp;
                    </div>
                ))
            }
        },
        {
            field: 'room',
            headerName: 'Room',
            flex: 0.4,
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
                            onClick={() => handleDeleted(cellValues?.row?.id, cellValues?.row?.name)}><BsTrash/></BtnEditPosition2>
                    </Wrapper2>
                );
            }
        },
    ];


    const handleOpenEdit = (id) => {
        console.log(id, "edited")
        console.log(owner, 'owner')
        axios.get(BASE_URL + "/section/getSectionById?id=" + id, {headers})
            .then(res => {
                console.log(res?.data)
                setOwner(res?.data?.obj?.owner);
                setUpdateSection(prevState => ({
                        ...prevState,
                        id: res?.data?.obj?.id,
                        name: res?.data?.obj?.name,
                        owner: res?.data?.obj?.owner,
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
        setSave(false)
        setEdit(true);
    }

    const handleChangeValue = (e) => {
        setUpdateSection(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleClose = () => {
        setSave(false);
        setEdit(false);
    }

    const handleDeleted = (id, name) => {

        // setKafedras([])
        setUpdateSection({
            id: null,
            name: null,
            owner: null,
            room: null,
            phone: null,
            roles: [],
            positions: [],
        });
        setOwner(null)

        if (window.confirm(`Do you want to delete ${name}?`)) {
            axios.delete(`${BASE_URL}/section/deleteSection/${id}`, {headers})
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

    const editSection = (section) => {

        const {id, name, owner, phone, positions, roles} = section;
        const ownerId = owner.value;

        const body = {
            id,
            name,
            ownerId,
            phone,
            positions,
            roles
        };

        console.log(body, 'booody')
        Object.values(section).every(
            value => value !== null && value
        )
            ?
            axios.post(BASE_URL + "/section/createSectionV2", body, {headers})
                .then(res => {
                    setEdit(false)
                    fetchSections();
                    toast.success(`${section?.name} section has been updated successfully!.`)
                })
                .catch(err => {
                    console.log(err)
                    toast.error(err?.response?.data?.message);
                })
            : toast.warning("Empty any field..");
    }

    const saveSection = (section) => {
        delete section.owner
        delete section.id
        console.log(section, " for save section")
        // console.log({...section,id: null}," for save section")

        Object.values(section).every(
            value => value !== null && value
        )
            ?
            axios.post(BASE_URL + "/section/createSectionV2", section, {headers})
                .then(res => {
                    setSave(false)
                    fetchSections();
                    toast.success(`${section?.name} section has been saved successfully!.`)
                })
                .catch(err => {
                    console.log(err)
                    toast.error(err?.response?.data?.message);
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
                    setUpdateSection({
                        id: null,
                        name: null,
                        owner: null,
                        room: null,
                        phone: null,
                        roles: [],
                        positions: [],
                    });
                    setEdit(false)
                    setSave(true)
                }}>Add new section</Button>
            </Box>

            {spinnerKafedra && kafedras?.length > 0 ? <Spinner/> : (
                <Card>
                    <CardContent>
                        <DataGrid
                            columns={columnsSection}
                            rows={kafedras}
                            components={{Toolbar: GridToolbar}}
                            rowsPerPageOptions={[10, 20, 30, 40, 50, 100]}
                            autoHeight
                            initialState={{
                                columns: {
                                    columnVisibilityModel: {
                                        positions: false,
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

            {/*** ================= add  staff =================== ***/}
            <Modal
                open={save}
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
                    <h3 style={{color: `${mainColor}`}}>Create new section</h3>


                    <WrapperScroll>

                        <TextField id="outlined-basic" label="Name" variant="outlined"
                                   value={updateSection?.name}
                                   name={"name"}
                                   onChange={handleChangeValue}
                        />

                        <Autocomplete
                            id="checkboxes-tags-demo"
                            options={userOptions}
                            onFocus={() => setUserOptions([])}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option?.label}
                            value={owner}
                            filterOptions={filterOptions}
                            onChange={(event, newValue) => {
                                console.log(newValue, "new value")
                                setOwner(newValue)
                                setUpdateSection((prev) => ({...prev, ownerId: newValue?.value}));
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
                                   value={updateSection?.room}
                                   name={"room"}
                                   onChange={handleChangeValue}
                        />

                        <TextField sx={{minWidth: "200px"}} id="outlined-basic" label="Phone" variant="outlined"
                                   value={updateSection?.phone}
                                   name={"phone"}
                                   onChange={handleChangeValue}
                        />

                        <Autocomplete
                            multiple
                            id="checkboxes-tags-demo"
                            options={rolesOption}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option}
                            value={updateSection?.roles}
                            onChange={(event, newValue) => {
                                setUpdateSection((prev) => ({...prev, roles: newValue}));
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
                            value={updateSection?.positions}
                            onChange={(event, newValue) => {
                                setUpdateSection((prev) => ({...prev, positions: newValue}));
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
                        <ButtonMui
                            size={"large"}
                            variant={'contained'}
                            endIcon={<FaSave/>}
                            onClick={() => saveSection(updateSection)}
                        > Save</ButtonMui>
                    </Box>

                </Box>
            </Modal>
            {/*** ================= add  staff =================== ***/}


            {/*** ================= edit staff =================== ***/}
            <Modal
                open={edit}
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
                    <h3 style={{color: `${mainColor}`}}>Edit section</h3>


                    <WrapperScroll>

                        <TextField id="outlined-basic" label="Name" variant="outlined"
                                   value={updateSection?.name}
                                   name={"name"}
                                   onChange={handleChangeValue}
                        />


                        <Autocomplete
                            id="checkboxes-tags-demo"
                            options={userOptions}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option?.label}
                            value={owner}
                            onChange={(event, newValue) => {
                                console.log(newValue, "new value")
                                setOwner(newValue)
                                setUpdateSection((prev) => ({...prev, ownerId: newValue?.value}));
                            }}

                            // inputValue={inputValue}
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
                                   value={updateSection?.room}
                                   name={"room"}
                                   onChange={handleChangeValue}
                        />

                        <TextField id="outlined-basic" label="Phone" variant="outlined"
                                   value={updateSection?.phone}
                                   name={"phone"}
                                   onChange={handleChangeValue}
                        />

                        <Autocomplete
                            multiple
                            id="checkboxes-tags-demo"
                            options={rolesOption}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option}
                            value={updateSection?.roles}
                            onChange={(event, newValue) => {
                                setUpdateSection((prev) => ({...prev, roles: newValue}));
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
                            value={updateSection?.positions}
                            onChange={(event, newValue) => {
                                setUpdateSection((prev) => ({...prev, positions: newValue}));
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
                        <ButtonMui
                            size={"large"}
                            variant={'contained'}
                            endIcon={<FaSave/>}
                            onClick={() => editSection(updateSection)}
                        > Update</ButtonMui>
                    </Box>

                </Box>
            </Modal>
            {/*** ================= edit staff =================== ***/}
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
    width: "1000px",
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

export default StaffAdd;