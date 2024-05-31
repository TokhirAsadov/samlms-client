import React, {lazy, Suspense, useEffect} from 'react';
import {Route, Routes, useNavigate} from "react-router-dom";
import styled from "styled-components";
import {TOKEN} from "../utills/ServiceUrls";
import NavBarDekan from "../components/navbar/NavBarDekan";
import jwtDecode from "jwt-decode";
import SideBar from "../components/sidebar/SideBar";
import {AdminSidebar} from "../data/data";
import {useSelector} from "react-redux";
import {extrasmall, small} from "../responsiv";
import Spinner from "../components/spinner/Spinner";
const Menu = lazy(() => import('../components/admin/menu/Menu'));
const Device = lazy(() => import('../components/admin/device/Device'));
const Rooms = lazy(() => import('../components/admin/rooms/Rooms'));
const Buildings = lazy(() => import('../components/admin/building/Buildings'));
const AdminUserAddPage = lazy(() => import('../components/admin/user/AdminUserAddPage'));
const AllContacts = lazy(() => import('../components/contact/AllContacts'));
const Admin = () => {

  const navigate = useNavigate();
  const btntoggleval=useSelector(state => state.btnvalue.btnAction)
  useEffect(()=>{
    const token = localStorage.getItem(TOKEN);
    const decode = jwtDecode(token);
    let roleName2 = decode?.roles.find(i => i.roleName==='ROLE_ADMIN')?.roleName;

    if (roleName2 !== "ROLE_ADMIN"){
      navigate("/login");
    }
  },[])

  return (
    <Container>
      <NavBarDekan/>
      <Wrapper>
        <SideBar SidebarData={AdminSidebar}/>
        <Wrapperpage btnval={btntoggleval}>
          <Suspense fallback={<Spinner/>}>
          <Routes>
            <Route path={"/menu"} element={ <Menu /> }/>
            <Route path={"/user"} element={ <AdminUserAddPage /> }/>
            <Route path={"/device"} element={ <Device /> }/>
            <Route path={"/rooms"} element={ <Rooms /> }/>
            <Route path={"/buildings"} element={ <Buildings /> }/>
            <Route path={"/contact"} element={ <AllContacts/> }/>
          </Routes>
          </Suspense>
        </Wrapperpage>
      </Wrapper>
    </Container>
  );
};



const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100%;
  background: #f7f7f7;
  position: relative;
`;

const Wrapperpage = styled.div`
  width: ${props => props.btnval ==='open' ? "95vw" : "80vw"};
  margin-top: 60px;
  margin-left: ${props => props.btnval==='open' ? "5vw" : "20vw"};
  transition: .3s;
  ${small({
    width: "100vw",
    "margin-left": "0px",
  })}
  ${extrasmall({
    width: "100vw",
    "margin-left": "0px",
  })}
`;

const Container = styled.div`
  width: 100vw;
`;

export default Admin;