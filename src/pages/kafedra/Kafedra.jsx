import React, {lazy, Suspense, useEffect, useState} from 'react';
import {Route, Routes, useNavigate} from "react-router-dom";
import styled from "styled-components";
import {TOKEN} from "../../utills/ServiceUrls";
import NavBarDekan from "../../components/navbar/NavBarDekan";
import jwtDecode from "jwt-decode";
import {useDispatch, useSelector} from "react-redux";
import {useHttp} from "../../components/hook/useHttp";
import {fetchTeacher} from "../../redux/actions/teacher/teacher_actions";
import {extrasmall, small} from "../../responsiv";
import SideBar from "../../components/sidebar/SideBar";
import {KafedraSideBar, KafedraSideBarTeachers} from "../../data/data";
import Spinner from "../../components/spinner/Spinner";
import HistoryFileTabel from "../tableForTeachers/HistoryFileTabel";
import StatementData from "./statement/StatementData";

const KafedraMessage = lazy(() => import('../../components/kafedra/sms/KafedraMessage'));
const KafedraDashboard = lazy(() => import('../../components/kafedra/dashboard/KafedraDashboard'));
const KafedraWeek = lazy(() => import('../../components/kafedra/week/KafedraWeek'));
const KafedraTeachers = lazy(() => import('../../components/kafedra/teachers/KafedraTeachers'));
const KafedraSMSHistory = lazy(() => import('../../components/kafedra/smsHistory/KafedraSMSHistory'));
const KafedraSettings = lazy(() => import('../../components/kafedra/settings/KafedraSettings'));
const GroupsSubjectTeacher = lazy(() => import('../../components/kafedra/subjectTeacher/GroupsSubjectTeacher'));
const SubjectCreateGroup = lazy(() => import('../../components/kafedra/subjectTeacher/SubjectCreateGroup'));
const SubjectTheme = lazy(() => import('../../components/kafedra/subjectTeacher/SubjectTheme'));
const CreateSubjects = lazy(() => import('../../components/kafedra/subjectTeacher/CreateSubjects'));
const AllContacts = lazy(() => import('../../components/contact/AllContacts'));
const TableForTeachers=lazy(()=>import('../tableForTeachers/TabelForTeachers'))
const Kafedra = () => {
    const [role, setRole] = useState('');
    const dispatch = useDispatch();
    const {request} = useHttp();
    const btntoggleval = useSelector(state => state.btnvalue.btnAction)
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem(TOKEN);
        const decode = jwtDecode(token);
        let roleName2 = decode?.roles.find(i => i.roleName === 'ROLE_KAFEDRA')?.roleName;
        setRole(decode?.roles.find(i => i.roleName === 'ROLE_TEACHER')?.roleName);

        if (
            decode?.roles.find(i => i.roleName === 'ROLE_TEACHER')?.roleName !== undefined &&
            decode?.roles.find(i => i.roleName === 'ROLE_TEACHER')?.roleName !== null &&
            decode?.roles.find(i => i.roleName === 'ROLE_TEACHER')?.roleName !== "" &&
            decode?.roles.find(i => i.roleName === 'ROLE_TEACHER')?.roleName === 'ROLE_TEACHER'
        ) {
            dispatch(fetchTeacher(request));
        }

        if (roleName2 !== "ROLE_KAFEDRA") {
            navigate("/login");
        }

    }, [])

    return (
        <Container>
            <NavBarDekan/>
            <Wrapper>
                <SideBar SidebarData={KafedraSideBarTeachers}/>
                <Wrapperpage btnval={btntoggleval}>
                    <Suspense fallback={<Spinner/>}>
                        <Routes>
                            <Route path={"/dashboard"} element={<KafedraDashboard/>}/>
                            <Route path={"/teachers"} element={<KafedraTeachers/>}/>
                            <Route path={"/teachers/table"} element={<TableForTeachers/>}/>
                            <Route path={"/teachers/table/history"} element={<HistoryFileTabel/>}/>
                            <Route path={"/subjects"} element={<CreateSubjects/>}/>
                            <Route path={"/contact"} element={<AllContacts/>}/>
                            <Route path={"/statement"} element={<StatementData/>}/>
                            <Route path={"/groupsSubject/"}>
                                <Route index element={<GroupsSubjectTeacher/>}/>
                                <Route path={":subject"} element={<SubjectCreateGroup/>}/>
                                <Route path={":subject/:id"} element={<SubjectTheme/>}/>
                            </Route>
                            <Route path={"/week"} element={<KafedraWeek/>}/>
                            {/*<Route path={"/messages"} element={<KafedraMessage/>}/>*/}
                            {/*<Route path={"/messages/smsHistory"} element={<KafedraSMSHistory/>}/>*/}
                            <Route path={"/settings"} element={<KafedraSettings/>}/>
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


export default Kafedra;