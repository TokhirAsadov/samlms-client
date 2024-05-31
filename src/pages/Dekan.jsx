import React, {lazy, Suspense, useEffect, useState} from 'react';
import {Route, Routes, useNavigate} from 'react-router-dom';
import styled from "styled-components";
import {BASE_URL, getHeaders, navbarHeight, TOKEN} from "../utills/ServiceUrls";
import SideBar from "../components/sidebar/SideBar";
import NavBarDekan from "../components/navbar/NavBarDekan";
import DeanStudentServiceLayout from "../components/dekan/studentservice/DeanStudentServiceLayout";
import {useDispatch, useSelector} from "react-redux";
import {useHttp} from "../components/hook/useHttp";
import jwtDecode from "jwt-decode";
import {extrasmall, small} from "../responsiv";
import {fetchNotification} from "../redux/actions/notification/notification_action";
import Spinner from "../components/spinner/Spinner";
import axios from "axios";
import {DekanSidebarData} from "../data/data";
import StatementDataDean from "../components/dekan/statement/StatementDataDean";
const Dashboard = lazy(() => import('../components/dekan/dashboard/Dashboard'));
const DekanStudents = lazy(() => import('../components/dekan/students/DekanStudents'));
const DekanMessages = lazy(() => import('../components/dekan/messages/DekanMessages'));
const DekanSmsHistory = lazy(() => import('../components/dekan/historySMS/DekanSMSHistory'));
const DekanKafedra = lazy(() => import('../components/dekan/kafedra/DekanKafedra'));
const DekanGroupsEdit = lazy(() => import('../components/dekan/groups/DekanGroupsEdit'));
const DekanStaff = lazy(() => import('../components/dekan/staff/DekanStaff'));
const DekanJournal = lazy(() => import('../components/dekan/journal/DekanJournal'));
const SubjectResult = lazy(() => import('../components/dekan/journal/SubjectResult'));
const DeanStudentServiceReference = lazy(() => import('../components/dekan/studentservice/DeanStudentServiceReference'));
const AllContacts = lazy(() => import('../components/contact/AllContacts'));
const ArchiverForDean = lazy(() => import('../components/dekan/arxiv/ArchiveForDean'));
const NoticeForDean = lazy(() => import('../components/dekan/xabarnoma/NoticeForDean'));
const QueueForDean = lazy(() => import('../components/dekan/studentservice/QueueForDean'));
const NoticeHistory = lazy(() => import('../components/dekan/studentservice/NoticeHistory'));

const Dekan = () => {
    const [facultyId, setFacultyId] = useState("");

    const {request} = useHttp();
    const {headers} = getHeaders();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state?.user?.user)
    const btntoggleval = useSelector(state => state.btnvalue.btnAction)


    const fetchNotifications = () => {
        setTimeout(fetch, 10000);
    }

    const fetch = () => {
        const sse = new EventSource(BASE_URL + '/notification/stream2?userId=' + user?.id);
        sse.addEventListener("user-list-event", (event) => {
            const data = JSON.parse(event.data);
            dispatch(fetchNotification(data));
            // console.log(data, "notification stream listener 123")
        });
        sse.onerror = () => {
            sse.close();
        };
        return () => {
            sse.close();
        };
    }

    useEffect(() => {
        const token = localStorage.getItem(TOKEN);
        const decode = jwtDecode(token);
        // let roleName = decode?.roles[0]?.roleName;
        let roleName2 = decode?.roles.find(i => i.roleName === 'ROLE_DEKAN')?.roleName;

        if (roleName2 !== "ROLE_DEKAN") {
            navigate("/login");
        }
        // fetch()
        fetchLastActive();
        fetchNotifications();

    }, [])

    const fetchLastActive = async () => {
        await axios.post(`${BASE_URL}/dataOfLastActive/create/${user?.fullName} is active`, null, {headers})
            .then(response => {
                //console.log(response," active res")
            })
            .catch(err => {
                console.log(err, "error active")
            })
    }


    const loadStatus = useSelector(state => state?.dekanat?.dekanatLoadingStatus);
    const dekanat = useSelector(state => state?.dekanat?.dekanat);
    if (loadStatus !== "done" && dekanat == null) {

        return <Spinner/>
    }


    return (
        <Container>
            <NavBarDekan/>
            <Wrapper>
                <SideBar SidebarData={DekanSidebarData}/>
                <Wrapperpage btnval={btntoggleval}>
                    <Suspense fallback={<Spinner/>}>
                        <Routes>
                            <Route path={"/dashboard"} element={<Dashboard facultyId={facultyId}/>}/>
                            <Route path={"/students"} element={<DekanStudents/>}/>
                            <Route path={"/students/arxiv"} element={<ArchiverForDean/>}/>
                            {/*<Route path={"/messages"} element={<DekanMessages/>}/>*/}
                            {/*<Route path={"/messages/smsHistory"} element={<DekanSmsHistory/>}/>*/}
                            <Route path={"/journal"} element={<DekanJournal/>}/>
                            <Route path={"/results"} element={<SubjectResult/>}/>
                            <Route path={"/service/"} element={<DeanStudentServiceLayout/>}>
                                <Route index element={<DeanStudentServiceReference/>}/>
                                <Route path={"notice"} element={<NoticeForDean/>}/>
                                <Route path={"notice/history"} element={<NoticeHistory/>}/>
                                <Route path={"queue"} element={<QueueForDean/>}/>
                            </Route>
                            <Route path={"/groupsSettings"} element={<DekanGroupsEdit/>}/>
                            <Route path={"/statement"} element={<StatementDataDean/>}/>
                            <Route path={"/kafedra"} element={<DekanKafedra/>}/>
                            <Route path={"/staff"} element={<DekanStaff/>}/>
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
    width: 100%;
    
`;


export default Dekan;