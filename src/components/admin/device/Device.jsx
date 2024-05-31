import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {ADMIN, BASE_URL, getHeaders, mainColor,} from "../../../utills/ServiceUrls";
import axios from "axios";
import {toast} from "react-toastify";
import Spinner from "../../spinner/Spinner";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {RiCloseLine} from "react-icons/ri";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import {Select} from "@mui/material";
import {FaEdit} from "react-icons/fa";
import {MdDelete} from "react-icons/md";
import ButtonMui from "@mui/material/Button";

const Device = () => {
    const [device, setDevice] = useState("");
    const [deviceId, setDeviceId] = useState(1);
    const [devices, setDevices] = useState([]);
    const [port, setPort] = useState(1);
    const [ports, setPorts] = useState([]);
    const [building, setBuilding] = useState("");
    const [buildings, setBuildings] = useState([]);
    const [room, setRoom] = useState("");
    const [rooms, setRooms] = useState([]);

    const [acRoom, setAcRoom] = useState({
        deviceId,
        doorName: room,
        doorNo: port
    })

    const [spinner, setSpinner] = useState(false);

    const columns = [
        {
            field: 'count',
            headerName: '№',
            width: 40,
            align: 'center',
            editable: false
        },
        {
            field: 'ip',
            headerName: 'Device',
            minWidth: 300,
            flex:1,
            align: 'center',
            editable: false,
        },
        {
            field: 'port',
            headerName: 'Port',
            minWidth: 180,
            flex:1,
            align: 'center',
            editable: false,
        },
        {
            field: 'room',
            headerName: 'Room',
            minWidth: 140,
            flex:1,
            align: 'center',
            editable: false,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            minWidth: 240,
            flex:1,
            align: 'center',
            editable: false,
            renderCell: (cellValues) => {
                return (
                    <Wrapper>
                        <ButtonMui
                            size={'small'}
                            variant="contained"
                            startIcon={<FaEdit size={17}/>}
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
                            color={'error'}
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
    const [updateItem, setUpdateItem] = useState({})
    const [updatePorts, setUpdatePorts] = useState([])
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    const {headers} = getHeaders();

    useEffect(() => {
        setAcRoom({...acRoom, deviceId: deviceId, doorName: room, doorNo: port})
    }, [deviceId, port, room])

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        setDeviceId(devices[0]?.id);
        devices[0] && axios.get(BASE_URL + ADMIN.ACC_DOOR_PORTS + devices[0]?.id, {headers})
            .then(res => {
                setPorts(res?.data?.obj);
            })
            .catch(err => {
                console.log(err)
            })
    }, [devices])

    useEffect(() => {
        const check = devices.filter(i => i?.ip === device)[0]?.id;
        setDeviceId(check);
        check && axios.get(BASE_URL + ADMIN.ACC_DOOR_PORTS + check, {headers})
            .then(res => {
                setPorts(res?.data?.obj);
            })
            .catch(err => {
                console.log(err)
            })
    }, [device])

    const fetchData = () => {
        axios.get(BASE_URL + ADMIN.DEVICE, {headers})
            .then(res => {
                setDevices(res?.data?.devices);
                setBuildings(res?.data?.buildings);
                setRooms(res?.data?.rooms);
                setRoom(res?.data?.rooms[0]?.name);
                setData(res?.data?.deviceList?.map((item, index) => ({...item, count: index + 1})));
            })
            .catch(err => {
                console.log(err);
            })
    }

    const fetchPortsForUpdateDevice = (id) => {
        axios.get(BASE_URL + ADMIN.ACC_DOOR_PORTS + id, {headers})
            .then(res => {
                setUpdatePorts(prevState => [...prevState, ...res?.data?.obj]);
            })
            .catch(err => {
                console.log(err)
            })
    }

    const saveAcRoom = () => {
        axios.put(BASE_URL + ADMIN.ACC_DOOR_UPDATED, acRoom, {headers})
            .then(res => {
                fetchData();
                if (res.status === 200) {
                    toast.success("Changed successfully...")
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    const onUpdate = (obj) => {
        axios.put(BASE_URL + ADMIN.ACC_DOOR_UPDATED, obj, {headers})
            .then(res => {
                setOpen(false);
                fetchData();
                if (res.status === 200) {
                    toast.success("Changed successfully...")
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    const getUpdateItem = (id) => {
        handleOpen()
        setUpdateItem(data.find(i => i.id === id))
        setUpdatePorts([data?.find(i => i.id === id)?.port])
        fetchPortsForUpdateDevice(id);
    }

    const checkDelete = (id) => {
        axios.get(BASE_URL + "/ac-door/findById/" + id, {headers})
            .then(res => {
                if (res.status === 200) {
                    if (window.confirm("Do you agree to delete " + res.data?.obj?.doorName + " room?")) {
                        onDelete(id);
                    }
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    const onDelete = (id) => {
        console.log(id, "deleted id")
        axios.delete(BASE_URL + "/ac-door/delete/" + id, {headers})
            .then(res => {
                if (res.status === 204) {
                    toast.success("Deleted room successfully!...")
                    setData(data.filter(item => item.id !== id));
                    fetchData();
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <Container>
            <Title>Update Device</Title>
            <HeaderMenu>
                <Select1
                    id="device"
                    value={device}
                    onChange={(e) => setDevice(e.target.value)}
                >
                    <optgroup label="Devices">
                        {
                            devices?.map((item, key) => (
                                <option key={key} value={item.ip}>
                                    {item.ip}
                                </option>
                            ))
                        }
                    </optgroup>
                </Select1>
                <Select1
                    id="ip"
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                >
                    <optgroup label="Ports">
                        {
                            ports?.map((item, key) => (
                                <option key={key} value={item}>
                                    {item}
                                </option>
                            ))
                        }
                    </optgroup>
                </Select1>
                <Select1
                    id="building"
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                >
                    <optgroup label="Buildings">
                        {
                            buildings?.map((item, key) => (
                                <option key={key} value={item.name}>
                                    {item.name}
                                </option>
                            ))
                        }
                    </optgroup>
                </Select1>
                <Select1
                    id="room"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                >
                    <optgroup label="Rooms">
                        {
                            rooms?.map((item, key) => (
                                <option key={key} value={item.name}>
                                    {item.name}
                                </option>
                            ))
                        }
                    </optgroup>
                </Select1>
                <ButtonMui variant={'contained'} onClick={saveAcRoom}>Save</ButtonMui>
            </HeaderMenu>
            <Title mt={"20px"}>Table of Device</Title>
            <Body>
                {
                    spinner ? <Spinner/> : <DataGrid
                        columns={columns}
                        rows={data}
                        components={{Toolbar: GridToolbar}}
                        autoHeight
                        rowsPerPageOptions={[10,20,30,40,50,100]}
                        initialState={{
                            pagination:{
                                pageSize: 30,
                            }
                        }}
                    />
                }

                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="keep-mounted-modal-title"
                    aria-describedby="keep-mounted-modal-description"
                >
                    <Box sx={style}>
                        <CloseButtonForChild onClick={handleClose}><RiCloseLine/></CloseButtonForChild>
                        <Row>
                            <TextField
                                id={"outlined-basic"}
                                label="IP"
                                variant={"outlined"}
                                value={updateItem?.ip}
                                disabled={true}
                            />

                            <Box sx={{minWidth: 200}}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Port</InputLabel>
                                    <Select
                                        disabled={true}
                                        sx={{
                                            width: "200px",
                                            " @media only screen and  (max-width: 576px)": {width: 300}
                                        }}
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        name={"port"}
                                        value={updateItem?.port}
                                        label={"Port"}
                                        onChange={(e) => setUpdateItem(preForm => ({
                                            ...preForm,
                                            port: e?.target?.value
                                        }))}
                                    >
                                        {
                                            updatePorts?.map(item => (
                                                <MenuItem key={item} value={item}>{item}</MenuItem>))
                                        }
                                    </Select>
                                </FormControl>
                            </Box>

                            <Box sx={{minWidth: 200}}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Room</InputLabel>
                                    <Select
                                        sx={{
                                            width: "200px",
                                            " @media only screen and  (max-width: 576px)": {width: 300}
                                        }}
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        name={"room"}
                                        value={updateItem?.room}
                                        label={"Room"}
                                        onChange={(e) => setUpdateItem(preForm => ({
                                            ...preForm,
                                            room: e?.target?.value
                                        }))}
                                    >
                                        {
                                            [{name: updateItem?.room}, ...rooms]?.map(item => (
                                                <MenuItem key={item?.name} value={item?.name}>{item?.name}</MenuItem>))
                                        }
                                    </Select>

                                </FormControl>
                            </Box>
                        </Row>
                        <Row>

                            <UpdateButton onClick={() => onUpdate({
                                deviceId: updateItem?.deviceId,
                                doorName: updateItem?.room,
                                doorNo: updateItem?.port
                            })}>Update</UpdateButton>
                        </Row>
                    </Box>
                </Modal>

            </Body>
        </Container>
    );
};

const UpdateButton = styled.button`
    width: 120px;
    height: 50px;
    background: ${mainColor};
    font-size: 18px;
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid ${mainColor};
    color: #fff;
    transition: all 0.2s ease;
    margin-left: 15px !important;
    letter-spacing: 1.2px;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

    &:focus {
        transform: scale(0.95);
    }
`

const Row = styled.div`
    padding: 20px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 25px;
`

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

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};


const Wrapper = styled.div`
    width: 100%;
    display: flex;
    gap: 10px;
   justify-content: center;
`;


const Body = styled.div`
    width: 100%;
    background-color: #fff;
    border-radius: 10px;
    display: flex;
    align-items: center;
`;


const Title = styled.h3`
    display: flex;
    width: 100%;
    float: left;
    margin-left: 15px;
    margin-top: ${props => props.mt};
    color: ${mainColor};
`;

const Button = styled.button`
    margin-top: 20px;
    width: 100px;
    height: 35px;
    background: ${mainColor};
    padding-left: 5px;
    font-size: 18px;
    padding-right: 10px;
    border-radius: 10px;
    cursor: pointer;
    border: 1px solid ${mainColor};
    color: #fff;
    transition: all 0.2s ease;
    margin-left: 15px !important;
    letter-spacing: 1.2px;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

    &:focus {
        transform: scale(0.95);
    }
`;

const HeaderMenu = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 8px !important;
`;

const Select1 = styled.select`
    width:150px;
    background: white;
   padding: 5px;
    font-size: 18px;
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid ${mainColor};
    color: ${mainColor};

    &:focus {
        outline: none;
    }

    option {
        color: black;
        background: white;
        font-weight: 300;
        display: flex;
        white-space: pre;
        min-height: 20px;
        padding: 0px 2px 1px;
    }

`;

const Container = styled.div`
    padding: 1rem;

    .MuiDataGrid-columnHeaderTitleContainer {
        justify-content: center;
    }
`;

export default Device;