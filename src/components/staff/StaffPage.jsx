import React, {lazy, Suspense} from 'react';
import SideBar from "../sidebar/SideBar";
import {StaffSideBar} from "../../data/data";
import {Route, Routes} from "react-router-dom";
import NavBarUser from "../navbar/NavBarUser";
import {extrasmall, small} from "../../responsiv";
import {useSelector} from "react-redux";
import styled from "styled-components";
import Spinner from "../spinner/Spinner";

const BulimSittings = lazy(() => import('../bulim/sittings/BulimSittings'));
const StaffStatistics = lazy(() => import('./statistics/StaffStatistics'));
const AllContacts = lazy(() => import('../contact/AllContacts'));

const StaffPage = () => {

    const btntoggleval = useSelector(state => state.btnvalue.btnAction)

    return (
        <Container>
            <NavBarUser/>
            <Wrapper>
                <SideBar SidebarData={StaffSideBar}/>
                <Wrapperpage btnval={btntoggleval}>
                    <Suspense fallback={<Spinner/>}>
                        <Routes>
                            <Route exact path={"/statistics"} element={<StaffStatistics/>}/>
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

export default StaffPage;