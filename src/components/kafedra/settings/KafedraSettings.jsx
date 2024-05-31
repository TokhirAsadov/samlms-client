import React, {useState} from 'react';
import styled from "styled-components";
import {BASE_URL, getHeaders, mainColor, TOKEN, TokenType} from "../../../utills/ServiceUrls";
import {useDispatch, useSelector} from "react-redux";
import {
    FaArrowRight,
    FaAt,
    FaEdit,
    FaFacebook,
    FaFlag,
    FaImage,
    FaInstagram,
    FaMobile,
    FaPassport,
    FaPencilAlt,
    FaPhone,
    FaSave,
    FaTelegram,
    FaUser
} from "react-icons/fa";
import jwtDecode from "jwt-decode";
import axios from "axios";
import {fetchUser} from "../../../redux/actions/user/user_actions";
import {useHttp} from "../../hook/useHttp";
import moment from "moment";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {RiCloseLine} from "react-icons/ri";
import SavePhoneNumber from "../../form/SavePhoneNumber";
import SaveAddress from "../../form/SaveAddress";
import {toast} from "react-toastify";
import {HiOutlineKey} from "react-icons/hi";
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {extrasmall, large, medium, small} from "../../../responsiv";
import Noimg from "../../../utills/images/no-picture.jpg";
import {Card, CardContent} from "@mui/material";
import {IoClose} from "react-icons/io5";
import ButtonMui from "@mui/material/Button";
import {FaCakeCandles, FaLocationDot, FaMapLocationDot, FaRectangleXmark} from "react-icons/fa6";
import ChangeRoomDepartment from "./ChangeRoomDepartment";
import {BsFillDoorOpenFill} from "react-icons/bs";


const KafedraSettings = () => {

    const teacher = useSelector(state => state?.teacher?.teacher);
    const user = useSelector(state => state?.user?.user);
    const token = localStorage.getItem(TOKEN)
    const decode = jwtDecode(token);
    const roleName = decode.roles;
    const {headers} = getHeaders();
    const [isName, setIsName] = useState(false);
    const [isPassport, setIsPassport] = useState(false);
    const [isEmail, setIsEmail] = useState(false);
    const [isBrith, setIsBirth] = useState(false);
    const [isNation, setIsNation] = useState(false);
    const [isCivil, setIsCivil] = useState(false);
    const [isMyPhone, setIsMyPhone] = useState(false);
    const [isMotherPhone, setIsMotherPhone] = useState(false);
    const [isFatherPhone, setIsFatherPhone] = useState(false);
    const [isAddress, setIsAddress] = useState(false);
    const [isAddressMap, setIsAddressMap] = useState(false);
    const [name, setName] = useState("");
    const [passport, setPassport] = useState("");
    const [email, setEmail] = useState("");
    const [birth, setBirth] = useState(null);
    const [nation, setNation] = useState("");
    const [civil, setCivil] = useState("");
    const [openChange, setOpenChange] = useState(false)
    const [isHovering, setIsHovering] = useState(false);
    const [changeRoomModal, setChangeRoomModal] = useState(false);

    const handleMouseOver = () => {
        setIsHovering(true);
    };
    const handleCloseModal = () => {
        setOpenChange(false)
    }
    const handleOpenModal = () => {
        setOpenChange(true)
    }
    const handleMouseOut = () => {
        setIsHovering(false);
    };

    const {request} = useHttp();
    const dispatch = useDispatch();

    const savePhoto = (e) => {
        e.preventDefault()
        const url = BASE_URL + '/attachment/uploadPhoto';
        const formData = new FormData();
        formData.append('file', e.target.files[0]);
        const token = localStorage.getItem(TOKEN)
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': TokenType + token,
                'Access-Control-Allow-Origin': '*'
            }
        }
        axios.post(url, formData, config)
            .then((response) => {
                console.log(response.data, 'RES');
                dispatch(fetchUser(request));
            })
    }

    const handleClose = () => {
        setIsMyPhone(false);
        setIsFatherPhone(false);
        setIsMotherPhone(false);
        setIsAddressMap(false);
        setIsAddress(false);
        setEdit(false)
        setChangeRoomModal(false)
    }


    const saveFullName = async () => {
        name.length > 3 && await axios.get(BASE_URL + "/user/updateFullName?fullName=" + name, {headers})
            .then(res => {
                // console.log(res)
                setName("");
                setIsName(false);
                dispatch(fetchUser(request))
                toast.success("Changed full name successfully!...");
            })
            .catch(err => {
                console.log(err);
            })
    }

    const saveCivil = async () => {
        civil.length > 3 && await axios.get(BASE_URL + "/user/updateCivil?civil=" + civil, {headers})
            .then(res => {
                // console.log(res)
                setCivil("");
                setIsCivil(false);
                dispatch(fetchUser(request))
                toast.success("Changed civil successfully!...")
            })
            .catch(err => {
                console.log(err);
            })
    }

    const saveNation = async () => {
        nation.length > 3 && await axios.get(BASE_URL + "/user/updateNation?nation=" + nation, {headers})
            .then(res => {
                // console.log(res)
                setNation("");
                setIsNation(false);
                dispatch(fetchUser(request))
                toast.success("Changed nation successfully!...")
            })
            .catch(err => {
                console.log(err);
            })
    }

    const saveBirth = async () => {
        birth !== null && await axios.get(BASE_URL + "/user/updateBirth?birth=" + birth, {headers})
            .then(res => {
                // console.log(res)
                setBirth("");
                setIsBirth(false);
                dispatch(fetchUser(request))
                toast.success("Changed birth day successfully!...")
            })
            .catch(err => {
                console.log(err);
            })
    }

    const validateEmail = (email) => {
        let re = String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        if (!re) alert("Invalid email:(")
        return re;
    };


    const saveEmail = async () => {
        validateEmail(email) && await axios.get(BASE_URL + "/user/updateEmail?email=" + email, {headers})
            .then(res => {
                // console.log(res)
                setEmail("");
                setIsEmail(false);
                dispatch(fetchUser(request))
                toast.success("Changed email successfully!...")
            })
            .catch(err => {
                console.log(err);
            })
    }


    const [edit, setEdit] = useState(false)
    const [editUser, setEditUser] = useState({password: ''})
    const [showPassword, setShowPassword] = React.useState(false);

    const handleChangeValue = (e) => {
        setEditUser(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleSecurity = () => {
        setEdit(true);
    }

    const submitSecurity = () => {

        if (
            editUser !== undefined &&
            editUser !== null &&
            editUser?.password !== undefined &&
            editUser?.password !== "" &&
            editUser?.password !== null
        ) {
            axios.post(BASE_URL + "/user/changeLogin", editUser, {headers})
                .then(res => {
                    dispatch(fetchUser(request));
                    handleClose();
                    setEditUser({password: ''})
                    toast.success('Successfully')
                })
                .catch(err => {
                    toast.warning(err?.response?.data?.message)
                })
        } else {
            toast.warning("Empty any fields..")
        }
    }


    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };


    return (
        <Container>
            <Boxwr>
                <Header>
                    <Card sx={{width: '100%'}}>
                        <CardContent>
                            <UserFieldWrapper>
                                <Fields>
                                    <Box display={'flex'} justifyContent={'end'}>
                                        <IconButton onClick={handleOpenModal}>
                                            <FaEdit size={20}/>
                                        </IconButton>
                                    </Box>
                                    <ImageWrapper onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                                        <Img>
                                            {
                                                user?.photos?.id ? <img
                                                    src={BASE_URL + "/attachment/download/" + user?.photos?.id}
                                                    width={"240px"} height={"240px"}
                                                    alt={user?.fullName}
                                                    style={{borderRadius: "50%"}}
                                                /> : <img src={Noimg} alt={"img"} style={{width: "100%"}}/>
                                            }
                                        </Img>
                                        {
                                            isHovering && <label style={{
                                                minHeight: "40px",
                                                position: "absolute",
                                                bottom: "0",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                width: "100%",
                                                fontSize: "28px",
                                                backgroundColor: "rgba(85,76,76,0.4)",
                                                cursor: "pointer"
                                            }}>
                                                <input type="file"
                                                       accept="image/png, image/jpeg"
                                                       style={{display: "none"}}
                                                       onChange={savePhoto}
                                                />
                                                <FaImage/>
                                            </label>
                                        }
                                    </ImageWrapper>
                                    <FullName><span>Full name: </span>{user?.fullName}</FullName>
                                    <RoleName><span>Passport series: </span>{user?.passportNum}</RoleName>
                                    <RoleName><span>Nationality: </span> {user?.nationality}</RoleName>
                                    <RoleName><span>Citizenship:</span> {user?.citizenship}</RoleName>
                                    <RoleName><span>Date of birth: </span>{moment(new Date(user?.bornYear)).format("DD.MM.YYYY")}
                                    </RoleName>
                                    <RoleName><span>Address:</span> {user?.address}</RoleName>
                                    <RoleName><span>Address(temporary):</span> {user?.addressCurrent}</RoleName>

                                </Fields>
                            </UserFieldWrapper>
                        </CardContent>
                    </Card>

                </Header>
                <Body>
                    <Card>
                        <CardContent>
                            <Fields>
                                <RoleName><span>Login: </span>{teacher?.login}</RoleName>
                                <RoleName><span>Email: </span>{teacher?.email}</RoleName>
                                <RoleName><span>Role: </span>{roleName?.map(item => (<>{item?.roleName?.slice(5)} ,</>))}
                                </RoleName>
                                <RoleName><span>Position: </span>{teacher?.positions[0]}</RoleName>
                                <RoleName><span>Workplace: </span>{teacher?.workerStatus}</RoleName>
                                <FullName><span>Department name: </span>{teacher?.kafedraName}</FullName>
                                <FullName><span>Mobile phone: </span>{teacher?.phones?.find(i => i?.phoneType == 'MOBILE_PHONE')?.phoneNumber}
                                </FullName>
                                <FullName><span>Work phone: </span>{teacher?.phones?.find(i => i?.phoneType == 'WORK_PHONE')?.phoneNumber}
                                </FullName>
                                <FullName><span>Home phone: </span>{teacher?.phones?.find(i => i?.phoneType == 'HOME_PHONE')?.phoneNumber}
                                </FullName>
                            </Fields>
                        </CardContent>
                    </Card>
                    <Box
                    sx={{
                        display:'flex',
                        gap:5,
                        flexWrap: 'wrap',
                    }}
                    >
                        <ButtonMui
                            size={'small'}
                            onClick={handleSecurity}
                            variant={'contained'}
                            startIcon={<HiOutlineKey
                                style={{fontSize: '20px', marginRight: '5px'}}/>}
                        >
                            Change login and password
                        </ButtonMui>
                        <ButtonMui
                            size={'small'}
                            onClick={() => setChangeRoomModal(true)}
                            variant={'contained'}
                            startIcon={<BsFillDoorOpenFill
                                style={{fontSize: '20px', marginRight: '5px'}}/>}
                        >
                            Audience
                        </ButtonMui>
                    </Box>

                </Body>
            </Boxwr>

            {/*** ================= edit staff =================== ***/}
            <Modal
                open={edit}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={styleChangePassword} component={styleChangePassword2}>
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <h5 style={{color: `${mainColor}`, fontSize: "18px"}}>Change password</h5>
                        <IconButton onClick={handleClose}>
                            <RiCloseLine/>
                        </IconButton>
                    </Box>
                    <Box sx={{display: 'grid', gridTemplateColumns: '1fr', gap: '20px', mt: '20px'}}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">New password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                onChange={handleChangeValue}
                                name={'password'}
                                value={editUser?.password}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            onChange={handleChangeValue}
                                            value={editUser?.password}
                                            name={'password'}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="new password"
                            />
                        </FormControl>
                        <ButtonMui variant={'contained'} onClick={submitSecurity}>Save</ButtonMui>
                    </Box>

                </Box>
            </Modal>
            {/*** ================= edit staff =================== ***/}
            <Modal
                open={changeRoomModal}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={styleChangePassword} component={styleChangePassword2}>
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <h5 style={{color: `${mainColor}`, fontSize: "18px"}}>Audeience</h5>
                        <IconButton onClick={handleClose}>
                            <RiCloseLine/>
                        </IconButton>
                    </Box>
                    <ChangeRoomDepartment handleClose={handleClose}/>
                </Box>
            </Modal>
            <Modal
                open={openChange}
                onClose={handleCloseModal}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={styleModalCreate}
                     component={styleAddSm}
                >
                    <ModalTitle>
                        <h4></h4>
                        <IconButton onClick={handleCloseModal}> <IoClose size={22}/></IconButton>
                    </ModalTitle>
                    <Box
                        sx={{
                            marginTop: '15px',
                            overflow: 'scroll'
                        }}
                    >
                        <BodySection>
                            <BodyRow>
                                <BodyLabel><Icon><FaUser/></Icon><LabelValue>Full
                                    Name:</LabelValue></BodyLabel>
                                {
                                    isName ?
                                        <>
                                            <Input value={name} onChange={(e) => setName(e.target.value)}/>
                                            <Button onClick={saveFullName}><FaSave/></Button>
                                            <Button onClick={() => setIsName(false)} color={"#f00"}><FaRectangleXmark/></Button>
                                        </>
                                        :
                                        <>
                                            <BodyItem>{user?.fullName}</BodyItem>
                                            <Button onClick={() => setIsName(true)}><FaPencilAlt/></Button>
                                        </>
                                }
                            </BodyRow>
                            <BodyRow>
                                <BodyLabel><Icon><FaAt/></Icon><LabelValue>Email:</LabelValue></BodyLabel>
                                {
                                    isEmail ?
                                        <>
                                            <Input type="email" value={email}
                                                   onChange={(e) => setEmail(e.target.value)}/>
                                            <Button onClick={saveEmail}><FaSave/></Button>
                                            <Button onClick={() => setIsEmail(false)} color={"#f00"}><FaRectangleXmark/></Button>
                                        </>
                                        :
                                        <>
                                            <BodyItem>{user?.email}</BodyItem>
                                            <Button onClick={() => setIsEmail(true)}><FaPencilAlt/></Button>
                                        </>
                                }
                            </BodyRow>
                            <BodyRow>
                                <BodyLabel><Icon><FaPassport/></Icon><LabelValue>Passport:</LabelValue></BodyLabel>
                                {
                                    isPassport ?
                                        <>
                                            <Input value={passport} onChange={(e) => setPassport(e.target.value)}/>
                                            <Button onClick={() => setIsPassport(false)}>
                                                <FaSave/></Button>
                                            <Button onClick={() => setIsPassport(false)}
                                                    color={"#f00"}><FaRectangleXmark/></Button>
                                        </>
                                        :
                                        <>
                                            <BodyItem>{user?.passportNum}</BodyItem>
                                            <Button onClick={() => setIsPassport(true)}><FaPencilAlt/></Button>
                                        </>
                                }
                            </BodyRow>
                            <BodyRow>
                                <BodyLabel><Icon><FaCakeCandles/></Icon><LabelValue>Birthday:</LabelValue></BodyLabel>
                                {
                                    isBrith ?
                                        <>
                                            <input type="date" value={birth}
                                                   onChange={(e) => setBirth(e.target.value)}/>
                                            <Button onClick={saveBirth}><FaSave/></Button>
                                            <Button onClick={() => setIsBirth(false)} color={"#f00"}><FaRectangleXmark/></Button>
                                        </>
                                        :
                                        <>
                                            <BodyItem>{moment(new Date(user?.bornYear)).format("DD.MM.yyyy")}</BodyItem>
                                            <Button onClick={() => setIsBirth(true)}><FaPencilAlt/></Button>
                                        </>
                                }
                            </BodyRow>
                            <BodyRow>
                                <BodyLabel><Icon><FaFlag/></Icon><LabelValue>The
                                    nation:</LabelValue></BodyLabel>
                                {
                                    isNation ?
                                        <>
                                            <Input value={nation} onChange={(e) => setNation(e.target.value)}/>
                                            <Button onClick={saveNation}><FaSave/></Button>
                                            <Button onClick={() => setIsNation(false)}
                                                    color={"#f00"}><FaRectangleXmark/></Button>
                                        </>
                                        :
                                        <>
                                            <BodyItem>{user?.nationality}</BodyItem>
                                            <Button onClick={() => setIsNation(true)}><FaPencilAlt/></Button>
                                        </>
                                }
                            </BodyRow>
                            <BodyRow>
                                <BodyLabel><Icon><FaFlag/></Icon><LabelValue>The
                                    civil:</LabelValue></BodyLabel>
                                {
                                    isCivil ?
                                        <>
                                            <Input value={civil} onChange={(e) => setCivil(e.target.value)}/>
                                            <Button onClick={saveCivil}><FaSave/></Button>
                                            <Button onClick={() => setIsCivil(false)} color={"#f00"}><FaRectangleXmark/></Button>
                                        </>
                                        :
                                        <>
                                            <BodyItem>{user?.citizenship}</BodyItem>
                                            <Button onClick={() => setIsCivil(true)}><FaPencilAlt/></Button>
                                        </>
                                }
                            </BodyRow>
                            <BodyRow>
                                <BodyLabel><Icon><FaMobile/></Icon><LabelValue fs={isMyPhone}>Mobile
                                    Phone:</LabelValue></BodyLabel>

                                {
                                    isMyPhone ?
                                        <>

                                        </>
                                        :
                                        <>
                                            <BodyItem>
                                                {user?.phones.filter(item => item.phoneType === "MOBILE_PHONE")[0]?.phoneNumber}
                                                {
                                                    user?.phones.filter(item => item.phoneType === "MOBILE_PHONE")[0]?.hasTg
                                                    &&
                                                    <FaTelegram/>
                                                }
                                                {
                                                    user?.phones.filter(item => item.phoneType === "MOBILE_PHONE")[0]?.hasInstagram
                                                    &&
                                                    <FaInstagram/>
                                                }
                                                {
                                                    user?.phones.filter(item => item.phoneType === "MOBILE_PHONE")[0]?.hasFacebook
                                                    &&
                                                    <FaFacebook/>
                                                }
                                            </BodyItem>
                                            <Button onClick={() => setIsMyPhone(true)}><FaPencilAlt/></Button>
                                        </>
                                }


                                {/*** ================= change mobile phone =================== ***/}
                                <Modal
                                    open={isMyPhone}
                                    onClose={handleClose}
                                    aria-labelledby="keep-mounted-modal-title"
                                    aria-describedby="keep-mounted-modal-description"
                                >
                                    <Box sx={style} component={style2}>
                                        <CloseMyButtonForChild
                                            onClick={handleClose}><RiCloseLine/></CloseMyButtonForChild>
                                        <SavePhoneNumber
                                            title={"Mobile Phone"}
                                            phoneType={"MOBILE_PHONE"}
                                            formArr={[
                                                {
                                                    label: "id",
                                                    name: "id",
                                                    placeholder: "Enter id of build",
                                                    icon: FaArrowRight,
                                                    type: "text",
                                                },
                                                {
                                                    label: "Phone Number:",
                                                    name: "phoneNumber",
                                                    placeholder: "Phone Number:",
                                                    type: "phone",
                                                },
                                                {
                                                    label: "Has Tg:",
                                                    name: "hasTg",
                                                    placeholder: "Has Tg",
                                                    icon: FaTelegram,
                                                    type: "checkbox",
                                                },
                                                {
                                                    label: "Has Instagram:",
                                                    name: "hasInstagram",
                                                    placeholder: "Has Instagram",
                                                    icon: FaInstagram,
                                                    type: "checkbox",
                                                },
                                                {
                                                    label: "Has Facebook:",
                                                    name: "hasFacebook",
                                                    placeholder: "Has Facebook",
                                                    icon: FaFacebook,
                                                    type: "checkbox",
                                                }
                                            ]}
                                            onClose={() => setIsMyPhone(false)}
                                        />
                                    </Box>
                                </Modal>
                                {/*** ================= change mobile phone =================== ***/}


                            </BodyRow>
                            <BodyRow>
                                <BodyLabel><Icon><FaPhone/></Icon><LabelValue fs={isFatherPhone}>Home
                                    Phone:</LabelValue></BodyLabel>
                                {
                                    isFatherPhone ?
                                        <>

                                        </>
                                        :
                                        <>
                                            <BodyItem>
                                                {user?.phones.filter(item => item.phoneType === "HOME_PHONE")[0]?.phoneNumber}

                                                {
                                                    user?.phones.filter(item => item.phoneType === "HOME_PHONE")[0]?.hasTg
                                                    &&
                                                    <FaTelegram/>
                                                }
                                                {
                                                    user?.phones.filter(item => item.phoneType === "HOME_PHONE")[0]?.hasInstagram
                                                    &&
                                                    <FaInstagram/>
                                                }
                                                {
                                                    user?.phones.filter(item => item.phoneType === "HOME_PHONE")[0]?.hasFacebook
                                                    &&
                                                    <FaFacebook/>
                                                }
                                            </BodyItem>
                                            <Button onClick={() => setIsFatherPhone(true)}><FaPencilAlt/></Button>
                                        </>
                                }

                                {/*** ================= change father phone =================== ***/}
                                <Modal
                                    open={isFatherPhone}
                                    onClose={handleClose}
                                    aria-labelledby="keep-mounted-modal-title"
                                    aria-describedby="keep-mounted-modal-description"
                                >
                                    <Box sx={style} component={style2}>
                                        <CloseMyButtonForChild
                                            onClick={handleClose}><RiCloseLine/></CloseMyButtonForChild>
                                        <SavePhoneNumber
                                            title={"Home Phone"}
                                            phoneType={"HOME_PHONE"}
                                            formArr={[
                                                {
                                                    label: "id",
                                                    name: "id",
                                                    placeholder: "Enter id of phone",
                                                    icon: FaArrowRight,
                                                    type: "text",
                                                },
                                                {
                                                    label: "Phone Number:",
                                                    name: "phoneNumber",
                                                    placeholder: "Phone Number:",
                                                    type: "phone",
                                                },
                                                {
                                                    label: "Has Tg:",
                                                    name: "hasTg",
                                                    placeholder: "Has Tg",
                                                    icon: FaTelegram,
                                                    type: "checkbox",
                                                },
                                                {
                                                    label: "Has Instagram:",
                                                    name: "hasInstagram",
                                                    placeholder: "Has Instagram",
                                                    icon: FaInstagram,
                                                    type: "checkbox",
                                                },
                                                {
                                                    label: "Has Facebook:",
                                                    name: "hasFacebook",
                                                    placeholder: "Has Facebook",
                                                    icon: FaFacebook,
                                                    type: "checkbox",
                                                }
                                            ]}
                                            onClose={() => setIsFatherPhone(false)}
                                        />
                                    </Box>
                                </Modal>
                                {/*** ================= change HOME phone =================== ***/}

                            </BodyRow>
                            <BodyRow>
                                <BodyLabel><Icon><FaPhone/></Icon><LabelValue fs={isMotherPhone}>Work
                                    Phone:</LabelValue></BodyLabel>
                                {
                                    isMotherPhone ?
                                        <>
                                        </>
                                        :
                                        <>
                                            <BodyItem>
                                                {user?.phones.filter(item => item.phoneType === "WORK_PHONE")[0]?.phoneNumber}
                                                {
                                                    user?.phones.filter(item => item.phoneType === "WORK_PHONE")[0]?.hasTg
                                                    &&
                                                    <FaTelegram/>
                                                }
                                                {
                                                    user?.phones.filter(item => item.phoneType === "WORK_PHONE")[0]?.hasInstagram
                                                    &&
                                                    <FaInstagram/>
                                                }
                                                {
                                                    user?.phones.filter(item => item.phoneType === "WORK_PHONE")[0]?.hasFacebook
                                                    &&
                                                    <FaFacebook/>
                                                }
                                            </BodyItem>
                                            <Button onClick={() => setIsMotherPhone(true)}><FaPencilAlt/></Button>
                                        </>
                                }

                                {/*** ================= change mother phone =================== ***/}
                                <Modal
                                    open={isMotherPhone}
                                    onClose={handleClose}
                                    aria-labelledby="keep-mounted-modal-title"
                                    aria-describedby="keep-mounted-modal-description"
                                >
                                    <Box sx={style} component={style2}>
                                        <CloseMyButtonForChild
                                            onClick={handleClose}><RiCloseLine/></CloseMyButtonForChild>
                                        <SavePhoneNumber
                                            title={"Work Phone"}
                                            phoneType={"WORK_PHONE"}
                                            formArr={[
                                                {
                                                    label: "id",
                                                    name: "id",
                                                    placeholder: "Enter id of build",
                                                    icon: FaArrowRight,
                                                    type: "text",
                                                },
                                                {
                                                    label: "Phone Number:",
                                                    name: "phoneNumber",
                                                    placeholder: "Phone Number:",
                                                    type: "phone",
                                                },
                                                {
                                                    label: "Has Tg:",
                                                    name: "hasTg",
                                                    placeholder: "Has Tg",
                                                    icon: FaTelegram,
                                                    type: "checkbox",
                                                },
                                                {
                                                    label: "Has Instagram:",
                                                    name: "hasInstagram",
                                                    placeholder: "Has Instagram",
                                                    icon: FaInstagram,
                                                    type: "checkbox",
                                                },
                                                {
                                                    label: "Has Facebook:",
                                                    name: "hasFacebook",
                                                    placeholder: "Has Facebook",
                                                    icon: FaFacebook,
                                                    type: "checkbox",
                                                }
                                            ]}
                                            onClose={() => setIsMotherPhone(false)}
                                        />
                                    </Box>
                                </Modal>
                                {/*** ================= change mother phone =================== ***/}

                            </BodyRow>
                            <BodyRow>
                                <BodyLabel><Icon><FaMapLocationDot/></Icon>Address:</BodyLabel>
                                {
                                    isAddressMap ?
                                        <>
                                        </>
                                        :
                                        <>
                                            <BodyItem
                                                fontSize={"12px"}>{user?.address && `${user?.address?.country}, ${user?.address?.region}, ${user?.address?.area}, ${user?.address?.address}`}</BodyItem>
                                            <Button onClick={() => setIsAddressMap(true)}><FaPencilAlt/></Button>
                                        </>
                                }

                                {/*** ================= change address map =================== ***/}
                                <Modal
                                    open={isAddressMap}
                                    onClose={handleClose}
                                    aria-labelledby="keep-mounted-modal-title"
                                    aria-describedby="keep-mounted-modal-description"
                                >
                                    <Box sx={style} component={style2}>
                                        <CloseMyButtonForChild
                                            onClick={handleClose}><RiCloseLine/></CloseMyButtonForChild>
                                        <SaveAddress
                                            constant={true}
                                            formArr={[
                                                {
                                                    label: "id",
                                                    name: "id",
                                                    placeholder: "Enter id",
                                                    icon: FaArrowRight,
                                                    type: "text",
                                                },
                                                {
                                                    label: "Country:",
                                                    name: "country",
                                                    placeholder: "Enter country",
                                                    type: "text",
                                                },
                                                {
                                                    label: "Region:",
                                                    name: "region",
                                                    placeholder: "Enter region",
                                                    type: "text",
                                                },
                                                {
                                                    label: "Area:",
                                                    name: "area",
                                                    placeholder: "Enter ares",
                                                    type: "text",
                                                },
                                                {
                                                    label: "Address:",
                                                    name: "address",
                                                    placeholder: "Enter address",
                                                    type: "text",
                                                }
                                            ]}
                                            onClose={() => setIsAddressMap(false)}
                                        />
                                    </Box>
                                </Modal>
                                {/*** ================= change mobile phone =================== ***/}

                            </BodyRow>
                            <BodyRow>
                                <BodyLabel><Icon><FaLocationDot/></Icon>Address:</BodyLabel>
                                {
                                    isAddress ?
                                        <>
                                        </>
                                        :
                                        <>
                                            <BodyItem
                                                fontSize={"12px"}>{user?.addressCurrent && `${user?.addressCurrent?.country}, ${user?.addressCurrent?.region}, ${user?.addressCurrent?.area}, ${user?.addressCurrent?.address}`}</BodyItem>
                                            <Button onClick={() => setIsAddress(true)}><FaPencilAlt/></Button>
                                        </>
                                }
                                {/*** ================= change current address =================== ***/}
                                <Modal
                                    open={isAddress}
                                    onClose={handleClose}
                                    aria-labelledby="keep-mounted-modal-title"
                                    aria-describedby="keep-mounted-modal-description"
                                >
                                    <Box sx={style} component={style2}>
                                        <CloseMyButtonForChild
                                            onClick={handleClose}><RiCloseLine/></CloseMyButtonForChild>
                                        <SaveAddress
                                            constant={false}
                                            formArr={[
                                                {
                                                    label: "id",
                                                    name: "id",
                                                    placeholder: "Enter id",
                                                    icon: FaArrowRight,
                                                    type: "text",
                                                },
                                                {
                                                    label: "Country:",
                                                    name: "country",
                                                    placeholder: "Enter country",
                                                    type: "text",
                                                },
                                                {
                                                    label: "Region:",
                                                    name: "region",
                                                    placeholder: "Enter region",
                                                    type: "text",
                                                },
                                                {
                                                    label: "Area:",
                                                    name: "area",
                                                    placeholder: "Enter ares",
                                                    type: "text",
                                                },
                                                {
                                                    label: "Address:",
                                                    name: "address",
                                                    placeholder: "Enter address",
                                                    type: "text",
                                                }
                                            ]}
                                            onClose={() => setIsAddress(false)}
                                        />
                                    </Box>
                                </Modal>
                                {/*** ================= change current address =================== ***/}
                            </BodyRow>
                        </BodySection>
                    </Box>
                </Box>
            </Modal>

        </Container>
    );
};

const styleAddSm = styled.div`
    ${extrasmall({
        width: "97% !important"
    })}
`
const styleModalCreate = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    padding: "15px",
    borderRadius: "8px",
};

const ModalTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    h4 {
        color: black;
    }

    h5 {
        color: red;
    }

`
const Boxwr = styled.div`
    display: grid;
    grid-template-columns: 0.6fr 1fr;
    gap: 20px;
    ${extrasmall({
        gridTemplateColumns: "1fr",
    })}
`
const styleChangePassword = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 3,
    p: 2,
}
const styleChangePassword2 = styled.div`
    ${extrasmall({
        width: "95vw !important",
    })}
`

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 3,
    p: 2,
};

const style2 = styled.div`
    ${large({
        width: "80vw !important",
    })}
    ${medium({
        width: "85vw !important",
    })}
    ${small({
        width: "90vw !important",
    })}
    ${extrasmall({
        width: "95vw !important",
        padding: "10px !important"
    })}
`

const CloseMyButtonForChild = styled.button`
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


const LabelValue = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    font-size: ${props => props.fs ? "12px" : "14px"};
`;


const Button = styled.button`
    padding: 0 4px !important;
    border: none;
    font-size: 16px;
    border-radius: 0.25rem;
    color: ${props => props.color ? props.color : mainColor};
    background-color: #ffffff;

    &:hover {
        filter: brightness(0.8);
    }
`;


const Icon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const BodyItem = styled.div`
    flex: 2;
    display: flex;
    gap: 10px;
    overflow: auto;
    color: #000;
`;

const BodyLabel = styled.div`
    flex: 1;
    display: flex;
    gap: 10px;
    color: ${mainColor};
`;

const BodyRow = styled.div`
    width: 100%;
    display: flex;
    gap: 10px;
    font-size: 18px;
`;

const BodySection = styled.div`
    flex: 1;
    min-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow: scroll;
`;

const Body = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 30px;
`;

const RoleName = styled.div`
    font-size: 14px;
    color: black;

    span {
        font-weight: bold;
    }
`

const FullName = styled.div`
    font-size: 14px;
    color: black;

    span {
        font-weight: bold;
    }
`;

const Fields = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100%;
`;

const UserFieldWrapper = styled.div`
    display: flex;
    gap: 20px;
    background-color: #fff;
    color: ${mainColor};
    border-radius: 10px;
`;

const Img = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 100px;
`;

const ImageWrapper = styled.div`
    width: 230px;
    height: 230px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    position: relative;
    overflow: hidden;
    margin: 0 auto;
`;

const Header = styled.div`
    display: flex;
    flex-wrap: wrap;
    ${small({
        justifyContent: "center",
    })}
    ${extrasmall({
        justifyContent: "center",
    })}


`;


const Container = styled.div`
    padding: 1rem !important;
`;


export default KafedraSettings;