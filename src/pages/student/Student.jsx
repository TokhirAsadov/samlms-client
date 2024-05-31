import React, {useEffect, lazy, Suspense} from 'react';
import styled from "styled-components";
import {BASE_URL, TOKEN} from "../../utills/ServiceUrls";
import SideBar from "../../components/sidebar/SideBar";
import {StudentSideBar} from "../../data/data";
import {Route, Routes, useNavigate} from "react-router-dom";
import NavBarUser from "../../components/navbar/NavBarUser";
import jwtDecode from "jwt-decode";
import {useDispatch, useSelector} from "react-redux";
import {extrasmall, small} from "../../responsiv";
import {fetchNotification} from "../../redux/actions/notification/notification_action";
import StudentServiceLayout from "../../components/student/student_service/StudentServiceLayout";
import Spinner from "../../components/spinner/Spinner";
const StudentMenu=lazy(()=>import('../../components/student/menu/StudentMenu'))
const StudentSubjects=lazy(()=>import('../../components/student/subject/StudentSubjects'))
const MySciences=lazy(()=>import('../../components/student/sciences/MySciences'))
const StudentSubjectsTheme=lazy(()=>import('../../components/student/subject/StudentSubjectsTheme'))
const StudentTimeTable=lazy(()=>import('../../components/student/timeTable/StudentTimeTable'))
const StudentResults=lazy(()=>import('../../components/student/results/StudentResults'))
const FailStudentDetailed=lazy(()=>import('../../components/student/results/FailStudentDetailed'))
const StudentExamFinal=lazy(()=>import('../../components/student/results/StudentExamFinal'))
const StudentSettings=lazy(()=>import('../../components/student/settings/StudentSettings'))
const StudentServiceReference=lazy(()=>import('../../components/student/student_service/StudentServiceReference'))
const QueueDeanForStudent=lazy(()=>import('../../components/student/student_service/QueueDeanForStudent'))
const AllContacts=lazy(()=>import('../../components/contact/AllContacts'))
const StudentStatistics=lazy(()=>import('../../components/student/statistics/TeacherStatistics'))
const Student = () => {

    const navigate = useNavigate();
    const btntoggleval = useSelector(state => state.btnvalue.btnAction)
    const user = useSelector(state => state?.user?.user)
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem(TOKEN);
        const decode = jwtDecode(token);
        let roleName2 = decode?.roles.find(i => i.roleName === 'ROLE_STUDENT')?.roleName;

        if (roleName2 !== "ROLE_STUDENT") {
            navigate("/login");
        }
    }, [])



    const fetch = () => {
        const sse = new EventSource(BASE_URL + '/notification/stream2?userId=' + user?.id);
        sse.addEventListener("user-list-event", (event) => {
            const data = JSON.parse(event.data);
            dispatch(fetchNotification(data));

        });
        sse.onerror = () => {
            sse.close();
        };
        return () => {
            sse.close();
        };
    }


    return (
        <Container>
            <NavBarUser/>
            <Wrapper>
                <SideBar SidebarData={StudentSideBar}/>
                <Wrapperpage btnval={btntoggleval}>
                    <Suspense fallback={<Spinner/>}>
                    <Routes>
                        <Route path={"/menu"} element={<StudentMenu/>}/>
                        <Route path={"/subject"} element={<StudentSubjects/>}/>
                        <Route path={"/sciences"} element={<MySciences/>}/>
                        <Route path={"/sciences/:subjectName"} element={<StudentSubjectsTheme/>}/>
                        <Route path={"/table"} element={<StudentTimeTable/>}/>
                        <Route path={"/results"} element={<StudentResults/>}/>
                        <Route path={"/retake"} element={<FailStudentDetailed/>}/>
                        <Route path={"/finals"} element={<StudentExamFinal/>}/>
                        <Route path={"/settings"} element={<StudentSettings/>}/>
                        <Route path={"/service/"} element={<StudentServiceLayout/>}>
                            <Route index element={<StudentServiceReference/>}/>
                            <Route path={"queue"} element={<QueueDeanForStudent/>}/>
                        </Route>
                        <Route path={"/contact"} element={<AllContacts/>}/>
                        <Route path={"/statistics"} element={<StudentStatistics/>}/>
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


export default Student;