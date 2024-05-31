import React, {lazy, Suspense, useEffect, useState} from 'react';
import styled from "styled-components";
import {BASE_URL, TOKEN} from "../../utills/ServiceUrls";
import {TeacherSideBar, TeacherSideBarForKafedra} from "../../data/data";
import {Route, Routes, useNavigate} from "react-router-dom";
import SideBar from "../../components/sidebar/SideBar";
import NavBarUser from "../../components/navbar/NavBarUser";
import jwtDecode from "jwt-decode";
import {extrasmall, small} from "../../responsiv";
import {useDispatch, useSelector} from "react-redux";
import {fetchNotification} from "../../redux/actions/notification/notification_action";
import Spinner from "../../components/spinner/Spinner";
import StatementDataTeacher from "./StatementDataTeacher";

const TeacherMenu=lazy(()=>import('../../components/teacher/menu/TeacherMenu'))
const TeacherSettings =lazy(()=>import("../../components/teacher/settings/TeacherSettings"));
const TeacherFiles =lazy(()=>import("../../components/teacher/files/TeacherFiles"));
const TeacherTimeTable =lazy(()=>import("../../components/teacher/timeTable/TeacherTimeTable"));
const AllContacts =lazy(()=>import("../../components/contact/AllContacts"));
const GroupPlan =lazy(()=>import("../../components/teacher/teacherScience/GroupPlan"));
const TeacherOneScience =lazy(()=>import("../../components/teacher/teacherScience/TeacherOneScience"));
const TeacherScience =lazy(()=>import("../../components/teacher/teacherScience/TeacherScience"));
const TableEduMaster =lazy(()=>import("../../components/uquvbulimi/statisticsedu/TableEduMaster"));
const TableEduPartTime =lazy(()=>import("../../components/uquvbulimi/statisticsedu/TableEduPartTime"));
const TableEduFullTime =lazy(()=>import("../../components/uquvbulimi/statisticsedu/TableEduFullTime"));
const JournalTeacher =lazy(()=>import("../../components/teacher/journal/JournalTeacher"));
const TeacherStatistics =lazy(()=>import("../../components/teacher/statistics/TeacherStatistics"));


const Teacher = () => {

    const [role, setRole] = useState('');
    const btntoggleval = useSelector(state => state.btnvalue.btnAction)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state?.user?.user)


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
        let roleName2 = decode?.roles.find(i => i.roleName === 'ROLE_TEACHER')?.roleName;
        setRole(decode?.roles.find(i => i.roleName === 'ROLE_KAFEDRA')?.roleName);

        if (roleName2 !== "ROLE_TEACHER") {
            navigate("/login");
        }
    }, [])


    return (
        <Container>
            <NavBarUser/>
            <Wrapper>
                <SideBar SidebarData={role !== 'ROLE_KAFEDRA' ? TeacherSideBar : TeacherSideBarForKafedra}/>
                <Wrapperpage btnval={btntoggleval}>
                    <Suspense fallback={<Spinner/>}>
                        <Routes>
                            <Route path={"/menu"} element={<TeacherMenu/>}/>
                            <Route path={"/statistics"} element={<TeacherStatistics/>}/>
                           {/* <Route path={'/tableedufulltime'} element={<TableEduFullTime/>}/>
                            <Route path={'/tableeduparttime'} element={<TableEduPartTime/>}/>
                            <Route path={'/tableedumaster'} element={<TableEduMaster/>}/>*/}
                            <Route path={"/table"} element={<TeacherTimeTable/>}/>
                            <Route path={'/teacherscience/'}>
                                <Route index element={<TeacherScience/>}/>
                                <Route path={':fan/'} element={<GroupPlan/>}/>
                                <Route path={':fan/:groupsId'} element={<TeacherOneScience/>}/>
                            </Route>
                            <Route path={'/journal'} element={<JournalTeacher/>}/>
                            <Route path={'/statement'} element={<StatementDataTeacher/>}/>
                            <Route path={"/files"} element={<TeacherFiles/>}/>
                            <Route path={"/contact"} element={<AllContacts/>}/>
                            <Route path={"/settings"} element={<TeacherSettings/>}/>
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


export default Teacher;