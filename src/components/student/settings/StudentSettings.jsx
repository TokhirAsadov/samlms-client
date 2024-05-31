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
    FaPhone,
    FaSave,
    FaTelegram,
    FaUser
} from "react-icons/fa";
import jwtDecode from "jwt-decode";
import axios from "axios";
import {fetchUser} from "../../../redux/actions/user/user_actions";
import {useHttp} from "../../hook/useHttp";
import Input from '@mui/material/Input';
import {FaCakeCandles, FaLocationDot, FaMapLocationDot, FaPencil, FaRectangleXmark,} from 'react-icons/fa6'
import moment from "moment";
import {toast} from 'react-toastify';
import Box from "@mui/material/Box";
import {RiCloseLine} from "react-icons/ri";
import Modal from "@mui/material/Modal";
import SavePhoneNumber from "../../form/SavePhoneNumber";
import SaveAddress from "../../form/SaveAddress";
import {extrasmall, large, medium, small} from "../../../responsiv";
import Noimg from '../../../utills/images/no-picture.jpg'
import IconButton from "@mui/material/IconButton";
import {IoClose} from "react-icons/io5";
import {Card, CardContent} from "@mui/material";

const StudentSettings = () => {

    const student = useSelector(state => state?.student?.student);
    const user = useSelector(state => state?.user?.user);
    const token = localStorage.getItem(TOKEN)
    const decode = jwtDecode(token);


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


    const handleClose = () => {
        setIsMyPhone(false);
        setIsFatherPhone(false);
        setIsMotherPhone(false);
        setIsAddressMap(false);
        setIsAddress(false);
    }
    const handleCloseModal = () => {
        setOpenChange(false)
    }
    const handleOpenModal = () => {
        setOpenChange(true)
    }

    const handleMouseOver = () => {
        setIsHovering(true);
    };

    const handleMouseOut = () => {
        setIsHovering(false);
    };

    const {headers} = getHeaders();

    const {request} = useHttp();
    const dispatch = useDispatch();

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
                // console.log(response.data,'RES');
                dispatch(fetchUser(request));
            })
            .catch(err => {
                console.log(err)
            })
    }


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
                                                    style={{width: "100%"}}
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
                                    <RoleName><span>Nationality: </span>{user?.nationality}</RoleName>
                                    <RoleName><span>Date of birth: </span>{moment(new Date(user?.bornYear)).format("DD.MM.yyyy")}
                                    </RoleName>
                                    <RoleName><span>Citizenship:</span> {user?.citizenship}</RoleName>
                                    <RoleName><span>Address:</span> {user?.address}</RoleName>
                                    <RoleName><span>Address(temporary):</span> {user?.addressCurrent?.region}, {user?.addressCurrent?.area} {user?.addressCurrent?.address} {user?.addressCurrent?.country} </RoleName>
                                </Fields>
                            </UserFieldWrapper>
                        </CardContent>
                    </Card>
                </Header>

                <Body>
                    <Body>
                        <Card>
                            <CardContent>
                                <Fields>
                                    <RoleName><span>Login: </span>{student?.login}</RoleName>
                                    <RoleName><span>Email: </span>{student?.email}</RoleName>
                                    <FullName><span>Specialization: </span>{student?.groupData?.facultyName}</FullName>
                                    <RoleName><span>Group: </span>{student?.groupData?.name}</RoleName>
                                    <RoleName><span>Course: </span>{student?.groupData?.level}</RoleName>
                                    <RoleName><span>Type of study: </span>{student?.groupData?.educationTypeName}
                                    </RoleName>
                                    <FullName><span>Mobile phone: </span>{student?.phones?.find(i => i?.phoneType == 'MOBILE_PHONE')?.phoneNumber}
                                    </FullName>
                                </Fields>
                            </CardContent>
                        </Card>
                    </Body>
                </Body>
            </Boxwr>

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
                        <CloseBtnModal onClick={handleCloseModal}> <IoClose size={22}/></CloseBtnModal>
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
                                            <Button onClick={() => setIsName(true)}><FaPencil/></Button>
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
                                            <Button onClick={() => setIsEmail(true)}><FaPencil/></Button>
                                        </>
                                }
                            </BodyRow>
                            <BodyRow>
                                <BodyLabel><Icon><FaPassport/></Icon><LabelValue>Passport:</LabelValue></BodyLabel>
                                {
                                    isPassport ?
                                        <>
                                            <Input value={passport} onChange={(e) => setPassport(e.target.value)}/>
                                            <Button onClick={() => setIsPassport(false)}><FaSave/></Button>
                                            <Button onClick={() => setIsPassport(false)}
                                                    color={"#f00"}><FaRectangleXmark/></Button>
                                        </>
                                        :
                                        <>
                                            <BodyItem>{user?.passportNum}</BodyItem>
                                            <Button onClick={() => setIsPassport(true)}><FaPencil/></Button>
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
                                            <Button onClick={() => setIsBirth(true)}><FaPencil/></Button>
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
                                            <Button onClick={() => setIsNation(true)}><FaPencil/></Button>
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
                                            <Button onClick={() => setIsCivil(true)}><FaPencil/></Button>
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
                                            <Button onClick={() => setIsMyPhone(true)}><FaPencil/></Button>
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
                                            <Button onClick={() => setIsFatherPhone(true)}><FaPencil/></Button>
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
                                            <Button onClick={() => setIsMotherPhone(true)}><FaPencil/></Button>
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
                                            <Button onClick={() => setIsAddressMap(true)}><FaPencil/></Button>
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
                                            <Button onClick={() => setIsAddress(true)}><FaPencil/></Button>
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

const Boxwr = styled.div`
    display: grid;
    grid-template-columns: 0.6fr 1fr;
    gap: 20px;
    ${extrasmall({
        gridTemplateColumns: "1fr",
    })}
`

const styleAddSm = styled.div`
    ${extrasmall({
        width: "97% !important"
    })}
`
const CloseBtnModal = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
    border-radius: 50%;
    border: none;
    background-color: ${mainColor};
    color: white;
    font-size: 12px;
`
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
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 3,
    p: 4,
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
    align-items: center;
    justify-content: center;
    gap: 10px;
    overflow: auto;
    color: #000;
    font-size: ${props => props.fontSize};
`;

const LabelValue = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    font-size: ${props => props.fs ? "12px" : "14px"};
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
    gap: 20px;
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
    gap: 15px;
    height: 100%;
`;

const UserFieldWrapper = styled.div`
    display: flex;
    gap: 20px;
    background-color: #fff;
    color: ${mainColor};
    border-radius: 10px;`;

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
    align-items: center;
    flex-direction: column;
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


export default StudentSettings;