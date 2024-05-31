import React, {lazy, Suspense} from 'react';
import {Route, Routes, useNavigate} from "react-router-dom";
import styled from "styled-components";
import NavBarUser from "../navbar/NavBarUser";
import SideBar from "../sidebar/SideBar";
import {useSelector} from "react-redux";
import {extrasmall, small} from "../../responsiv";
import {BulimSideBar} from "../../data/data";
import Spinner from "../spinner/Spinner";
const BulimDashboard = lazy(() => import('./dashboard/BulimDashboard'));
const BulimStaffs = lazy(() => import('./staffs/BulimStaffs'));
const BulimSittings = lazy(() => import('./sittings/BulimSittings'));
const AllContacts = lazy(() => import('../contact/AllContacts'));

const Bulim = () => {
  const btntoggleval=useSelector(state => state.btnvalue.btnAction)


  return (
    <Container>
      <NavBarUser/>
      <Wrapper>
        <SideBar SidebarData={BulimSideBar}/>
        <Wrapperpage btnval={btntoggleval}>
          <Suspense fallback={<Spinner/>}>
          <Routes>
            <Route path={"/dashboard"} element={<BulimDashboard s={true} />}/>
            <Route path={"/staffs"} element={<BulimStaffs s={true} />}/>
            <Route path={"/settings"} element={<BulimSittings />}/>
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

export default Bulim;