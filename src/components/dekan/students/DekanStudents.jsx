import React, {useEffect, useState} from 'react';
import styled from 'styled-components'
import {BASE_URL, color_2, DEKAN, getHeaders, mainColor, STUDENT, TOKEN} from "../../../utills/ServiceUrls";
import {useNavigate, useParams} from "react-router-dom";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import axios from "axios";
import Spinner from "../../spinner/Spinner";
import {RiCloseLine} from "react-icons/ri";
import RektorTalabaForModal from "../../rektor/student/talaba/RektorTalabaForModal";
import {FiEdit} from "react-icons/fi";
import {BsTrash} from "react-icons/bs";
import {toast} from "react-toastify";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {extrasmall, medium, small} from "../../../responsiv";
import Autocomplete, {
    createFilterOptions
} from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import makeAnimated from "react-select/animated";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import moment from "moment";
import ButtonMui from "@mui/material/Button";
import {AnimatePresence} from "framer-motion";
import {motion as m} from "framer-motion";
import UsersMonthStatistics from "../../userStatistics/UsersMonthStatistics";
import jwtDecode from "jwt-decode";
import {Card, CardContent} from "@mui/material";
import ImportExportButton from "./importExportButton/ImportExportButton";
import {FaServer} from "react-icons/fa";
import {HiArchiveBoxArrowDown} from "react-icons/hi2";


const style = {
    position: 'absolute',
    overflow: "scroll",
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "95vw",
    height: "95vh",
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 5,
};


const styleEdit = {
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

const styleSave = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "40vw",
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 3,
    p: 4,
};

const stylemodalbox = styled.div`
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


const icon = <CheckBoxOutlineBlankIcon fontSize="small"/>;
const checkedIcon = <CheckBoxIcon fontSize="small"/>;

const DekanStudents = () => {
    const statusEdu = ['TEACHING', 'FINISHED', 'ACADEMIC_VACATION', 'EXPELLED_FROM_UNIVERSITY', 'ACADEMIC_DEBTOR', 'TRANSFER',]
    const courseData = [1, 2, 3, 4]
    const [spinner, setSpinner] = useState(true);
    const [dataModal, setDataModal] = useState({});

    // for modal
    const [show, setShow] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [allGroups, setAllGroups] = useState([])
    const [roleName, setRoleName] = useState("")
    const [courseLevel, setCourseLevel] = useState(courseData[0]);
    const [groupData, setGroupData] = useState([]);
    const [selectGroup, setSelectGroup] = useState("")
    const [selectGroupOne, setSelectGroupOne] = useState("")
    const [groupsDirection, setGroupsDirection] = useState([])
    const [selectDirection, setSelectDirection] = useState("")
    const navigate = useNavigate()
    const fetchData = () => {
        axios.post(BASE_URL + STUDENT.GET_STUDENT_WITH_RFID + "?endTime=" + chooseDayEnd + "&groupName=" + selectGroup + "&startTime=" + chooseDayStart)
            .then(res => {
                const resData=res.data?.obj
                setSpinner(false);
                setData(resData?.map((item,index)=>({...item,count:index+1})));
            })
            .catch(err => {
                console.log(err);
                toast.error(err?.response?.data?.message, {
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
    }
    const handleChange = (event) => {
        setCourseLevel(event.target.value);
    };
    const handleChange2 = (event) => {
        setSelectGroup(event.target.value);
    };
    const handleChange5 = (event) => {
        setSelectDirection(event.target.value);
    };
    const handleChange3 = (event, editData) => {
        //setSelectGroupOne(event.target.value);
        const groupName = event.target.value
        const {id} = editData
        axios.get(BASE_URL + `/student/changeGroupOfStudent/${id}?groupName=${groupName}`)
            .then((response) => {
                fetchData()
                toast.success('Success change group')
            })
            .catch((error) => {
                console.log(error, "error change group")
                toast.error('Error change group')
            })
    };
    const handleChange4 = (event, editData) => {
        const statusName = event.target.value
        const {id} = editData
        axios.get(BASE_URL + `/student/changeTeachStatusOfStudent/${id}?teachStatus=${statusName}`)
            .then((response) => {
                fetchData()
                toast.success('Success change status')
            })
            .catch((error) => {
                console.log(error, "error change status")
                toast.error('Error change status')
            })

    };

    useEffect(() => {
        const token = localStorage.getItem(TOKEN);
        const decode = jwtDecode(token);

        setRoleName(decode?.roles.find(i => i.roleName === "Ta'lim yo`nalishi rahbari o`rinbosari")?.roleName || "")

    }, [roleName])

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setEditOpen(false)
        setShow(false);
    }

    const studentDataFetch = (userId,accountNonLocked) => {
        console.log(accountNonLocked,'lll')
        axios.get(BASE_URL + DEKAN.STUDENT_ALL_DATA + userId)
            .then(res => {
                setDataModal(prev => ({
                    ...prev,
                    ...res.data,
                    accountNonLocked
                }))
            })
            .catch(err => {
                console.log(err);
            })
    }

    const columns = [
        {
            field: 'count',
            headerName: '№',
            width: 40,
            editable: false,
            align: 'center',
            justifyContent: 'center',
        },
        {
            field: 'fullName',
            headerName: 'Full Name',
            minWidth: 400,
            flex:1,
            editable: false,
            align: 'center',
            justifyContent: 'center',
            renderCell: (cellValues) => {
                return (
                    <Wrapper>
                        <Button
                            sx={{backgroundColor: 'transparent'}}
                            onClick={(event) => {
                                studentDataFetch(cellValues.id,cellValues.row?.accountNonLocked);
                                handleOpen()
                            }}
                        >
                            <StudentFullName>{cellValues.row.fullName}</StudentFullName>
                        </Button>
                    </Wrapper>
                );
            }
        },
        {
            field: 'dateAsc',
            headerName: 'Come In',
            type: 'dateTime',
            minWidth: 180,
            flex: 0.5,
            editable: false,
            align: 'center',
            justifyContent: 'center',
            renderCell: (cellValues) => {
                if (cellValues.row.dateAsc) {
                    const date = moment(new Date(cellValues.row.dateAsc)).format("DD-MM-YYYY,HH:mm:ss");
                    return (
                        <p>{date}</p>
                    )
                }
            }
        },
        {
            field: 'dateDesc',
            headerName: 'Come Out',
            type: 'dateTime',
            minWidth: 180,
            flex: 0.5,
            editable: false,
            align: 'center',
            justifyContent: 'center',
            renderCell: (cellValues) => {
                if (cellValues.row.dateDesc) {
                    const date = moment(cellValues.row.dateDesc).format("DD-MM-YYYY,HH:mm:ss");
                    return (
                        <p>{date}</p>
                    )
                }
            }
        },
        {
            field: 'email',
            headerName: 'Email',
            minWidth: 150,
            flex: 0.5,
            editable: false,
            align: 'center',
            justifyContent: 'center',
        },
        {
            field: 'passport',
            headerName: 'Passport',
            width: 200,
            editable: false,
            align: 'center',
            justifyContent: 'center',
        },
        {
            field: 'login',
            headerName: 'Login',
            width: 200,
            editable: false,
            align: 'center',
            justifyContent: 'center',
        },
        {
            field: 'changeGroup',
            headerName: 'Change group',
            width: 130,
            editable: false,
            align: 'center',
            justifyContent: 'center',
            renderCell: (cellValues) => {
                return (
                    <Wrapper>
                        <Box sx={{width: "130px"}}>
                            <FormControl fullWidth>
                                <Select
                                    size="small"
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    onChange={(event) => handleChange3(event, cellValues)}
                                >
                                    {groupData.map(name => (
                                        <MenuItem key={name} value={name}>{name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Wrapper>
                );
            }
        },
        {
            field: 'changeStatus',
            headerName: 'Change Status',
            width: 150,
            editable: false,
            align: 'center',
            justifyContent: 'center',
            renderCell: (cellValues) => {
                return (
                    <Wrapper>
                        <Box sx={{width: "150px"}}>
                            <FormControl fullWidth>
                                <Select
                                    size="small"
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    onChange={(event) => handleChange4(event, cellValues)}
                                >
                                    {statusEdu.map(name => (
                                        <MenuItem key={name} value={name}>{name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Wrapper>
                );
            }
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 130,
            editable: false,
            align: 'center',
            justifyContent: 'center',
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 100,
            editable: false,
            align: 'center',
            justifyContent: 'center',
            renderCell: (cellValues) => {
                if (roleName === "Ta'lim yo`nalishi rahbari o`rinbosari") {
                    return " "
                }
                return (
                    <Wrapper2>
                        <BtnEditPosition onClick={() => handleOpenEdit(cellValues?.row?.id)}><FiEdit/></BtnEditPosition>
                        <BtnEditPosition2 onClick={() => handleDeleted(cellValues?.row?.id, cellValues?.row?.fullName)}><BsTrash/></BtnEditPosition2>
                    </Wrapper2>
                );
            }
        },
    ];
    const [data, setData] = useState([]);

    const [groups, setGroups] = useState([]);
    const [editOpen, setEditOpen] = useState(false);
    const [edit, setEdit] = useState({
        id: '',
        fullName: '',
        rfid: '',
        login: '',
        email: '',
        passport: '',
        nationality: '',
        citizenship: '',
        level: 1,
        group: ''
    });

    const [chooseDay, setChooseDay] = useState(moment(new Date()).format("YYYY-MM-DD"))
    const [chooseDayStart, setChooseDayStart] = useState(moment(chooseDay).format("YYYY-MM-DDT00:00"))
    const [chooseDayEnd, setChooseDayEnd] = useState(moment(chooseDay).format("YYYY-MM-DDT23:59"))


    useEffect(() => {
        if (chooseDay) {
            fetchData();
        }
    }, [chooseDayEnd])
    const clickGedDate = (e) => {
        setChooseDay(e.target.value)
        setChooseDayStart(moment(e.target.value).format("YYYY-MM-DDT00:00"))
        setChooseDayEnd(moment(e.target.value).format("YYYY-MM-DDT23:59"))
    }

    const [openMonthModal, setOpenMonthModal] = useState(false);
    const handleCloseMonthModal = () => {
        setOpenMonthModal(false);
    }


    const {headers} = getHeaders();

    const handleOpenEdit = (id) => {
        axios.get(BASE_URL + "/dekan/getStudentDataWithUserId/" + id, {headers})
            .then(res => {
                setEdit(prev => ({
                    ...prev,
                    id: res?.data?.id,
                    fullName: res?.data?.fullName,
                    login: res?.data?.login,
                    email: res?.data?.email,
                    passport: res?.data?.passportNum,
                    rfid: res?.data?.rfid,
                    group: res?.data?.groupName,
                    level: res?.data?.level,
                    nationality: res?.data?.nationality,
                    citizenship: res?.data?.citizenship
                }))

            })
            .catch(err => {
                toast.error("error..")
            })

        setEditOpen(true);

    }
    const handleDeleted = (id, name) => {
        axios.get(`${BASE_URL}/student/changeActiveOfStudent/${id}`, {headers})
            .then(response => {
                toast.error(response?.data?.message, {
                    position: "top-right",
                    autoClose: false,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                })

                fetchData();
            })
            .catch(err => {
                console.log(err)
                toast.error(err?.response?.data?.message, {
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

    }
    const handleChangeValue = (e) => {
        setEdit(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    useEffect(() => {
        axios.get(BASE_URL + DEKAN.GET_GROUPS_NAMES_FOR_DEKAN_BY_FACULTY_ID_AND_LEVEL + courseLevel, {headers})
            .then(res => {
                const resData = res?.data
                setAllGroups(resData)
                const regex = /^[A-Z]+/;
                const uniquePrefixes = new Set();
                for (const item of resData) {
                    const match = item.match(regex);
                    if (match) {
                        uniquePrefixes.add(match[0]);
                    }
                }
                const directionData = [...uniquePrefixes]
                setGroupsDirection(directionData)
                setSelectDirection(directionData[0])


            })
            .catch(res => {
                console.log(res, "res err SIDEBAR");
            })
    }, [courseLevel]);

    useEffect(() => {
        if (allGroups.length > 0) {
            const feltGroups = allGroups.filter(group => group.substring(0, group.indexOf('-')) === selectDirection)
            setGroupData(feltGroups)
            setSelectGroup(feltGroups[0]);
        } else {
            setGroupData([])
            setSelectGroup("")
        }

    }, [selectDirection, allGroups]);

    useEffect(() => {
        setSpinner(() => true);
        fetchData();

    }, [selectGroup])
    useEffect(() => {
        axios.get(BASE_URL + DEKAN.GET_GROUPS_NAMES_FOR_DEKAN_BY_FACULTY_ID, {headers})
            .then(res => {
                setGroups(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }, [editOpen])


    const onEdit = () => {
        if (
            edit?.level !== "" &&
            edit?.level !== null &&
            edit?.fullName !== "" &&
            edit?.fullName !== null &&
            edit?.login !== "" &&
            edit?.login !== null &&
            edit?.passport !== "" &&
            edit?.passport !== null &&
            edit?.group !== "" &&
            edit?.group !== null &&
            edit?.rfid !== null &&
            edit?.rfid !== ""
        ) {
            axios.post(BASE_URL + "/dekan/changeStudent", edit, {headers})
                .then(res => {
                    if (res?.data?.success) {
                        toast.success(res?.data?.message);
                        setSpinner(() => true);
                        fetchData();
                        setEditOpen(false);
                    } else {
                        toast.error(res?.data?.message)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        } else {
            console.log(edit)
            toast.warning("Empty any fields..")
        }
    }

    const [groupsAll, setGroupsAll] = useState([])

    useEffect(() => {
        axios.get(BASE_URL + DEKAN.GET_GROUPS_NAMES_FOR_DEKAN_BY_FACULTY_ID, {headers})
            .then(res => {
                setGroupsAll(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    const handleShow = () => {
        setEdit({
            id: '',
            fullName: '',
            rfid: '',
            login: '',
            email: '',
            passport: '',
            nationality: '',
            citizenship: '',
            level: courseLevel,
            group: selectGroup
        })
        setShow(true);
    }

    const [userOptions, setUserOptions] = useState([]);
    const [owner, setOwner] = useState(null);
    const handleSearch = (e) => {

        if (e.length > 3) {

            axios.get(BASE_URL + "/user/getUsersForUserRole2?keyword=" + e, {headers})
                .then(res => {
                    // console.log(res?.data)
                    setUserOptions(res?.data?.obj)
                })
                .catch(err => {
                    console.log(err);
                })

        }
    }
    const onAddStudent = () => {
        (owner && owner?.value) ? axios.post(BASE_URL + "/dekanat/addNewStudent", {
                userId: owner?.value,
                groupName: selectGroup
            }, {headers})
                .then(res => {
                    // console.log(res)
                    setSpinner(true)
                    setShow(false)

                    toast.success(`${owner?.value} add successfully!.`)
                    fetchData();
                    setOwner(null);
                })
                .catch(err => {
                    console.log(err)
                })
            : toast.warning("Empty any field..");
    }

    const filterOptions = createFilterOptions({
        stringify: ({firstName, lastName, login, passport}) => `${firstName} ${lastName} ${login} ${passport}`
    });

    return (
        <Container>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'end',
                }}
            >
                <ImportExportButton/>
            </Box>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                mb: 2,
            }}>
                <Box sx={{
                    my: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    flexWrap: 'wrap'
                }}>
                    <Box sx={{width: "200px"}}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Course</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={courseLevel}
                                label="Course"
                                onChange={handleChange}
                            >
                                {courseData.map(level => (
                                    <MenuItem key={level} value={level}>{level}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{width: "200px"}}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Yo'nalish</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectDirection}
                                label="Yo'nalish"
                                onChange={handleChange5}
                            >

                                {groupsDirection.length > 0 ? groupsDirection.map(name => (
                                    <MenuItem key={name} value={name}>{name}</MenuItem>
                                )) : (
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{width: "200px"}}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Group</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectGroup}
                                label="Group"
                                onChange={handleChange2}
                            >

                                {groupData.length > 0 ? groupData.map(name => (
                                    <MenuItem key={name} value={name}>{name}</MenuItem>
                                )) : (
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                <ButtonMui
                    variant={'contained'}
                    color={'inherit'}
                    size={'large'}
                    onClick={() => navigate('arxiv')}
                    endIcon={<HiArchiveBoxArrowDown/>}
                >
                    Archive
                </ButtonMui>
            </Box>

            <Header>
                <Group>
                    <CourseWrapper><span>{courseLevel}</span> - course</CourseWrapper>
                    <GroupWrapper><span>{selectGroup}</span> - group</GroupWrapper>
                </Group>
                {roleName !== "Ta'lim yo`nalishi rahbari o`rinbosari" &&
                    <ButtonMui variant={'outlined'} onClick={() => handleShow()}>Add student</ButtonMui>}
            </Header>

            <Header2>
                <HeaderItem>
                    <WrapperDuring>
                        <Label htmlFor="start">Choose day:</Label>
                        <Input
                            value={chooseDay}
                            id={"start"}
                            placeholder={"end"}
                            onChange={clickGedDate}
                        />
                    </WrapperDuring>
                </HeaderItem>
                <HeaderItem>
                    {selectGroup &&
                        <ButtonMui component={OpenBtn} variant="contained" onClick={() => setOpenMonthModal(true)}>
                            Monthly Statistics
                        </ButtonMui>}
                </HeaderItem>
            </Header2>

            <Card>
                <CardContent>

                    {
                        spinner ? <Spinner/> : <DataGrid
                            sx={{width: "100%", minHeight: "300px!important"}}
                            columns={columns}
                            rows={data}
                            components={{Toolbar: GridToolbar}}
                            autoHeight
                            rowsPerPageOptions={[30,40,60,90,100]}
                            initialState={{ // hide items
                                ...data.initialState,
                                columns: {
                                    columnVisibilityModel: {
                                        id: false,
                                        email: false,
                                        cardNo: false,
                                        login: false,
                                        passport: false,
                                        changeGroup: false,
                                        changeStatus: false,
                                        action: false,
                                    },
                                },
                            }}
                        />
                    }
                </CardContent>
            </Card>

            {/*** ================= data of students =================== ***/}
            <Modal
                hideBackdrop
                open={open}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    <CloseButtonForChild onClick={handleClose}><RiCloseLine/></CloseButtonForChild>
                    <RektorTalabaForModal
                        data={dataModal && dataModal}
                        accountLocked={dataModal?.accountNonLocked}
                        group={selectGroup}
                        results={dataModal && dataModal.results}
                    />
                </Box>
            </Modal>


            {/*** ================= edit student =================== ***/}
            <Modal
                open={editOpen}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={styleEdit} component={stylemodalbox}>
                    <CloseMyButtonForChild onClick={handleClose}><RiCloseLine/></CloseMyButtonForChild>
                    <h3 style={{color: `${mainColor}`, fontSize: "24px"}}>{edit?.fullName}</h3>
                    <WrapInputs>

                        <TextField id="outlined-basic" label="Full Name" variant="outlined"
                                   value={edit?.fullName}
                                   name={"fullName"}
                                   onChange={handleChangeValue}
                        />

                        <TextField id="outlined-basic" label="RFID" variant="outlined"
                                   value={edit?.rfid}
                                   name={"rfid"}
                                   onChange={handleChangeValue}
                                   disabled={true}
                        />


                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Course</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={edit?.level}
                                label="Course"
                                name={"level"}
                                onChange={handleChangeValue}
                                disabled={false}
                            >
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={4}>4</MenuItem>
                            </Select>
                        </FormControl>


                        <TextField id="outlined-basic" label="Login" variant="outlined"
                                   value={edit?.login}
                                   name={"login"}
                                   onChange={handleChangeValue}
                        />

                        <TextField id="outlined-basic" label="Citizenship" variant="outlined"
                                   value={edit?.citizenship}
                                   name={"citizenship"}
                                   onChange={handleChangeValue}
                        />

                        <TextField id="outlined-basic" label="Email" variant="outlined"
                                   value={edit?.email}
                                   name={"email"}
                                   onChange={handleChangeValue}
                        />


                        <TextField id="outlined-basic" label="Passport" variant="outlined"
                                   value={edit?.passport}
                                   name={"passport"}
                                   onChange={handleChangeValue}
                        />




                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Group</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={edit?.group}
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

                        <TextField id="outlined-basic" label="Nationality" variant="outlined"
                                   value={edit?.nationality}
                                   name={"nationality"}
                                   onChange={handleChangeValue}
                        />

                    </WrapInputs>

                    <ButtonMui
                        size={"large"}
                        sx={{m: "0 0 0 auto"}}
                        variant={'contained'}
                        onClick={onEdit}
                    >Update</ButtonMui>
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
                <Box sx={styleSave} component={styleCreateModalMobil}>
                    <CloseMyButtonForChild onClick={handleClose}><RiCloseLine/></CloseMyButtonForChild>
                    <h3 style={{color: `${mainColor}`}}>Add student</h3>
                    <Box component={styleCreateModal}>
                        <Autocomplete
                            id="checkboxes-tags-demo"
                            options={userOptions}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option?.lastName + " " + option?.firstName}
                            value={owner}
                            filterOptions={filterOptions}
                            onChange={(event, newValue) => {
                                console.log(newValue, "new value")
                                setOwner(newValue)

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
                                <TextField {...params} label="Student" placeholder="Student"/>
                            )}
                        />

                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Group</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={edit?.group}
                                label="Group"
                                name={'group'}
                                onChange={handleChangeValue}
                                disabled={true}
                            >
                                {
                                    groups?.map(i => {
                                        return <MenuItem value={i.name} key={i.id}>{i.name}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Box>
                    <ButtonMui sx={{width: "200px", margin: "0 auto"}} variant={'contained'}
                               onClick={onAddStudent}>Save</ButtonMui>
                </Box>
            </Modal>
            {/*** ================= create student =================== ***/}

            <AnimatePresence>
                {
                    openMonthModal && <Modal
                        open={openMonthModal}
                        onClose={handleCloseMonthModal}
                        aria-labelledby="keep-mounted-modal-title"
                        aria-describedby="keep-mounted-modal-description"
                        component={m.div}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{duration: 0.3}}
                        exit={{opacity: 0}}
                    >
                        <Box sx={styleMonthTable}>
                            <CloseMyButtonForChild onClick={handleCloseMonthModal}
                                                   whileHover={{rotate: 180, scale: 1.1}}
                                                   whileTap={{scale: 0.9}}
                                                   transition={{duration: 0.3}}
                            ><RiCloseLine/></CloseMyButtonForChild>
                            <UsersMonthStatistics colName={"Students"} isTeacher={true} date={new Date()}
                                                  userName={selectGroup}
                                                  kafedraId={groupsAll?.find(i => i?.name === selectGroup)?.id}
                                                  url={"/dekanat/getStatisticsOfGroupForDean?groupId="}/>
                        </Box>
                    </Modal>
                }
            </AnimatePresence>

        </Container>
    );
};
const styleCreateModal = styled.div`
    display: grid;
    grid-template-columns:1fr 1fr;
    gap: 25px;
    ${extrasmall({
        gridTemplateColumns: '1fr',
    })}
`
const styleCreateModalMobil = styled.div`
    ${medium({
        width: "90vw !important",
    })}
    ${small({
        width: "95vw !important",
    })}

    ${extrasmall({
        width: "95vw !important",
    })}`
const styleMonthTable = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "85vw",
    minHeight: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 3,
    p: 4,
};



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

const Wrapper3 = styled.div`
    width: 100%;
    display: flex;
    overflow: scroll;
    flex-wrap: nowrap;
    gap: 5px;
`;


const Wrapper2 = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin: 5px !important;
`;

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


const CloseButtonForChild = styled.button`
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.8);
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



const StudentFullName = styled.span`
    width: 100%;
    font-size: 14px;
    display: flex;
    justify-content: flex-start;
`;

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


const GroupWrapper = styled.div`
    font-size: 23px;

    & > span {
        font-size: 25px;
        font-weight: 600;
    }
`;
const CourseWrapper = styled.div`
    font-size: 23px;

    & > span {
        font-size: 25px;
        font-weight: 600;
    }
`;

const Group = styled.div`
    display: flex;
    gap: 30px;
    flex-wrap: wrap;
    ${extrasmall({
        justifyContent: "center"
    })}

`

const OpenBtn = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 10px !important;
    font-size: 16px !important;
`

const Input = styled.input.attrs({type: 'date'})`
    width: 150px;
    padding: 5px 10px;
    background: white;
    font-size: 18px;
    border-radius: 5px;
    cursor: pointer;
    border: 1px solid ${mainColor};
    color: ${mainColor};

    &:focus {
        outline: none;
    }
`

const Label = styled.label`
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px !important;
    letter-spacing: 1px;
`;
const WrapperDuring = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 15px;

`;
const HeaderItem = styled.div`
    flex: 1;
    padding: 0 15px;
    display: flex;
    align-items: center;
    font-size: 18px;
`;

const Header2 = styled.div`
    width: 100%;
    color: ${mainColor};
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    margin: 20px 0;
    ${medium({
        gridTemplateColumns: "1fr 1fr",
        gap: "15px",
    })}
    ${small({
        gridTemplateColumns: "1fr ",
        gap: "15px",
    })}
    ${extrasmall({
        gridTemplateColumns: "1fr ",
        gap: "20px",
    })}
`;

const Header = styled.div`
    width: 100%;
    min-height: 40px;
    background-color: #fff;
    border-radius: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: space-between;
    //flex-direction: column;
    padding: 10px !important;
    padding-right: 20px !important;
    margin-bottom: 10px !important;
    color: ${mainColor};
    ${extrasmall({
        justifyContent: "center",
    })}
`;

const Container = styled.div`
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    padding: 1rem;
    .MuiDataGrid-columnHeaderTitleContainer {
        justify-content: center;
    }
`;

export default DekanStudents;