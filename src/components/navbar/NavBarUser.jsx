import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import LogoNav from "../LogoNav";
import Language from "../Language";
import {useDispatch, useSelector} from "react-redux";
import {BASE_URL, mainColor, TOKEN} from "../../utills/ServiceUrls";
import jwtDecode from "jwt-decode";
import {useLocation, useNavigate} from "react-router-dom";
import {Badge, Drawer, Menu, MenuItem, Tooltip} from "@mui/material";
import {extrasmall} from "../../responsiv";
import SidebarBtn from "../sidebar/SidebarBtn";
import {IoMdNotifications} from "react-icons/io";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {RiCloseLine} from "react-icons/ri";
import Notificationmenu from "../notification/Notificationmenu";
import Notification2 from "../notification/Notification2";
import {AiFillPhone} from "react-icons/ai";
import {resetDataUser} from "../../redux/slice/user/user_slice";
import {resetStudentData} from "../../redux/slice/student/student_slice";
import {resetDataTeacher} from "../../redux/slice/teacher/teacher_slice";
import Avatar from "@mui/material/Avatar";
import {FaArrowRightFromBracket, FaGear} from "react-icons/fa6";

const NavBarUser = () => {

  const user = useSelector(state => state?.user?.user);
  const dispatch = useDispatch();
  const token = localStorage.getItem(TOKEN)
  const decode = jwtDecode(token);
  let roleName = decode.roles[0].roleName.slice(5);
  const navigate = useNavigate();
  const location = useLocation();
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

  const LogOut = () => {
    localStorage.clear();
    dispatch(resetDataUser())
    dispatch(resetStudentData())
    dispatch(resetDataTeacher())
    navigate("/login");
  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open2, setOpen2] = React.useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseDrop = () => {

    setAnchorEl(null);
  };

  const handleClose2 = () => setOpen2(false);




  const [loading, setLoading] = useState(true);

  useEffect(() => {
    user?.id && setLoading(false);
  }, [user])


  const notification = useSelector(state => state?.notification?.notification) || [];


  return (
      <Container>
        <Wrapper>
          <WrapperItem>
            <LogoNav/>
            <SidebarBtn/>
          </WrapperItem>

          <WrapperItem>
            <Language/>
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
                <Notificationmenu/>
              </Box>
            </Modal>

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
                {
                  user?.photos?.id ? <Avatar
                      src={BASE_URL + "/attachment/download/" + user?.photos?.id}
                      width={"40px"} height={"40px"}
                      alt={user?.fullName}
                  /> : <Avatar width={"40px"} height={"40px"} src="/broken-image.jpg"/>
                }

              </UserFieldWrapper>
            </Tooltip>
            <Menu
                sx={{mt: '45px'}}
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
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
                <MenuItem onClick={redirectSettingsPage}> <FaGear/>&nbsp;&nbsp;&nbsp;Settings</MenuItem>
              </Box>

              <div style={{width: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <hr style={{width: "100%", opacity: "0.2"}}/>
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
  padding: 1rem;
`
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

const Notificationitem = styled.div`
  cursor: pointer;
  color: #575656;

  &:hover {
    color: #000;
  }
`

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
  z-index: 5;
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

const WrapperItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 20px;
`;
export default NavBarUser;