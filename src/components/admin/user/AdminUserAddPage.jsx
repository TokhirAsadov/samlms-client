import React, {useEffect, useRef, useState} from 'react';
import styled from "styled-components";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {BASE_URL, getHeaders, mainColor, TOKEN, TokenType} from "../../../utills/ServiceUrls";
import axios from "axios";
import {toast} from "react-toastify";
import {AiOutlineCloudDownload, AiOutlineCloudUpload} from "react-icons/ai";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {USERINFO_BASE64} from "../../../utills/fileBase64";
import FileSaver from 'file-saver'
import {extrasmall, medium, small} from "../../../responsiv";
import Modal from "@mui/material/Modal";
import {RiCloseLine} from "react-icons/ri";
import {motion as m} from "framer-motion";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import SaveUserForm from "../../form/SaveUserForm";
import {useSelector} from "react-redux";
import ButtonMui from "@mui/material/Button";
import {BiSolidUserPlus} from "react-icons/bi";
import {FaEdit, FaTrash} from "react-icons/fa";
import UserInfoDataCard from "./userInfoDataCard";
import {ButtonGroup} from "@mui/material";

const AdminUserAddPage = () => {


    const [show, setShow] = useState(false);
    const [openBg, setOpenBg] = React.useState(false);
    const [spinner, setSpinner] = useState(false);
    const [open, setOpen] = useState(false);
    const {headers} = getHeaders();
    const [forData, setForData] = useState(null);
    const [search, setSearch] = useState("");
    const columns = [
        {
            field: 'count',
            headerName: '№',
            minWidth: 40,
            align: 'center',
            justifyContent: 'center',
            editable: false
        },
        {
            field: 'fullName',
            headerName: 'Full Name',
            minWidth: 300,
            flex: 1,
            align: 'left',
            justifyContent: 'start',
            editable: false,
        },
        {
            field: 'login',
            headerName: 'Login',
            minWidth: 100,
            flex: 0.6,
            align: 'center',
            justifyContent: 'center',
            editable: false,
        },
        {
            field: 'rfid',
            headerName: 'RFID',
            minWidth: 100,
            flex: 0.6,
            align: 'center',
            justifyContent: 'center',
            editable: false,
        },
        {
            field: 'passport',
            headerName: 'Passport',
            minWidth: 120,
            flex: 0.6,
            align: 'center',
            justifyContent: 'center',
            editable: false,
        },
        {
            field: 'password',
            headerName: 'Password',
            minWidth: 100,
            flex: 0.6,
            align: 'center',
            justifyContent: 'center',
            editable: false,
        },
        {
            field: 'gander',
            headerName: 'Gander',
            minWidth: 100,
            flex: 0.5,
            align: 'center',
            justifyContent: 'center',
            editable: false,
        },
        {
            field: 'roles',
            headerName: 'Roles',
            minWidth: 100,
            flex: 0.5,
            align: 'center',
            justifyContent: 'center',
            editable: false,
        },
        {
            field: 'action',
            headerName: 'Action',
            minWidth: 240,
            flex: 1,
            align: 'center',
            justifyContent: 'center',
            editable: false,
            renderCell: (cellValues) => {
                return (
                    <Wrapper2>
                        <Button
                            bg={"blue"}
                            variant="contained"
                            onClick={(e) => {
                                e.preventDefault();
                                getUpdateItem(cellValues.id);
                            }}
                        >
                            <FaEdit/>
                            Update
                        </Button>

                        <Button
                            bg={"red"}
                            variant="contained"
                            color="danger"
                            onClick={(e) => {
                                e.preventDefault();
                                handleDeleted(cellValues.id, cellValues?.row?.firstName, cellValues?.row?.lastName);
                            }}
                        >
                            <FaTrash/>
                            Delete
                        </Button>
                    </Wrapper2>
                );
            }
        },
    ];
    const [data, setData] = useState([])
    const [editUser, setEditUser] = useState({})
    const [edit, setEdit] = useState(false);
    const [newUserFile, setNewUserFile] = useState(null)
    const cancelTokenSourceRef = useRef(null);

    const user = useSelector(state => state?.user?.user);

    const getUpdateItem = (id) => {
        let item = data?.find(i => i?.id === id);
        setEditUser(prevState => ({
            ...prevState,
            id: item?.id,
            firstName: item?.firstName,
            lastName: item?.lastName,
            middleName: item?.middleName,
            login: item?.login,
            rfid: item?.rfid,
            passport: item?.passport,
            password: item?.password,
            gander: item?.ganderId === 1 ? "MALE" : "FEMALE",
            roles: item?.roles,
            positions: item?.positions,
            address: item?.address?.address,
            region: item?.address?.region,
            district: item?.address?.district,
        }))
        setEdit(true)
        console.log(item, "get item--------------------------------------")
    }

    const handleDeleted = (id, name, surename) => {

        if (window.confirm(`Do you want to delete ${surename} ${name}?`)) {
            axios.delete(`${BASE_URL}/user/deleteUser/${id}`, {headers})
                .then(res => {
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
            setSearch("")
            setData([])
        }

    }
    const savePhoto = () => {
       if(!newUserFile) return toast.warning('Empty')
        const url = BASE_URL + "/userinfo/uploadUserInfoAndUser";
        const formData = new FormData();
        formData.append('file', newUserFile);
        const token = localStorage.getItem(TOKEN)
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': TokenType + token,
                'Access-Control-Allow-Origin': '*'
            }
        }

        setOpen(true)
        setOpenBg(true);

        console.log(newUserFile)
        axios.post(url, formData, config)
            .then((response) => {
                toast.success(response?.data?.message)
                setOpenBg(false)
                setOpen(false)
                setNewUserFile(null)

            })
            .catch(err => {
                setOpenBg(false)
                setOpen(false)
                toast.error(err?.response?.data?.message)
            })



    }

    const downloadFileFromBase64 = () => {
        let dataFile = USERINFO_BASE64;
        let sliceSize = 1024;
        let byteCharacters = atob(dataFile);
        let bytesLength = byteCharacters.length;
        let slicesCount = Math.ceil(bytesLength / sliceSize);
        let byteArrays = new Array(slicesCount);
        for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
            let begin = sliceIndex * sliceSize;
            let end = Math.min(begin + sliceSize, bytesLength);
            let bytes = new Array(end - begin);
            for (var offset = begin, i = 0; offset < end; i++, offset++) {
                bytes[i] = byteCharacters[offset].charCodeAt(0);
            }
            byteArrays[sliceIndex] = new Uint8Array(bytes);
        }
        let blob = new Blob(byteArrays, {type: 'application/vnd.ms-excel'});
        FileSaver.saveAs(new Blob([blob], {}), "USERINFO.xlsx");
    }

    const handleClose = () => {
        setShow(false);
        setEdit(false);
    }


    const onUpdate = (form) => {
        Object.values(form).every(
            value => value !== null && value
        )
            ?
            axios.post(BASE_URL + "/admin/saveUser", {...form}, {headers})
                .then(res => {
                    setEdit(false);
                    toast.success(res?.data?.message);
                })
                .catch(err => {
                    toast.error(err?.response?.data?.message);
                })
            : toast.warning("Empty eny field..");


    }

    const onSave = (form) => {
        delete form['id'];
        console.log(Object.values(form).every(
            value => value !== null && value
        ), "valed")
        console.log({...form, id: null}, "submit form")

        Object.values(form).every(
            value => value !== null && value
        )
            ? axios.post(BASE_URL + "/admin/saveUser", {...form}, {headers})
                .then(res => {
                    // console.log(res,"save successfully")
                    setShow(false);
                    toast.success(res?.data?.message);
                })
                .catch(err => {
                    // console.log(err,"save error..........")
                    toast.error(err?.response?.data?.message);
                })
            : toast.warning("Empty eny field..");

    }


    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(e?.target?.value);
    }


    useEffect(() => {
        if (cancelTokenSourceRef.current) {
            cancelTokenSourceRef.current.cancel("Operation canceled due to new request.");
        }

        cancelTokenSourceRef.current = axios.CancelToken.source();

        if (search?.trim().length > 4) {
            setSpinner(true);
            axios.get(`${BASE_URL}/admin/param?param=${encodeURIComponent(search)}`, {
                cancelToken: cancelTokenSourceRef.current.token,
            })
                .then(res => {
                    setData(res?.data?.obj.map((item, index) => ({...item, count: index + 1})));
                })
                .catch(err => {
                    if (axios.isCancel(err)) {
                        console.log('Request canceled', err.message);
                    } else {
                        console.error(err);
                    }
                })
                .finally(() => {
                    setSpinner(false);
                });
        } else {
            setData([]);
        }
        return () => {
            if (cancelTokenSourceRef.current) {
                cancelTokenSourceRef.current.cancel("Component unmounted.");
            }
        };

    }, [search]);

    useEffect(() => {
        axios.get(BASE_URL + "/admin/userAdd?id=" + user?.id)
            .then(res => {
                setForData(res?.data)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    return (
        <Container>

            <Wrapper>
                <ButtonGroup
                    disableElevation
                    variant="contained"
                    aria-label="Disabled button group"
                >
                    <ButtonMui
                        variant={'outlined'}
                        component={'label'}
                    >
                        {newUserFile? newUserFile?.name : 'select users from file'}
                        <input
                            onChange={(e)=>setNewUserFile( e.target.files[0])}
                            type="file"
                            hidden
                            accept={"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}
                        />
                    </ButtonMui>
                    <ButtonMui
                        variant={'contained'}
                        component={'label'}
                        endIcon={<AiOutlineCloudUpload/>}
                        onClick={savePhoto}
                    >
                       save
                    </ButtonMui>
                </ButtonGroup>


                <ButtonMui
                    endIcon={<AiOutlineCloudDownload/>}
                    variant={'contained'}
                    onClick={() => downloadFileFromBase64()}>
                    Export userinfo from file example
                </ButtonMui>

                <ButtonMui
                    variant={'contained'}
                    color={'success'}
                    endIcon={<BiSolidUserPlus/>}
                    onClick={() => setShow(!show)}>
                    Create USER</ButtonMui>

            </Wrapper>

            <Row>

                <TextField
                    id={search?.length > 4 ? "outlined-basic" : "standard-error-helper-text"}
                    error={search?.length > 0 && search?.length < 5}
                    label="Search user.."
                    variant={"outlined"}
                    value={search}
                    sx={{
                        width: "250px",
                        marginBottom: "10px",
                        " @media only screen and  (max-width: 576px)": {width: 300}
                    }}
                    helperText={search?.length > 0 && search?.length < 5 && "Enter a word longer than 4"}
                    onChange={handleSearch}
                />
            </Row>

            <UserInfoDataCard/>

            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={openBg}
                // onClick={handleClose}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>

            {
                data?.length > 0 && <DataGrid
                    sx={{background: '#fff'}}
                    columns={columns}
                    rows={data}
                    loading={spinner}
                    components={{Toolbar: GridToolbar}}/*** print and excel ****/
                    autoHeight
                    rowsPerPageOptions={[25, 50, 75, 100]}
                    initialState={{
                        columns: {
                            columnVisibilityModel: {
                                id: false,
                                password: false,
                                gander: false,
                                roles: false,
                                action: false
                            },
                        },
                        pagination: {
                            pageSize: 50,
                        },
                    }}
                />
            }


            <Modal
                open={show}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >

                <Box sx={style} component={styleAdd}>
                    <CloseMyButtonForChild onClick={handleClose}
                                           whileHover={{rotate: 180, scale: 1.1}}
                                           whileTap={{scale: 0.9}}
                                           transition={{duration: 0.3}}
                    ><RiCloseLine/></CloseMyButtonForChild>

                    <SaveUserForm
                        title={(editUser?.id !== null && editUser?.id) ? "Edit" : "Add"}
                        // title={"Add Teacher"}
                        roles={forData?.roles}
                        positions={forData?.positions}
                        regions={forData?.regions}
                        districts={forData?.districts}
                        formArr={[
                            {
                                label: "First Name",
                                name: "firstName",
                                placeholder: "First Name",
                                type: "text",
                            },
                            {
                                label: "Last Name",
                                name: "lastName",
                                placeholder: "Last Name",
                                type: "text",
                            },
                            {
                                label: "Middle Name",
                                name: "middleName",
                                placeholder: "Middle Name",
                                type: "text",
                            },
                            {
                                label: "RFID",
                                name: "rfid",
                                placeholder: "RFID",
                                type: "text",
                            },
                            {
                                label: "Login",
                                name: "login",
                                placeholder: "Login",
                                type: "text",
                            },
                            {
                                label: "Passport",
                                name: "passport",
                                placeholder: "Passport",
                                type: "text",
                            },
                            {
                                label: "Password",
                                name: "password",
                                placeholder: "Password",
                                type: "text",
                            },
                            {
                                label: "Gander",
                                name: "gander",
                                placeholder: "Gander",
                                type: "select",
                            },
                            {
                                label: "Region",
                                name: "region",
                                placeholder: "Region",
                                type: "select",
                            },
                            {
                                label: "District",
                                name: "district",
                                placeholder: "District",
                                type: "select",
                            },
                            {
                                label: "Address",
                                name: "address",
                                placeholder: "Address",
                                type: "text",
                            },
                            {
                                label: "Roles",
                                name: "roles",
                                placeholder: "Roles",
                                type: "multi",
                            },
                            {
                                label: "Positions",
                                name: "positions",
                                placeholder: "Positions",
                                type: "multi",
                            },
                        ]}
                        submitBtn={"Save"}
                        onSubmit={(form) => (onSave(form))}
                    />

                </Box>
            </Modal>


            <Modal
                open={edit}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >

                <Box sx={style} component={styleAdd}>
                    <CloseMyButtonForChild onClick={handleClose}
                                           whileHover={{rotate: 180, scale: 1.1}}
                                           whileTap={{scale: 0.9}}
                                           transition={{duration: 0.3}}
                    ><RiCloseLine/></CloseMyButtonForChild>

                    <SaveUserForm
                        title={(editUser?.id !== null && editUser?.id) ? "Edit " : "Add "}
                        roles={forData?.roles}
                        positions={forData?.positions}
                        regions={forData?.regions}
                        districts={forData?.districts}
                        formArr={[
                            {
                                label: "First Name",
                                name: "firstName",
                                placeholder: "First Name",
                                type: "text",
                            },
                            {
                                label: "Last Name",
                                name: "lastName",
                                placeholder: "Last Name",
                                type: "text",
                            },
                            {
                                label: "Middle Name",
                                name: "middleName",
                                placeholder: "Middle Name",
                                type: "text",
                            },
                            {
                                label: "RFID",
                                name: "rfid",
                                placeholder: "RFID",
                                type: "text",
                            },
                            {
                                label: "Login",
                                name: "login",
                                placeholder: "Login",
                                type: "text",
                            },
                            {
                                label: "Passport",
                                name: "passport",
                                placeholder: "Passport",
                                type: "text",
                            },
                            {
                                label: "Password",
                                name: "password",
                                placeholder: "Password",
                                type: "text",
                            },
                            {
                                label: "Gander",
                                name: "gander",
                                placeholder: "Gander",
                                type: "select",
                            },
                            {
                                label: "Region",
                                name: "region",
                                placeholder: "Region",
                                type: "select",
                            },
                            {
                                label: "District",
                                name: "district",
                                placeholder: "District",
                                type: "select",
                            },
                            {
                                label: "Address",
                                name: "address",
                                placeholder: "Address",
                                type: "text",
                            },
                            {
                                label: "Roles",
                                name: "roles",
                                placeholder: "Roles",
                                type: "multi",
                            },
                            {
                                label: "Positions",
                                name: "positions",
                                placeholder: "Positions",
                                type: "multi",
                            },
                        ]}
                        submitBtn={(editUser?.id !== null && editUser?.id) ? "Update" : "Save"}
                        // submitBtn="Save"
                        onSubmit={(form) => (editUser?.id !== null && editUser?.id) ? onUpdate(form) : onSave(form)}
                        updateItem={editUser}
                    />


                </Box>
            </Modal>


        </Container>
    );
};


const Wrapper2 = styled.div`
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


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1100,
    padding: "20px",
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 3,
    p: 4,
};
const styleAdd = styled.div`
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

const Label = styled.label`
    width: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    cursor: pointer;
    background-color: ${mainColor};
    color: white;
    padding: 20px 10px !important;
    border-radius: 8px;


    & > input:disabled {
        cursor: not-allowed;
    }
`

const Btn = styled.button`
    width: 250px;
    align-self: start;
    border: 1px solid ${mainColor};
    background-color: #fff;
    color: ${mainColor};
    border-radius: 0.5rem;
    padding: 20px 10px !important;
    letter-spacing: 1.1px;

    &:hover {
        background-color: ${mainColor};
        color: white;
    }

    &:disabled {
        cursor: not-allowed;
    }
`

const Row = styled.div`
    display: flex;
`

const Wrapper = styled.div`
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 20px;
    ${extrasmall({
        justifyContent: "center"
    })}
`;

const Container = styled.div`
    padding: 1rem;

    .MuiDataGrid-columnHeaderTitleContainer {
        justify-content: center;
    }
`;


export default AdminUserAddPage;