import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {BASE_URL, DEKAN, getHeaders, mainColor, TOKEN, TokenType} from "../../../utills/ServiceUrls";
import {AiOutlineCloudDownload, AiOutlineCloudUpload} from "react-icons/ai";
import TextField from "@mui/material/TextField";
import axios from "axios";
import {toast} from "react-toastify";
import Modal from "@mui/material/Modal";
import {RiCloseLine} from "react-icons/ri";
import {LinearProgress} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {FiEdit} from "react-icons/fi";
import {FaSave, FaTrashAlt} from "react-icons/fa";
import {extrasmall, medium, small} from "../../../responsiv";
import ButtonMui from "@mui/material/Button";
import {BsPersonFillAdd} from "react-icons/bs";

const DekanStudentAddPage = () => {
    const [fullName, setFullName] = React.useState('');
    const [rfid, setRfid] = React.useState('');
    const [passport, setPassport] = React.useState('');
    const [group, setGroup] = React.useState('');
    const [login, setLogin] = React.useState('');
    const [level, setLevel] = React.useState(1);
    const [password, setPassword] = React.useState('');

    const handleChange = (event) => {
        setLevel(event.target.value);
    };

    const handleChangeGroups = (event) => {
        setGroup(event.target.value);
    };

    const handleChangeFullName = (event) => {
        setFullName(event.target.value);
    };

    const handleChangeRFID = (event) => {
        setRfid(event.target.value);
    };

    const handleChangePassport = (event) => {
        setPassport(event.target.value);
    };

    const handleChangeLogin = (event) => {
        setLogin(event.target.value);
    };

    const handleChangePassword = (event) => {
        setPassword(event.target.value);
    };

    const {headers} = getHeaders();

    const onSubmit = () => {
        if (level != "" && fullName !== "" && login !== "" && password !== "" && passport !== "" && group !== "" && rfid !== "") {
            axios.post(BASE_URL + "/user/saveStudentFromSuperAdmin", {
                fullName,
                login,
                passport,
                password,
                rfid,
                group,
                level
            }, {headers})
                .then(res => {

                    if (res?.data?.success) {
                        toast.success(res?.data?.message);
                        setGroup("");
                        setLevel("");
                        setLogin("");
                        setRfid("");
                        setFullName("");
                        setPassport("");
                        setPassword("");
                    } else {
                        toast.error(res?.data?.message)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        } else {
            toast.warning("Empty any fields..")
        }
    }


    const savePhoto = (e) => {
        const url = BASE_URL + "/student/uploadStudent";
        const formData = new FormData();
        formData.append('file', e.target.files[0]);
        const token = localStorage.getItem(TOKEN)
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': TokenType + token,
                'Access-Control-Allow-Origin': '*'
            }
        }
        /* axios.post(url, formData, config)
           .then((response) => {
             console.log(response.data,'RES upload');

             toast.success("Saved photo successfully...", {
               position: "top-right",
               autoClose: 5000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
               theme: "colored",
             })
           })
           .catch(err=>{
             console.log(err,"err upload")
           })*/
    }

    const [show, setShow] = useState(false);
    const [groups, setGroups] = useState([]);
    const [come, setCome] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, [])

    const fetchStudents = () => {
        axios.get(BASE_URL + "/dekan/getStudentForSettings", {headers})
            .then(res => {
                setData(res?.data);
                setCome(true);
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        axios.get(BASE_URL + DEKAN.GET_GROUPS_NAMES_FOR_DEKAN_BY_FACULTY_ID, {headers})
            .then(res => {
                setGroups(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }, [show])


    const handleClose = () => {
        setShow(false)
        setEdit(false);
    }


    const [selectUser, setSelectUser] = useState(null);
    const [editUser, setEditUser] = useState({
        id: '',
        fullName: '',
        rfid: '',
        login: '',
        email: '',
        passportNum: '',
        nationality: '',
        citizenship: '',
        level: 1,
        group: ''
    });
    const [edit, setEdit] = useState(false);
    const handleOpenEdit = (id) => {
        setSelectUser(data.find(item => item.id === id))
        setEditUser(prev => ({
            ...prev,
            id,
            fullName: data.find(item => item.id === id).fullName,
            login: data.find(item => item.id === id).login,
            email: data.find(item => item.id === id).email,
            passportNum: data.find(item => item.id === id).passportNum,
            rfid: data.find(item => item.id === id).rfid,
            group: data.find(item => item.id === id).groupData.name,
            level: data.find(item => item.id === id).groupData.level,
            nationality: data.find(item => item.id === id).nationality,
            citizenship: data.find(item => item.id === id).citizenship
        }))
        setEdit(true);
    }


    const handleDelete = (id) => {
        toast.error(id + " - deleted function loading...")

    }

    const handleChangeValue = (e) => {
        setEditUser(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const onEdit = () => {
        if (
            editUser?.level !== "" &&
            editUser?.level !== null &&
            editUser?.fullName !== "" &&
            editUser?.fullName !== null &&
            editUser?.login !== "" &&
            editUser?.login !== null &&
            editUser?.passportNum !== "" &&
            editUser?.passportNum !== null &&
            editUser?.group !== "" &&
            editUser?.group !== null &&
            editUser?.rfid !== null &&
            editUser?.rfid !== ""
        ) {

            axios.post(BASE_URL + "/dekan/changeStudent", editUser, {headers})
                .then(res => {
                    if (res?.data?.success) {
                        toast.success(res?.data?.message);
                        setEdit(false);
                        setCome(false);
                        fetchStudents();
                    } else {
                        toast.error(res?.data?.message)
                    }

                    // console.log(res, " save super admin")
                })
                .catch(err => {
                    console.log(err)
                })
        } else {
            console.log(editUser)
            toast.warning("Empty any fields..")
        }
    }

    const columns = [
        {field: 'id', headerName: 'ID', width: 40, editable: false},
        {
            field: 'fullName',
            headerName: 'Full Name',
            width: 300,
            editable: false,
            renderCell: (cellValues) => {
                return (
                    <Button
                        variant="contained"
                        color="primary"
                    >
                        <StudentFullName>{cellValues.row.fullName}</StudentFullName>
                        <StudentTel>{cellValues.row.phoneNumber}</StudentTel>
                    </Button>
                );
            }
        },
        {field: 'nationality', headerName: 'Nationality', width: 100, editable: false},
        {field: 'citizenship', headerName: 'Citizenship', width: 100, editable: false},
        {field: 'email', headerName: 'Email', width: 200, editable: false},
        {field: 'passportNum', headerName: 'Passport', width: 100, editable: false},
        {field: 'login', headerName: 'Login', width: 100, editable: false},
        {field: 'rfid', headerName: 'Card No', width: 150, editable: false},
        {
            field: 'groupData', headerName: 'Group', width: 100, editable: false,
            renderCell: (cellValues) => {
                return (
                    <Button
                        variant="contained"
                        color="primary"
                    >
                        <StudentFullName>{cellValues.row?.groupData?.name}</StudentFullName>
                        <StudentTel>Course - {cellValues.row?.groupData?.level}</StudentTel>
                    </Button>
                );
            }
        },
        {
            field: 'STATUS', headerName: 'Action', width: 100, editable: false,
            renderCell: (cellValues) => {
                return (
                    <span style={{display: 'flex', gap: "10px"}}>
          <BtnEditPosition onClick={() => handleOpenEdit(cellValues?.row?.id)} color={mainColor}
                           fs={"20px"}><FiEdit/></BtnEditPosition>
          <BtnEditPosition onClick={() => handleDelete(cellValues?.row?.id)} color={"red"}
                           fs={"16px"}><FaTrashAlt/></BtnEditPosition>
          </span>
                );
            }
        },
    ];
    const [data, setData] = useState([
        {
            id: 1,
            fullName: "Tohir Asadov",
            cardNo: "123456",
            dateAsc: new Date(),
            dateDesc: new Date(),
            phoneNumber: "993361603"
        },
        {
            id: 2,
            fullName: "Tohir Asadov",
            cardNo: "123456",
            dateAsc: new Date(),
            dateDesc: new Date(),
            Print: "OK See",
            phoneNumber: "993361603"
        },
    ])

    return (
        <Container>
            <Wrapper>
                <Section>
                    <Row>
                        <ButtonMui
                            startIcon={ <AiOutlineCloudUpload/>}
                            variant={'contained'}
                            component={'label'}

                        >
                            Import students from file
                            <input type="file"  hidden onChange={savePhoto}
                                   accept={"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}
                            />
                        </ButtonMui>

                        <ButtonMui
                            startIcon={ <AiOutlineCloudDownload/>}
                            variant={'outlined'}
                            component={'label'}
                            onClick={() => toast.warning("texnik ishlar olib borilyapdi")}
                        >
                            Import students from file
                        </ButtonMui>
                        <ButtonMui
                            startIcon={ <BsPersonFillAdd/>}
                            variant={'outlined'}
                            component={'label'}
                            color={'success'}
                            onClick={() => setShow(!show)}
                        >
                             Create Student
                        </ButtonMui>

                    </Row>
                </Section>
            </Wrapper>
            <hr/>

            {
                come ? <DataGrid
                    checkboxSelection
                    style={{width: "100%", minHeight: "300px!important"}}
                    columns={columns}
                    rows={data}
                    components={{Toolbar: GridToolbar}}
                    autoHeight
                    pageSize={20}
                    initialState={{
                        ...data.initialState,
                        columns: {
                            columnVisibilityModel: {
                                id: false,
                                email: false,
                                nationality: false,
                                citizenship: false,
                            },
                        },
                    }}
                /> : <LinearProgress/>
            }

            <Wrapper>

            </Wrapper>


            {/*** ================= edit student =================== ***/}
            <Modal
                open={edit}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style} component={style2}>
                    <CloseMyButtonForChild onClick={handleClose}><RiCloseLine/></CloseMyButtonForChild>
                    <h3>{selectUser?.fullName}</h3>
                    <WrapInputs>


                                <TextField id="outlined-basic"   label="Full Name" variant="outlined"
                                           value={editUser?.fullName}
                                           name={"fullName"}
                                           onChange={handleChangeValue}
                                />

                                <TextField id="outlined-basic"   label="RFID" variant="outlined"
                                           value={editUser?.rfid}
                                           name={"rfid"}
                                           onChange={handleChangeValue}
                                />

                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Course</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={editUser?.level}
                                            label="Course"
                                            name={"level"}
                                            onChange={handleChangeValue}
                                        >
                                            <MenuItem value={1}>1</MenuItem>
                                            <MenuItem value={2}>2</MenuItem>
                                            <MenuItem value={3}>3</MenuItem>
                                            <MenuItem value={4}>4</MenuItem>
                                        </Select>
                                    </FormControl>

                                <TextField id="outlined-basic"   label="Login" variant="outlined"
                                           value={editUser?.login}
                                           name={"login"}
                                           onChange={handleChangeValue}
                                />

                                <TextField id="outlined-basic"   label="Citizenship" variant="outlined"
                                           value={editUser?.citizenship}
                                           name={"citizenship"}
                                           onChange={handleChangeValue}
                                />

                                <TextField id="outlined-basic"  label="Email" variant="outlined"
                                           value={editUser?.email}
                                           name={"email"}
                                           onChange={handleChangeValue}
                                />

                                <TextField id="outlined-basic"  label="Passport" variant="outlined"
                                           value={editUser?.passportNum}
                                           name={"passportNum"}
                                           onChange={handleChangeValue}
                                />



                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Group</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={editUser?.group}
                                            label="Group"
                                            name={'group'}
                                            onChange={handleChangeValue}
                                        >
                                            {
                                                groups?.map(i => {
                                                    return <MenuItem value={i.name} key={i.id}>{i.name}</MenuItem>
                                                })
                                            }
                                        </Select>
                                    </FormControl>


                                <TextField id="outlined-basic"   label="Nationality" variant="outlined"
                                           value={editUser?.nationality}
                                           name={"nationality"}
                                           onChange={handleChangeValue}
                                />

                    </WrapInputs>
                    <Wraperbtn>
                        <ButtonMui
                            size={"large"}
                            sx={{m: "0 0 0 auto"}}
                            variant={'contained'}
                            endIcon={<FaSave/>}
                            onClick={onEdit}>Save</ButtonMui>
                    </Wraperbtn>
                </Box>
            </Modal>
            {/*** ================= edit student =================== ***/}


            {/*** ================= create student =================== ***/}
            <Modal
                open={show}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style} component={style2}>
                    <CloseMyButtonForChild onClick={handleClose}><RiCloseLine/></CloseMyButtonForChild>
                    <h3>Create new student</h3>
                    <WrapInputs>
                                <TextField id="outlined-basic"  label="Full Name" variant="outlined"
                                           value={fullName}
                                           onChange={handleChangeFullName}
                                />
                                <TextField id="outlined-basic" label="RFID" variant="outlined"
                                           value={rfid}
                                           onChange={handleChangeRFID}
                                />
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Course</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={level}
                                            label="Course"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value={1}>1</MenuItem>
                                            <MenuItem value={2}>2</MenuItem>
                                            <MenuItem value={3}>3</MenuItem>
                                            <MenuItem value={4}>4</MenuItem>
                                        </Select>
                                    </FormControl>

                                <TextField id="outlined-basic" label="Login" variant="outlined"
                                           value={login}
                                           onChange={handleChangeLogin}
                                />

                                <TextField id="outlined-basic"  label="Password" variant="outlined"
                                           value={password}
                                           onChange={handleChangePassword}
                                />

                                <TextField id="outlined-basic" label="Passport" variant="outlined"
                                           value={passport}
                                           onChange={handleChangePassport}
                                />


                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Group</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={group}
                                            label="Group"
                                            onChange={handleChangeGroups}
                                        >
                                            {
                                                groups?.map(i => {
                                                    return <MenuItem value={i.name} key={i.id}>{i.name}</MenuItem>
                                                })
                                            }
                                        </Select>
                                    </FormControl>

                    </WrapInputs>
                    <Wraperbtn>
                        <ButtonMui
                            size={"large"}
                            sx={{m: "0 0 0 auto"}}
                            variant={'contained'}
                            endIcon={<FaSave/>}
                            onClick={onSubmit}>Save</ButtonMui>
                    </Wraperbtn>
                </Box>
            </Modal>
            {/*** ================= create student =================== ***/}


        </Container>
    );
};


const BtnEditPosition = styled.button`
  width: 30px;
  height: 30px;
  background-color: #fff;
  font-size: ${props => props.fs};
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

const Button = styled.button`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  background-color: transparent;
  padding-left: 5px;
  font-size: 14px;
  border: none;
  cursor: pointer;
  color: #000;
  transition: all 0.2s ease;
  letter-spacing: 1.2px;

  &:focus {
    transform: scale(0.95);
  }
`;


const StudentTel = styled.span`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  color: gray;
  font-size: 8px;
`;

const StudentFullName = styled.span`
  width: 100%;
  font-size: 14px;
  display: flex;
  justify-content: flex-start;
`;


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "70vw",
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 3,
    p: 4,
};
const style2 = styled.div`
  ${medium({
    width: "90vw !important",
  })}
  ${small({
    width: "95vw !important",
  })}

  ${extrasmall({
    width: "95vw !important",
    height: "95vh !important"
  })}
`
const CloseMyButtonForChild = styled.button`
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
const Wraperbtn = styled.div`
  display: flex;
  justify-content: end;
`

const Row = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  ${extrasmall({
    justifyContent:"center"
  })}
`

const Section = styled.div`
  margin-top: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`
const WrapInputs = styled.div`
  padding-top: 10px;
  display: grid;
  overflow-y: scroll;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  ${extrasmall({
    gridTemplateColumns: '1fr',
    gap: '15px',
})}
`

const Wrapper = styled.div`
  width: 100%;
  overflow: scroll;
  gap: 10px;
  display: grid;
  grid-template-columns: auto auto auto;

`;


const Container = styled.div`
  height: 100%;
  min-height: 500px;
  border-radius: 10px;
  margin-top: 10px !important;
  margin-left: 20px !important;
  padding: 5px 10px !important;
`;


export default DekanStudentAddPage;