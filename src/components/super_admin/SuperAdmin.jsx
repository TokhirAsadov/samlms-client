import React, {lazy, Suspense, useEffect} from 'react';
import styled from "styled-components";
import {TOKEN} from "../../utills/ServiceUrls";
import NavBarUser from "../navbar/NavBarUser";
import {SuperAdminSideBar} from "../../data/data";
import SideBar from "../sidebar/SideBar";
import {Route, Routes, useNavigate} from "react-router-dom";
import jwtDecode from "jwt-decode";
import {extrasmall, small} from "../../responsiv";
import {useSelector} from "react-redux";
import Spinner from "../spinner/Spinner";

const DekanRoleSettings = lazy(() => import('./roles/DekanRoleSettings'));
const KafedraRoleSettings = lazy(() => import('./roles/KafedraRoleSettings'));
const CreateDekanat = lazy(() => import('./createDekanat/CreateDekanat'));
const CreateUser = lazy(() => import('./user/CreateUser'));
const SuperAdminStudentAddPage = lazy(() => import('./studentAdd/SuperAdminStudentAddPage'));
const StaffAdd = lazy(() => import('./staff/StaffAdd'));
const SchoolService = lazy(() => import('./school/SchoolService'));
const FacultyService = lazy(() => import('./faculty/FacultyService'));
const AllContacts = lazy(() => import('../contact/AllContacts'));
const RoleUser = lazy(() => import('../role/RoleUser'));
const SuperAdmin = () => {

    const navigate = useNavigate();
    const btntoggleval = useSelector(state => state.btnvalue.btnAction)

    useEffect(() => {
        const token = localStorage.getItem(TOKEN);
        const decode = jwtDecode(token);
        let roleName2 = decode?.roles.find(i => i.roleName === 'ROLE_SUPER_ADMIN')?.roleName;

        if (roleName2 !== "ROLE_SUPER_ADMIN") {
            navigate("/login");
        }
    }, [])

    return (
        <Container>
            <NavBarUser/>
            <Wrapper>
                <SideBar SidebarData={SuperAdminSideBar}/>
                <Wrapperpage btnval={btntoggleval}>
                    <Suspense fallback={<Spinner/>}>
                        <Routes>
                            {/*<Route path={"/user"} element={<CreateUser/>}/>*/}
                            <Route path={"/groups"} element={<RoleUser/>}/>
                            <Route path={"/dekan"} element={<DekanRoleSettings/>}/>
                            <Route path={"/dekanat"} element={<CreateDekanat/>}/>
                            <Route path={"/kafedra"} element={<KafedraRoleSettings/>}/>
                            <Route path={"/student"} element={<SuperAdminStudentAddPage/>}/>
                            <Route path={"/staff"} element={<StaffAdd/>}/>
                            <Route path={"/school"} element={<SchoolService/>}/>
                            <Route path={"/faculty"} element={<FacultyService/>}/>
                            <Route path={"/contact"} element={<AllContacts/>}/>
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
    width: ${props => props.btnval === 'open' ? "95vw" : "80vw"};
    margin-top: 60px;
    margin-left: ${props => props.btnval === 'open' ? "5vw" : "20vw"};
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
export default SuperAdmin;