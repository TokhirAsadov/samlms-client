import React, {lazy, Suspense, useEffect, useState} from 'react';
import NavBarDekan from "../../components/navbar/NavBarDekan";
import SideBar from "../../components/sidebar/SideBar";
import {DeputyDeanSidebarData} from "../../data/data";
import {Route, Routes, useNavigate} from "react-router-dom";
import styled from "styled-components";
import {extrasmall, small} from "../../responsiv";
import {navbarHeight, TOKEN} from "../../utills/ServiceUrls";
import {useSelector} from "react-redux";
import jwtDecode from "jwt-decode";
import Spinner from "../../components/spinner/Spinner";
const Dashboard = lazy(() => import('../../components/dekan/dashboard/Dashboard'));
const DekanStudents = lazy(() => import('../../components/dekan/students/DekanStudents'));
const DekanJournal = lazy(() => import('../../components/dekan/journal/DekanJournal'));
const AllContacts = lazy(() => import('../../components/contact/AllContacts'));

const DeputyDean = () => {



    const [facultyId,setFacultyId] = useState("");


    const navigate = useNavigate();
    const btntoggleval=useSelector(state => state.btnvalue.btnAction)

    useEffect(()=>{
        const token = localStorage.getItem(TOKEN);
        const decode = jwtDecode(token);

        let roleName2 = decode?.roles.find(i => i.roleName==="Ta'lim yo`nalishi rahbari o`rinbosari")?.roleName;

        if (roleName2 !== "Ta'lim yo`nalishi rahbari o`rinbosari"){
            navigate("/login");
        }
    },[])


    return (
        <Container>
            <NavBarDekan/>
            <Wrapper>
                <SideBar SidebarData={DeputyDeanSidebarData}/>
                <Wrapperpage btnval={btntoggleval}>
                    <Suspense fallback={<Spinner/>}>
                    <Routes>
                        <Route path={"/dashboard"} element={ <Dashboard facultyId={facultyId} /> }/>
                        <Route path={"/students"} element={ <DekanStudents /> }/>
                        <Route path={"/journal"} element={ <DekanJournal /> }/>
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
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: calc(100hv -${navbarHeight});
`;

export default DeputyDean;
