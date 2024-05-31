import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {ADMIN, BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import Box from "@mui/material/Box";
import {RiCloseLine} from "react-icons/ri";
import Modal from "@mui/material/Modal";
import SaveTeacherForm from "../../form/SaveTeacherForm";
import axios from "axios";
import {toast} from "react-toastify";
import Spinner from "../../spinner/Spinner";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import moment from "moment";
import Button from "@mui/material/Button"
import UserStatistics from "../../userStatistics/UserStatistics";
import TeacherPanel from "./teacherPanel/TeacherPanel";
import {useDispatch, useSelector} from "react-redux";
import {FaRegSave, FaUserAlt} from "react-icons/fa";
import {FiEdit} from "react-icons/fi";
import Select from '@mui/material/Select';
import {kafedraTeacherStatisticsFetchingError} from "../../../redux/slice/kafedra/kafedra_teacher_statistics_slice";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import {BsCalendar2Date, BsPersonFillAdd, BsTrash} from "react-icons/bs";
import UsersMonthStatistics from "../../userStatistics/UsersMonthStatistics";
import {motion as m} from "framer-motion";
import {extrasmall, medium, small} from "../../../responsiv";
import {IoMdBookmarks} from "react-icons/io";
import {useNavigate} from "react-router-dom";
import AddTeacherModal from "./AddTeacherModal";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";


const icon = <CheckBoxOutlineBlankIcon fontSize="small"/>;
const checkedIcon = <CheckBoxIcon fontSize="small"/>;


const KafedraTeachers = () => {

    const {headers} = getHeaders();
    const [updateItem, setUpdateItem] = useState({})
    const [selectUser, setSelectUser] = useState("");
    const [selectUserId, setSelectUserId] = useState("");
    const [selectPhoto, setSelectPhoto] = useState("");
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState([])
    const [positions, setPositions] = useState([]);
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false);
    const navigate = useNavigate()
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setEdit(false);
    }

    const [openTimeTable, setOpenTimeTable] = useState(false);
    const handleOpenTimeTable = (name, userId, photoId) => {
        setSelectUser(name);
        setSelectPhoto(photoId)
        setSelectUserId(userId)
        return setOpenTimeTable(true);
    }
    const handleCloseTimeTable = () => {
        setOpenTimeTable(false);
    }

    const [openTeacherPanel, setOpenTeacherPanel] = useState(false);
    const handleOpenTeacherPanel = (selectId) => {
        setSelectUserId(selectId)
        setOpenTeacherPanel(true);
    }
    const handleCloseTeacherPanel = () => {
        setOpenTeacherPanel(false);
    }


    const columns = [
        {
            field: 'count',
            headerName: '№',
            width: 40,
            align: 'center',
            editable: false
        },
        {
            field: 'fullName',
            headerName: 'Full name',
            minWidth: 300,
            flex: 1,
            align: 'left',
            editable: false,
            renderCell: (cellValues) => {
                return (
                    <Wrapper>
                        {
                            cellValues?.row?.photo ? <img
                                src={cellValues?.row?.photo ? BASE_URL + "/attachment/download/" + cellValues?.row?.photo?.id : ""}
                                width={"40px"} height={"40px"}
                                alt={cellValues?.value}
                                style={{borderRadius: "50%"}}
                            /> : <span style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "20px"
                            }}><FaUserAlt/></span>
                        }
                        <span style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "14px"
                        }}><Button
                            onClick={() => handleOpenTeacherPanel(cellValues?.row?.id)}>{cellValues?.value}</Button></span>
                    </Wrapper>
                );
            }
        },
        {
            field: 'login',
            headerName: 'Login',
            minWidth: 100,
            flex: 0.4,
            align: 'center',
            editable: false,
        },
        {
            field: 'email',
            headerName: 'Email',
            minWidth: 200,
            flex: 0.7,
            align: 'center',
            editable: false,
        },
        {
            field: 'rfid',
            headerName: 'RFID',
            minWidth: 120,
            flex: 0.5,
            align: 'center',
            editable: false,
        },
        {
            field: 'passport',
            headerName: 'Passport',
            minWidth: 130,
            flex: 0.5,
            align: 'center',
            editable: false,
        },
        {
            field: 'articles',
            headerName: 'Scientific articles',
            minWidth: 140,
            flex: 1,
            align: 'center',
            editable: false,
        },
        {
            field: 'countTouch',
            headerName: `Statistics`,
            minWidth: 100,
            flex: 0.5,
            editable: false,
            renderCell: (cellValues) => {
                return (
                    <Wrapper2>
                        <Button
                            onClick={() => handleOpenTimeTable(cellValues?.row?.fullName, cellValues?.row?.id, cellValues?.row?.photo?.id)}>
                            {cellValues?.value}
                            <BsCalendar2Date size={20}/>
                        </Button>
                    </Wrapper2>
                );
            }
        },
        {
            field: 'positions',
            headerName: 'Positions',
            minWidth: 150,
            flex: 0.6,
            align: 'center',
            editable: false,
        },
        {
            field: 'subjects',
            headerName: 'Subjects',
            minWidth: 150,
            flex: 0.6,
            align: 'center',
            editable: false,
        },
        {
            field: 'status',
            headerName: 'Status',
            minWidth: 150,
            flex: 0.6,
            align: 'center',
            editable: false,
        },
        {
            field: 'rate',
            headerName: 'Rate',
            minWidth: 150,
            flex: 0.6,
            align: 'center',
            editable: false,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            minWidth: 100,
            flex: 0.5,
            align: 'center',
            editable: false,
            renderCell: (cellValues) => {
                return (
                    <Wrapper2>
                        <BtnEditPosition onClick={() => handleOpenEdit(cellValues?.row?.id)}><FiEdit/></BtnEditPosition>
                        <BtnEditPosition2 onClick={() => handleDeleted(cellValues?.row?.id, cellValues?.row?.fullName)}><BsTrash/></BtnEditPosition2>
                    </Wrapper2>
                );
            }
        },
    ];



    const addModalOpen = () => {
        setUpdateItem({...updateItem, id: null, userId: null, kafedraId: null, lessonDtos: null})
        handleOpen();
    }

    const saveBuilding = (form) => {
        if (form?.id === "") {
            form.id = null
        }
        console.log(form)
       /* axios.post(BASE_URL + "/teacher/save", form, {headers})
            .then(response => {
                toast.success("Teacher saved successfully.");
                getAllTeacherStatics();
                setOpen(false);
            })
            .catch(err => {
                console.log(err);
            });*/
    }
    const onEdit = () => {
        if (
            editUser?.fullName !== "" &&
            editUser?.fullName !== null &&
            editUser?.subjects?.length !== 0 &&
            editUser?.subjects !== null &&
            editUser?.position !== "" &&
            editUser?.position !== null &&
            editUser?.workStatus !== "" &&
            editUser?.workStatus !== null &&
            editUser?.login !== "" &&
            editUser?.login !== null &&
            editUser?.passportNum !== "" &&
            editUser?.passportNum !== null &&
            editUser?.rfid !== "" &&
            editUser?.rfid !== null &&
            editUser?.rate !== "" &&
            editUser?.rate !== null
        ) {
            setSpinner(true);
            // console.log(editUser,"edit user log")
            axios.post(BASE_URL + "/kafera-mudiri/changeTeacher", editUser, {headers})
                .then(res => {
                    if (res?.data?.success) {
                        toast.success(res?.data?.message);
                        setEdit(false);
                        getAllTeacherStatics();
                    } else {
                        toast.error(res?.data?.message)
                        setSpinner(false)
                    }
                    // console.log(res," save super admin")
                })
                .catch(err => {
                    setSpinner(false);
                    // toast.error(err)
                    console.log(err)
                })
        } else {
            // console.log(editUser)
            toast.warning("Empty any fields..")
        }
    }
    const handleDeleted = (id, name) => {

        if (window.confirm(`Do you want to delete ${name}?`)) {
            axios.delete(BASE_URL + "/kafera-mudiri/deletedTeacherWithUserId/" + id, {headers})
                .then(res => {
                    toast.error(res?.data?.message, {
                        position: "top-right",
                        autoClose: false,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    })
                    getAllTeacherStatics();
                })
                .catch(err => {
                    console.log(err)
                })
        }

    }

    const onUpdate = (building) => {
        axios.put(BASE_URL + ADMIN.BUILDING_UPDATE, building, {headers})
            .then(res => {
                if (res.status === 202) toast.success("Building updated successfully!...")
                // getAll2();
            })
            .catch(err => {
                console.log(err);
            })
    }

    const section = useSelector(state => state?.section?.section)

    const getAllTeacherStatics = () => {
        setSpinner(true);

        setData([]);

        axios.get(BASE_URL + "/kafera-mudiri/getStatistics?id=" + section?.id, {headers})
            .then(res => {
                // console.log(res.data, "- 55 55 ----------------------------------")
                setData(
                    res?.data?.obj?.sort((a, b) => a.fullName > b.fullName ? 1 : -1).map((item, index) => ({
                        ...item,
                        count: index + 1
                    }))
                );
                setSpinner(false)
            })
            .catch(err => dispatch(kafedraTeacherStatisticsFetchingError(err)));
    }

    const kafedraId = useSelector(state => state?.section?.section?.id)
    const [editUser, setEditUser] = useState({
        id: '',
        kafedraId,
        fullName: '',
        rfid: '',
        login: '',
        email: '',
        passportNum: '',
        nationality: '',
        citizenship: '',
        position: '',
        workStatus: '',
        subjects: [],
        rate: '',
    });
    const [subjectsOption, setSubjectsOption] = useState([]);

    const [edit, setEdit] = useState(false);
    const handleOpenEdit = (id) => {
        // console.log(data.find(item=>item.id===id)," -- 3333 -- 333 ---");
        axios.get(BASE_URL + "/kafera-mudiri/positionEdit?id=" + id, {headers})
            .then(res => {
                // console.log(res.data)
                setPositions(res?.data?.obj?.positions?.map(item => item.label));
                setSubjectsOption(res?.data?.obj?.subjects)
            })
            .catch(err => {
                console.log(err)
            })

        setSelectUser(data.find(item => item.id === id))
        setEditUser(prev => ({
            ...prev,
            id,
            fullName: data.find(item => item.id === id).fullName,
            login: data.find(item => item.id === id).login,
            email: data.find(item => item.id === id).email,
            rfid: data.find(item => item.id === id).rfid,
            passportNum: data.find(item => item.id === id).passport,
            position: data.find(item => item.id === id)?.positions,
            nationality: data.find(item => item.id === id).nationality,
            citizenship: data.find(item => item.id === id).citizenship,
            workStatus: data.find(item => item.id === id).status,
            subjects: data.find(item => item.id === id).subjects,
            rate: data.find(item => item.id === id).rate,
        }))
        console.log({
            id,
            fullName: data.find(item => item.id === id).fullName,
            login: data.find(item => item.id === id).login,
            email: data.find(item => item.id === id).email,
            rfid: data.find(item => item.id === id).rfid,
            passportNum: data.find(item => item.id === id).passport,
            position: data.find(item => item.id === id)?.positions,
            nationality: data.find(item => item.id === id).nationality,
            citizenship: data.find(item => item.id === id).citizenship,
            workStatus: data.find(item => item.id === id).status,
            subjects: data.find(item => item.id === id).subjects,
            rate: data.find(item => item.id === id).rate,
        })
        setEdit(true);
    }
    const handleChangeValue = (e) => {
        setEditUser(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const [inputValue, setInputValue] = useState('');

    const [openMonthModal, setOpenMonthModal] = useState(false);
    const handleOpenMonthModal = () => {
        setOpenMonthModal(true)
    }
    const handleCloseMonthModal = () => {
        setOpenMonthModal(false);
    }


    useEffect(() => {
        getAllTeacherStatics();
    }, [])

    return (
        <Container>
            <Title>Table of Teachers
                <BtnWrapper>
                    <Button variant={'contained'} onClick={handleOpenMonthModal}>
                        Monthly visitation statistics
                    </Button>
                    <Button
                        variant={'contained'}
                        color={'success'}
                        onClick={addModalOpen}
                        endIcon={<BsPersonFillAdd/>}
                    > Add Teacher</Button>
                    <Button
                        variant={'contained'}
                        color={'inherit'}
                        onClick={() => navigate('table')}
                        endIcon={<IoMdBookmarks/>}
                    > Table</Button>
                </BtnWrapper>
            </Title>

            <Modal
                open={openMonthModal}
                onClose={handleCloseMonthModal}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={styleMonthTable} component={styleMonthTable2}>
                    <CloseMyButtonForChild onClick={handleCloseMonthModal}
                                           whileHover={{rotate: 180, scale: 1.1}}
                                           whileTap={{scale: 0.9}}
                                           transition={{duration: 0.3}}
                    ><RiCloseLine/></CloseMyButtonForChild>
                    <UsersMonthStatistics colName={"Teachers"} isTeacher={true} date={new Date()}
                                          userName={section.name}
                                          kafedraId={section.id}
                                          url={"/kafera-mudiri/getStatisticssForRektor?kafedraId="}/>
                </Box>
            </Modal>

            <Body>
                {
                    spinner ? <Spinner/> : <DataGrid
                        columns={columns}
                        rows={data}
                        components={{Toolbar: GridToolbar}}
                        autoHeight
                        rowsPerPageOptions={[10, 20, 30]}
                        initialState={{
                            columns: {
                                columnVisibilityModel: {
                                    articles: false,
                                    card: false,
                                    rfid: false,
                                    email: false,
                                    actions: false,
                                    passport: false,
                                    subjects: false,
                                    status: false,
                                    rate: false,
                                },
                            },
                            pagination: {
                                pageSize: 20,
                            },
                        }}
                    />
                }
            </Body>


            {/*** ================= edit teacher =================== ***/}
            <Modal
                open={edit}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={styleEdit} component={stylededit2}>
                    <CloseMyButtonForChild onClick={handleClose}
                                           whileHover={{rotate: 180, scale: 1.1}}
                                           whileTap={{scale: 0.9}}
                                           transition={{duration: 0.3}}
                    ><RiCloseLine/></CloseMyButtonForChild>
                    <h3 style={{color: `${mainColor}`}}>Edit {selectUser?.fullName} teacher</h3>


                    {/*<ReactSelect  />*/}
                    <Wrapperscroll>

                        <TextField id="outlined-basicdfh" label="Full Name" variant="outlined"
                                   value={editUser?.fullName}
                                   name={"fullName"}
                                   onChange={handleChangeValue}
                        />

                        <TextField id="outlined-basicdfh" label="RFID" variant="outlined"
                                   value={editUser?.rfid}
                                   name={"rfid"}
                                   onChange={handleChangeValue}
                                   disabled={true}
                        />

                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Status</InputLabel>
                            <Select

                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={editUser?.workStatus}
                                label="Status"
                                name={"workStatus"}
                                onChange={handleChangeValue}
                            >
                                <MenuItem value={'ASOSIY'}>ASOSIY</MenuItem>
                                <MenuItem value={'SOATBAY'}>SOATBAY</MenuItem>
                                <MenuItem value={'ORINDOSH'}>ORINDOSH</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField id="outlined-basicdfhe" label="Login" variant="outlined"
                                   value={editUser?.login}
                                   name={"login"}
                                   onChange={handleChangeValue}
                                   disabled={true}
                        />

                        <TextField id="outlined-basrwic" label="Citizenship" variant="outlined"
                                   value={editUser?.citizenship}
                                   name={"citizenship"}
                                   onChange={handleChangeValue}
                        />

                        <TextField id="outlined-badjsic" label="Email" variant="outlined"
                                   value={editUser?.email}
                                   name={"email"}
                                   onChange={handleChangeValue}
                        />

                        <TextField id="outlidfjned-basic" label="Passport" variant="outlined"
                                   value={editUser?.passportNum}
                                   name={"passportNum"}
                                   onChange={handleChangeValue}
                                   disabled={true}
                        />

                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Position</InputLabel>
                            <Select

                                labelId="demo-simple-select-label"
                                id="demo-simple-sretelect"
                                value={editUser?.position}
                                label="Position"
                                name={'position'}
                                onChange={handleChangeValue}
                            >
                                {
                                    positions?.map(i => {
                                        return <MenuItem value={i} key={i}>{i}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>

                        <TextField id="outtylined-basic" label="Nationality" variant="outlined"
                                   value={editUser?.nationality}
                                   name={"nationality"}
                                   onChange={handleChangeValue}
                        />

                        <Autocomplete
                            multiple
                            limitTags={1}
                            id="checkboxes-tags-demo"
                            options={subjectsOption}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option}
                            value={editUser.subjects}
                            onChange={(event, newValue) => {
                                setEditUser((prev) => ({...prev, subjects: newValue}));
                            }}

                            inputValue={inputValue}
                            onInputChange={(event, newInputValue) => {
                                setInputValue(newInputValue);
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
                                <TextField {...params} label="Subjects" placeholder="Subjects of Teacher"/>
                            )}
                        />
                        <TextField
                            id="outlined-basicdfhdsg"
                            label="Rate"
                            variant="outlined"
                            type={'number'}
                            value={editUser?.rate}
                            name={"rate"}
                            onChange={handleChangeValue}
                        />
                    </Wrapperscroll>
                    <Box sx={{display: 'flex', justifyContent: 'end',mt:'15px'}}>
                        <Button
                            endIcon={<FaRegSave/>}
                            variant={'contained'}
                            onClick={onEdit}
                        >
                            Update
                        </Button>
                    </Box>
                </Box>
            </Modal>
            {/*** ================= edit teacher =================== ***/}


            {/*** ================= ADD TEACHER =================== ***/}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style} component={styleadd}>
                    <Box sx={{display:'flex', justifyContent:'space-between',alignItems:'center',mb:'16px'}}>
                        <Typography fontSize={22}>
                            Add
                        </Typography>
                        <IconButton onClick={handleClose}>
                            <RiCloseLine color={'red'}/>
                        </IconButton>
                    </Box>

                   {/*   <SaveTeacherForm
                        // title={updateItem?.id!==null ? "UPDATE BUILDING" : "ADD BUILDING"}
                        title={"Add Teacher"}
                        formArr={[
                            {
                                label: "id",
                                name: "id",
                                placeholder: "Enter id of build",
                                type: "text",
                            },
                            {
                                label: "Select User:",
                                name: "userId",
                                placeholder: "Select User",
                                type: "select",
                            },
                            {
                                label: "Select Status:",
                                name: "workerStatus",
                                placeholder: "Select Status",
                                type: "select",
                            },
                            {
                                label: "Select Subjects:",
                                name: "lessonDtos",
                                placeholder: "Select Subjects",
                                type: "select",
                            },
                            {
                                label: "Select Position:",
                                name: "positionId",
                                placeholder: "Select Position",
                                type: "select",
                            },
                            {
                                label: "Rate:",
                                name: "RateId",
                                placeholder: "rate",
                                type: "number",
                            },
                        ]}
                        submitBtn={updateItem?.id !== null ? "Update" : "Save"}
                        // submitBtn="Save"
                        onSubmit={(form) => updateItem?.id !== null ? onUpdate(form) : saveBuilding(form)}
                        updateItem={updateItem}
                    />*/}
                    <AddTeacherModal setOpen={setOpen} getAllTeacherStatics={getAllTeacherStatics}/>
                </Box>
            </Modal>
            {/*** ================= ADD TEACHER =================== ***/}


            {/*** ================= TIME TABLE =================== ***/}
            <Modal
                open={openTimeTable}
                onClose={handleCloseTimeTable}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={styleTable} component={styleTable2}>
                    <CloseMyButtonForChild onClick={handleCloseTimeTable}
                                           whileHover={{rotate: 180, scale: 1.1}}
                                           whileTap={{scale: 0.9}}
                                           transition={{duration: 0.3}}
                    ><RiCloseLine/></CloseMyButtonForChild>
                    <UserStatistics userName={selectUser} userId={selectUserId} date={new Date()} photo={selectPhoto}/>
                </Box>
            </Modal>
            {/*** ================= TIME TABLE =================== ***/}


            {/*** ================= TEACHER PANEL =================== ***/}
            <Modal
                open={openTeacherPanel}
                onClose={handleOpenTeacherPanel}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={{...styleTeacherPanel}}>
                    <CloseMyButtonForChild onClick={handleCloseTeacherPanel}
                                           whileHover={{rotate: 180, scale: 1.1}}
                                           whileTap={{scale: 0.9}}
                                           transition={{duration: 0.3}}
                    ><RiCloseLine/></CloseMyButtonForChild>
                    <TeacherPanel selectId={selectUserId} photo={selectPhoto}/>
                </Box>
            </Modal>
            {/*** ================= TEACHER PANEL =================== ***/}

        </Container>
    );
};

const styleMonthTable = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "80vw",
    minHeight: "70vh",
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 3,
    p: 4,
};
const styleMonthTable2 = styled.div`
    width: 97vw !important;
    padding: 10px !important;
`


const styleEdit = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 1,
    outline: 'none',
    p: 2,
};
const stylededit2 = styled.div`
    ${extrasmall({
        width: "97vw !important",
    })}
`
const Btn = styled.button`
    width: 200px;
    align-self: center;
    border: 1px solid ${mainColor};
    background-color: #fff;
    color: ${mainColor};
    border-radius: 0.5rem;
    padding: 10px 15px !important;

    &:hover {
        background-color: ${mainColor};
        color: white;
    }
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


const Wrapper = styled.div`
    width: 100%;
    display: flex;
    gap: 10px;
    margin: 5px !important;
`;
const Wrapperscroll = styled.div`
    padding-top: 20px;
    display: grid;
    overflow-y: scroll;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    ${extrasmall({
        height: '85vh',
        overflowY: 'scroll',
        gridTemplateColumns: '1fr',
        gap: '15px',
    })}
`

const Wrapper2 = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin: 5px !important;
`;

const Body = styled.div`
    width: 100%;
    background-color: #fff;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .MuiDataGrid-columnHeaderTitleContainer {
        justify-content: center;
    }
`;


const BtnWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    ${extrasmall({
        margin: '20px 0',
        justifyContent: 'center'
    })}
`

const Title = styled.h3`
    margin: 20px 0;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    color: ${mainColor};
`;

const Container = styled.div`
    width: 100%;
    padding: 10px !important;
`;


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 1,
    outline: 'none',
    p: 2,
};
const styleadd = styled.div`
    ${medium({
        width: '600px !important',
    })}
    ${small({
        width: '580px !important',
    })}
    ${extrasmall({
        width: '98vw !important',
    })}
`

const styleTable = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90vw',
    minHeight: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 3,
    p: 4,
};
const styleTable2 = styled.div`
    ${extrasmall({
        width: "97vw !important",
        padding: "10px !important",
    })}
`
const styleTeacherPanel = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "98vw",
    height: "98vh",
    overflowY: "scroll",
    bgcolor: 'background.paper',
    borderRadius: 3,
    boxShadow: 24,
    positions: 'relative',
}

export default KafedraTeachers;