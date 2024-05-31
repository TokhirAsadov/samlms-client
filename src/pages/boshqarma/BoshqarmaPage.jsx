import React, {lazy, Suspense} from 'react';
import styled from "styled-components";
import NavBarUser from "../../components/navbar/NavBarUser";
import SideBar from "../../components/sidebar/SideBar";
import {BoshqarmaSideBar} from "../../data/data";
import {useSelector} from "react-redux";
import {Route, Routes} from "react-router-dom";
import {extrasmall, small} from "../../responsiv";
import Spinner from "../../components/spinner/Spinner";

const BulimDashboard = lazy(() => import('../../components/bulim/dashboard/BulimDashboard'));
const BulimStaffs = lazy(() => import('../../components/bulim/staffs/BulimStaffs'));
const BulimSittings = lazy(() => import('../../components/bulim/sittings/BulimSittings'));
const EducationalDashboard = lazy(() => import('../../components/uquvbulimi/dashboard/EducationalDashboard'));
const EducationStatistics = lazy(() => import('../../components/uquvbulimi/statistics/EducationStatistics'));
const EducationalGroups = lazy(() => import('../../components/uquvbulimi/groups/EducationalGroups'));
const EducationalTeachers = lazy(() => import('../../components/uquvbulimi/teachers/EducationalTeachers'));
const EducationalRooms = lazy(() => import('../../components/uquvbulimi/room/EducationalRooms'));
const AllContacts = lazy(() => import('../../components/contact/AllContacts'));

const BoshqarmaPage = () => {

    const btnTogLevel = useSelector(state => state.btnvalue.btnAction)

    return (
        <Container>
            <NavBarUser/>
            <Wrapper>
                <SideBar SidebarData={BoshqarmaSideBar}/>
                <Wrapperpage btnval={btnTogLevel}>
                    <Suspense fallback={<Spinner/>}>
                        <Routes>
                            <Route path={"/dashboard"} element={<BulimDashboard s={true}/>}/>
                            <Route path={"/education"} element={<EducationalDashboard/>}/>
                            <Route path={"/report"} element={<EducationStatistics/>}/>
                            <Route path={"/groups"} element={<EducationalGroups/>}/>
                            <Route path={"/teachers"} element={<EducationalTeachers/>}/>
                            <Route path={"/rooms"} element={<EducationalRooms/>}/>
                            <Route path={"/staffs"} element={<BulimStaffs s={true}/>}/>
                            <Route path={"/settings"} element={<BulimSittings/>}/>
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


export default BoshqarmaPage;