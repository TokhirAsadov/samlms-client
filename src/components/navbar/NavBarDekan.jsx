import React, {useDeferredValue, useEffect, useState} from 'react';
import styled from "styled-components";
import LogoNav from "../LogoNav";
import Language from "../Language";
import {useDispatch, useSelector} from "react-redux";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import axios from "axios";
import RektorTalabaForModal from "../rektor/student/talaba/RektorTalabaForModal";
import {BASE_URL, getHeaders, mainColor, SEARCH, STUDENT_ALL_DATA, TOKEN} from "../../utills/ServiceUrls";
import {RiCloseLine, RiSearchLine} from "react-icons/ri";
import jwtDecode from "jwt-decode";
import {useLocation, useNavigate} from "react-router-dom";
import {Badge, Drawer, Menu, MenuItem, Tooltip} from "@mui/material";
import SidebarBtn from "../sidebar/SidebarBtn";
import {extrasmall, large, medium, small} from "../../responsiv";
import {IoMdClose, IoMdNotifications} from 'react-icons/io'
import "../searchbar/searchstyle.css"
import Notificationmenu from "../notification/Notificationmenu";
import TeacherPanel from "../kafedra/teachers/teacherPanel/TeacherPanel";
import StaffUserModal from "../staff/StaffUserModal";
import Notification2 from "../notification/Notification2";
import {fetchNotification} from "../../redux/actions/notification/notification_action";
import {AiFillPhone} from "react-icons/ai";
import {fetchEducationYear} from "../../redux/actions/educationYear/education_year_actions";
import Avatar from "@mui/material/Avatar";
import {FaArrowRightFromBracket, FaGear} from "react-icons/fa6";
import {resetDataDeanStatistics} from "../../redux/slice/educationYear/education_year_statistics_slice";
import {resetDataUser} from "../../redux/slice/user/user_slice";
import {resetStudentData} from "../../redux/slice/student/student_slice";
import {resetDataTeacher} from "../../redux/slice/teacher/teacher_slice";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "95vw",
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 10
};
const stylenotific = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "50vw",
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2
};
const stylenotif = styled.div`
    ${extrasmall({
        width: "98vw !important",
    })}
`


const NavBarDekan = () => {
    const {headers} = getHeaders();
    const [searchUsers, setSearchUsers] = useState([]);
    const [selectUserId, setSelectUserId] = useState("");
    const [selectUserInfoData, setSelectUserInfoData] = useState(null)
    const [selectPhoto, setSelectPhoto] = useState("");
    const [query, setQuery] = useState("");
    const user = useSelector(state => state?.user?.user);
    const [dataModal, setDataModal] = useState({});
    const [openTeacherPanel, setOpenTeacherPanel] = useState(false);
    const [openStaffUser, setOpenopenStaffUser] = useState(false);
    const token = localStorage.getItem(TOKEN)
    const decode = jwtDecode(token);
    let roleName = decode?.roles[0]?.roleName?.slice(5);
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({...state, [anchor]: open});
    };


    const handleOpenTeacherPanel = (selectId) => {
        setSelectUserId(selectId)
        setOpenTeacherPanel(true);
    }
    const handleCloseTeacherPanel = () => {
        setOpenTeacherPanel(false);
    }

    const handleOpenStaffUser = () => setOpenopenStaffUser(true);
    const handleCloseopenStaffUser = () => setOpenopenStaffUser(false);

    const NotificationDatausers = []

    const useDefval = useDeferredValue(searchUsers)

    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseDrop = () => {
        setAnchorEl(null);
    };

    const navigate = useNavigate();
    const location = useLocation();
    const [show, setshow] = useState(false);
    const handleshow = () => {
        setshow(true)
    }
    const handleclose = (e) => {
        setshow(false)
        setQuery("")
    }

    const redirectSettingsPage = () => {
        let path = location?.pathname.slice(0, location?.pathname.lastIndexOf("/"));
        path = path + "/settings";
        setAnchorEl(null);
        navigate(path);
    }
    const redirectContact = () => {
        let path = location?.pathname.slice(0, location?.pathname.lastIndexOf("/"));
        path = path + "/contact";
        setAnchorEl(null);
        navigate(path);
    }
    const searchChange = (e) => {
        setQuery(e.target.value)
    }
    const LogOut = () => {
        localStorage.clear();
        dispatch(resetDataUser())
        dispatch(resetStudentData())
        dispatch(resetDataTeacher())
        navigate("/login");
    }


    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);


    const handleClose = () => {
        setOpen(false)

    };

    const handleClose2 = () => setOpen2(false);


    const studentDataFetch = (userId) => {
        axios.get(BASE_URL + STUDENT_ALL_DATA + userId)
            .then(res => {
                setDataModal(prev => ({
                    ...prev, ...res.data
                }))
            })
            .catch(err => {
                console.log(err);
            })
        setOpen(true)
    }

    const fetchData = async () => {
        await axios.get(BASE_URL + SEARCH + query)
            .then(res => {
                let datas = res.data.obj;
                if (datas !== null) setSearchUsers(res.data.obj);
            })
    };

    useEffect(() => {
        if (query.length > 2) fetchData(); else setSearchUsers(() => []);
    }, [query]);


    const dispatch = useDispatch();


    const fetch = () => {
        const sse = new EventSource(BASE_URL + '/notification/stream2?userId=' + user?.id);
        sse.addEventListener("user-list-event", (event) => {
            const data = JSON.parse(event.data);
            dispatch(fetchNotification(data));
            // console.log(data, "notification stream listener")
        });
        sse.onerror = () => {
            sse.close();
        };
        return () => {
            sse.close();
        };
    }

    // useEffect(()=>{
    //     const sse = new EventSource(BASE_URL + '/notification/stream2?userId=' + user?.id);
    //     sse.addEventListener("user-list-event", (event) => {
    //         const data = JSON.parse(event.data);
    //         dispatch(fetchNotification(data));
    //     });
    //     sse.onerror = () => {
    //         sse.close();
    //     };
    //     return () => {
    //         sse.close();
    //     };
    // })


    const notification = useSelector(state => state?.notification?.notification) || [];


    return (<Container>
            <Wrapper>
                <WrapperItem>
                    <LogoNav/>
                    <SidebarBtn/>
                </WrapperItem>

                <WrapperItem>
                    <SearchContainer>
                        <div className={`input-box ${show ? "open" : ""}`}>
                            <input value={query} type="text" placeholder="Search..."
                                   onChange={(e) => setQuery(e.target.value.toLowerCase())}/>
                            <span onClick={handleshow} className={`search `}>
                <RiSearchLine size={24}/>
              </span>
                            <IoMdClose onClick={handleclose} className="close-icon" size={22}/>
                        </div>
                        {show && <SearchUsers opacity={useDefval.length > 0 ? 1 : 0}
                                              style={{display: "block", position: "absolute", top: "35px"}}>
                            {useDefval?.map((item, key) => {
                                return <SearchUser
                                    key={key}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSelectUserId(item.userId)
                                        setSelectUserInfoData(item)

                                        if (item.roleName === 'ROLE_STUDENT') {
                                            studentDataFetch(item.userId)
                                        }
                                        if (item.roleName === 'ROLE_DEKAN' || item.roleName === 'ROLE_TEACHER' || item.roleName === 'ROLE_KAFEDRA') {
                                            handleOpenTeacherPanel(item.userId)
                                        }
                                        if (item.roleName === "ROLE_USER" || item.roleName === "ROLE_STAFF") {
                                            handleOpenStaffUser(item.userId)
                                        }
                                    }}
                                >
                                    <SearchUserFullName>{item.fullName}</SearchUserFullName>
                                    <SearchUserRole>{item.roleName}</SearchUserRole>
                                </SearchUser>
                            })}

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
                                        accountLocked={selectUserInfoData?.accountNonLocked}
                                        data={dataModal && dataModal}
                                        group={dataModal && dataModal.groupData?.name}
                                        results={dataModal && dataModal.results}
                                    />
                                </Box>
                            </Modal>

                            <Modal
                                open={openTeacherPanel}
                                onClose={handleOpenTeacherPanel}
                                aria-labelledby="keep-mounted-modal-title"
                                aria-describedby="keep-mounted-modal-description"
                            >
                                <Box sx={styleTeacherPanel} component={stylesTeacherPanelComponent}>
                                    <CloseButtonForChild onClick={handleCloseTeacherPanel}
                                                         whileHover={{rotate: 180, scale: 1.1}}
                                                         whileTap={{scale: 0.9}}
                                                         transition={{duration: 0.3}}
                                    ><RiCloseLine/></CloseButtonForChild>
                                    <TeacherPanel selectId={selectUserId} photo={selectPhoto}/>
                                </Box>
                            </Modal>

                            <Modal
                                open={openStaffUser}
                                onClose={handleOpenStaffUser}
                                aria-labelledby="keep-mounted-modal-title"
                                aria-describedby="keep-mounted-modal-description"
                            >
                                <Box component={staffstylemodal}>
                                    <CloseButtonForChild onClick={handleCloseopenStaffUser}
                                                         whileHover={{rotate: 180, scale: 1.1}}
                                                         whileTap={{scale: 0.9}}
                                                         transition={{duration: 0.3}}
                                    ><RiCloseLine/></CloseButtonForChild>
                                    <StaffUserModal/>
                                </Box>
                            </Modal>

                        </SearchUsers>}

                    </SearchContainer>

                    <Notificationitem onClick={toggleDrawer("right", true)}>
                        <Badge badgeContent={notification?.length} color="primary" ariant="dot" max={99}>
                            <IoMdNotifications size={30}/>
                        </Badge>
                    </Notificationitem>


                    <Modal
                        open={open2}
                        onClose={handleClose2}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={stylenotific} component={stylenotif}>
                            <CloseButton onClick={handleClose2}><RiCloseLine/></CloseButton>
                            <Notificationmenu NotificationDatausers={NotificationDatausers}/>
                        </Box>
                    </Modal>
                    <Language/>
                    <Drawer
                        anchor={"right"}
                        open={state["right"]}
                        onClose={toggleDrawer("right", false)}
                    >
                        <NotificationContainer>
                            <Notification2 closeNotification={toggleDrawer("right", false)}/>
                        </NotificationContainer>
                    </Drawer>
                    <Tooltip title={"settings"}>
                        <UserFieldWrapper
                            aria-controls="menu-appbar"
                            onClick={handleMenu}
                        >
                            {user?.photos?.id ? <Avatar
                                src={BASE_URL + "/attachment/download/" + user?.photos?.id}
                                width={"40px"} height={"40px"}
                                alt={user?.fullName}
                            /> : <Avatar width={"40px"} height={"40px"} src="/broken-image.jpg"/>}

                        </UserFieldWrapper>
                    </Tooltip>
                    <Menu
                        sx={{mt: '45px'}}
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top', horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top', horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseDrop}
                    >
                        <MenuItem>
                            <NameWrapper>
                                <FullName>{user.fullName}</FullName>
                                <Role>{roleName === "DEKAN" ? "Yo`nalish rahbari" : roleName}</Role>
                            </NameWrapper>
                        </MenuItem>
                        <hr style={{width: "100%", opacity: "0.2"}}/>
                        <Box display={'flex'} flexDirection={'column'} gap={'10px'}>
                            <MenuItem onClick={redirectContact}> <AiFillPhone/>&nbsp;&nbsp;&nbsp;Contacts</MenuItem>
                            <MenuItem onClick={redirectSettingsPage}><FaGear/>&nbsp;&nbsp;&nbsp;Settings</MenuItem>
                        </Box>
                        <div style={{width: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <hr style={{width: "80%", opacity: "0.2"}}/>
                        </div>
                        <MenuItem onClick={LogOut}><FaArrowRightFromBracket />&nbsp;&nbsp;&nbsp;Log out</MenuItem>
                    </Menu>
                </WrapperItem>
            </Wrapper>
        </Container>
    );
};

const NotificationContainer = styled.div`
    width: 330px;
    padding: 10px;
`

const staffstylemodal = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 450px;
    background: #fff;
    border-radius: 10px;
    ${extrasmall({
        width: "96%"
    })}
`;
const styleTeacherPanel = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "98vw",
    height: "98vh",
    overflow: "hidden",
    bgcolor: 'background.paper',
    borderRadius: 3,
    boxShadow: 24,
    positions: 'relative',
}
const stylesTeacherPanelComponent = styled.div`
    ${large({
        overflow: 'scroll !important',
    })}
    ${medium({
        overflow: 'scroll !important',
    })}
    ${small({
        overflow: 'scroll !important',
    })}
    ${extrasmall({
        overflow: 'scroll !important',
    })}
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
    cursor: pointer;
    font-size: 26px;
    position: absolute;
    top: 10px;
    right: 10px;
`;

const CloseButton = styled.button`
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    color: ${mainColor};
    cursor: pointer;
    font-size: 26px;
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1;
`;


const SearchUserRole = styled.span`
    font-size: 12px;
    color: lightgray;
`;

const SearchUserFullName = styled.span`
    font-size: 14px;
`;

const SearchUser = styled.div`
    width: 350px;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    padding: 5px 10px !important;
    border-bottom: 1px solid lightgray;
    cursor: pointer;

    &::before {

    }
`;

const SearchUsers = styled.div`
    max-height: 300px;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 45px;
    margin-top: 20px !important;
    border: 1px solid lightgray;
    border-radius: 5px;
    overflow: hidden;
    overflow-y: scroll;
    opacity: ${props => props.opacity};
`;

const Dot = styled.span`
    width: 20px;
    height: 20px;
    padding: 5px !important;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    position: absolute;
    background-color: #f00;
    color: #fff;
    border-radius: 50%;
    top: -15%;
    right: -15%;
`;


const Role = styled.span`
    color: lightgray;
    font-size: 12px;
`

const FullName = styled.span`
    font-size: 14px;
`

const NameWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;


const UserFieldWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    font-size: 26px;
    cursor: pointer;
`;

const SearchContainer = styled.div`

`

const Container = styled.div`
    position: fixed;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px !important;
    width: calc(100vw);
    height: 60px;
    background-color: #fff;
    z-index: 100;
    -webkit-box-shadow: 1px 0px 8px -3px rgba(34, 60, 80, 0.2);
    -moz-box-shadow: 1px 0px 8px -3px rgba(34, 60, 80, 0.2);
    box-shadow: 1px 0px 8px -3px rgba(34, 60, 80, 0.2);
`;

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 95%;
    ${extrasmall({
        width: "100%",
    })}
`;
const Notificationitem = styled.div`
    cursor: pointer;
    color: #575656;

    &:hover {
        color: #000;
    }
`
const WrapperItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
    gap: 10px;
`;


export default NavBarDekan;