import React, {lazy, Suspense, useEffect, useState} from 'react';
import styled from "styled-components";
import {TOKEN} from "../../utills/ServiceUrls";
import {Navigate, Route, Routes, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useHttp} from "../../components/hook/useHttp";
import {fetchBulim} from "../../redux/actions/bulim/bulim_actions";
import jwtDecode from "jwt-decode";
import NavBarDekan from "../../components/navbar/NavBarDekan";
import SideBar from "../../components/sidebar/SideBar";
import {KengashRaisiSidebarData, RektorSidebarData} from "../../data/data";
import {extrasmall, small} from "../../responsiv";
import LayoutChooseStatistics from "../../components/rektor/allstatistics/LayoutChooseStatistics";
import Spinner from "../../components/spinner/Spinner";
import LayoutEmployees from "../../components/rektor/staff/LayoutEmployees";
import LayoutStudentsForRektor from "../../components/rektor/student/LayoutStudentsForRekror";

const MainSectionBody = lazy(() => import('../../components/userService/MainSectionBody'));
const RektorTeacher = lazy(() => import('../../components/rektor/teacher/RektorTeacher'));
const RektorStaff = lazy(() => import('../../components/rektor/staff/RektorStaff'));
const RektorRahbariyat = lazy(() => import('../../components/rektor/rahbariyat/RektorRahbariyat'));
const EducationalDashboard = lazy(() => import('../../components/uquvbulimi/dashboard/EducationalDashboard'));
const EducationalGroups = lazy(() => import('../../components/uquvbulimi/groups/EducationalGroups'));
const EducationalTeachers = lazy(() => import('../../components/uquvbulimi/teachers/EducationalTeachers'));
const EducationalRooms = lazy(() => import('../../components/uquvbulimi/room/EducationalRooms'));
const RektorJournal = lazy(() => import('../../components/rektor/journal/RektorJournal'));
const StudentsStatisticsForRektor = lazy(() => import('../../components/rektor/StudentsStatisticsForRektor'));
const AllContacts = lazy(() => import('../../components/contact/AllContacts'));
const ArxivStudentsForRektor = lazy(() => import('../../components/rektor/arxivStudent/ArxivStudentsForRektor'));
const StatisticsDean = lazy(() => import('../../components/rektor/statisticsDean/StatisticsDean'));
const ArchiverForDean = lazy(() => import('../../components/dekan/arxiv/ArchiveForDean'));
const StackedBarChart = lazy(() => import('../../components/charts/barchart/StackedBarChart'));
const GroupStackedBarChart = lazy(() => import('../../components/charts/barchart/GroupStackedBarChart'));
const RektorTalabaTable = lazy(() => import('../../components/rektor/student/talaba/RektorTalabaTable'));
const DirectionStackedBarChart = lazy(() => import('../../components/charts/barchart/DirectionStackedBarChart'));


const RektorPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {request} = useHttp();
    const btntoggleval = useSelector(state => state.btnvalue.btnAction)
    const [role, setRole] = useState(null);
    const [role2, setRole2] = useState(null);
    const [open, setOpen] = useState(false)
    useEffect(() => {

        dispatch(fetchBulim(request))

        const token = localStorage.getItem(TOKEN);
        const decode = jwtDecode(token);
        let roleName2 = decode?.roles.find(i => i.roleName === 'ROLE_REKTOR')?.roleName;
        let roleName3 = decode?.roles.find(i => i.roleName === 'Kengash raisi')?.roleName;

        setRole2(roleName2);
        setRole(roleName3)

        if (roleName2 !== "ROLE_REKTOR" && roleName3 !== "Kengash raisi") {
            navigate("/login");
        }
    }, [])

    useEffect(() => {
        if (role !== null && role === "Kengash raisi") setOpen(true)
    }, [role])

    return (
        <Container>
            <NavBarDekan/>
            <Wrapper>
                <SideBar SidebarData={open ? KengashRaisiSidebarData : RektorSidebarData}/>
                <Wrapperpage btnval={btntoggleval}>
                    <Suspense fallback={<Spinner/>}>
                    <Routes>
                        <Route path={"/menu"} element={<MainSectionBody/>}/>
                        <Route path={"/students/"} element={<LayoutStudentsForRektor/>}>
                            <Route path={""} element={<StackedBarChart/>}/>
                            <Route path={"direction"} element={<DirectionStackedBarChart/>}/>
                            <Route path={"group"} element={<GroupStackedBarChart/>}/>
                            <Route path={"attendance"} element={<StudentsStatisticsForRektor/>}/>
                            <Route path={"allStudents"} element={<RektorTalabaTable/>}/>
                        </Route>
                        <Route path={"/contact"} element={<AllContacts/>}/>
                        <Route path={"/employees/"} element={<LayoutEmployees/>}>
                            <Route path={"/employees/"} element={<Navigate to={"deans"}/>}/>
                            <Route path={"deans"} element={<RektorStaff s={false}/>}/>
                            <Route path={"teachers"} element={<RektorTeacher/>}/>
                            <Route path={"staff"} element={<RektorStaff s={true}/>}/>
                        </Route>
                        <Route path={"/rahbariyat"} element={<RektorRahbariyat/>}/>
                        <Route path={"/journal"} element={<RektorJournal/>}/>
                        <Route path={"/arxiv"} element={<ArxivStudentsForRektor/>}/>
                        <Route path={"/statistics/"} element={<LayoutChooseStatistics/>}>
                            <Route path={"/statistics/"} element={<Navigate to="days"/>}/>
                            <Route path={"days"} element={<EducationalDashboard/>}/>
                            <Route path={"groups"} element={<EducationalGroups/>}/>
                            <Route path={"teachersWeek"} element={<EducationalTeachers/>}/>
                            <Route path={"statisticsDean"} element={<StatisticsDean/>}/>
                            <Route path={"statisticsDean/arxiv"} element={<ArchiverForDean/>}/>
                            <Route path={"rooms"} element={<EducationalRooms/>}/>
                        </Route>
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


export default RektorPage;