import React, {lazy, Suspense, useEffect} from 'react';
import styled from "styled-components";
import SideBar from "../sidebar/SideBar";
import NavBarDekan from "../navbar/NavBarDekan";
import {Navigate, Route, Routes, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {UquvBulimiSidebar} from "../../data/data";
import {BASE_URL, getHeaders, TOKEN} from "../../utills/ServiceUrls";
import axios from "axios";
import LayoutRating from "./results/LayoutRating";
import {fetchEducationYear} from "../../redux/actions/educationYear/education_year_actions";
import jwtDecode from "jwt-decode";
import DashBoardLayout from "./DashBoardLayout";
import {extrasmall, small} from "../../responsiv";
import Spinner from "../spinner/Spinner";
import RektorTeacher from "../rektor/teacher/RektorTeacher";
import Teachers from "./teachers/Teachers";
import DataAllEducationYear from "./timetable/DataAllEducationYear";
import StatementDataDean from "../dekan/statement/StatementDataDean";
import StatementDataDepartment from "../dekan/statement/StatementDataDepartment";

const EducationalTeachers = lazy(() => import('./teachers/EducationalTeachers'));
const EducationalRooms = lazy(() => import('./room/EducationalRooms'));
const EducationalGroups = lazy(() => import('./groups/EducationalGroups'));
const EducationalDashboard = lazy(() => import('./dashboard/EducationalDashboard'));
const EmptyAudience = lazy(() => import('./dashboard/EmptyAudience'));
const EducationStatistics = lazy(() => import('./statistics/EducationStatistics'));
const TimeTable = lazy(() => import('./timetable/TimeTable'));
const AllContacts = lazy(() => import('../contact/AllContacts'));
const Deans = lazy(() => import('./deans/Deans'));
const ChangeLog = lazy(() => import('./changeLog/ChangeLog'));
const ArchiverForDean = lazy(() => import('../dekan/arxiv/ArchiveForDean'));
const ResultsScoreStudent = lazy(() => import('./results/ResultsScoreStudent'));
const FailsStudents = lazy(() => import('./results/FailsStudents'));
const GpaStudents = lazy(() => import('./results/GpaStudents'));
const AssistantUsers = lazy(() => import('./AssistantUsers'));
const FinalsStudent = lazy(() => import('./results/FinalsStudent'));
const AddStudents = lazy(() => import('./addStudent/AddStudents'));
const EducationalDepartment = () => {
    const btntoggleval = useSelector(state => state.btnvalue.btnAction)

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {headers} = getHeaders();
    const fetchEducationYears = async () => {
        await axios.get(BASE_URL + '/education/educationYearsForSelected', {headers})
            .then(res => {
                dispatch(fetchEducationYear(res?.data?.obj?.[0]))
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        const token = localStorage.getItem(TOKEN);
        const decode = jwtDecode(token);
        let roleName2 = decode?.roles.find(i => i.roleName === 'ROLE_MONITORING')?.roleName;


        if (roleName2 !== "ROLE_MONITORING") {
            navigate("/login");
        }

        fetchEducationYears();
    }, [])


    return (
        <Container>
            <NavBarDekan/>
            <Wrapper>
                <SideBar SidebarData={UquvBulimiSidebar}/>
                <Wrapperpage btnval={btntoggleval}>
                    <Suspense fallback={<Spinner/>}>
                        <Routes>
                            <Route exace path="/dashboard/" element={<DashBoardLayout/>}>
                                <Route path={"/dashboard/"} element={<Navigate to="floor"/>}/>
                                <Route exace path="floor" element={<EducationalDashboard/>}/>
                                <Route exace path="empty" element={<EmptyAudience/>}/>
                                <Route exace path="groups" element={<EducationalGroups/>}/>
                                <Route exace path="teachers" element={<EducationalTeachers/>}/>
                                <Route exace path="rooms" element={<EducationalRooms/>}/>
                            </Route>
                            {/*<Route exace path="report" element={<EducationStatistics/>}/>*/}
                            <Route exace path="/changeLog" element={<ChangeLog/>}/>
                            <Route exace path="/timetable" element={<TimeTable/>}/>
                            <Route path={"/contact"} element={<AllContacts/>}/>
                            <Route path={"/teachers"} element={<Teachers/>}/>
                            <Route path={"/eduYear"} element={<DataAllEducationYear/>}/>
                            <Route path={"/statement"} element={<StatementDataDepartment/>}/>
                            <Route path={"/deans"} element={<Deans/>}/>
                            <Route path={"/deans/arxiv"} element={<ArchiverForDean/>}/>

                            <Route path={"/rating"} element={<LayoutRating/>}>
                                <Route path={"/rating/"} element={<Navigate to="results"/>}/>
                                <Route path={"results"} element={<ResultsScoreStudent/>}/>
                                <Route path={"fails"} element={<FailsStudents/>}/>
                                <Route path={"final"} element={<FinalsStudent/>}/>
                                <Route path={"gpa"} element={<GpaStudents/>}/>
                            </Route>
                            <Route path={"/assistant"} element={<AssistantUsers/>}/>
                            <Route path={"/students"} element={<AddStudents/>}/>
                        </Routes>
                    </Suspense>
                </Wrapperpage>
            </Wrapper>
        </Container>
    );
};


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

const Wrapper = styled.div`
    display: flex;
    width: 100vw;
    height: 100%;
    background: #f7f7f7;
    position: relative;
`;

const Container = styled.div`
    width: 100vw;
`
export default EducationalDepartment;