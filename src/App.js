import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import {useSelector} from "react-redux";
import {ToastContainer} from "react-toastify";
import Dekan from "./pages/Dekan";
import Admin from "./pages/Admin";
import Kafedra from "./pages/kafedra/Kafedra";
import Error from "./components/error/Error";
import Student from "./pages/student/Student";
import Teacher from "./pages/teacher/Teacher";
import SuperAdmin from "./components/super_admin/SuperAdmin";
import Bulim from "./components/bulim/Bulim";
import RektorPage from "./pages/rektor/RektorPage";
import StaffPage from "./components/staff/StaffPage";
import EducationalDepartment from "./components/uquvbulimi/EducationalDepartment";
import BoshqarmaPage from "./pages/boshqarma/BoshqarmaPage";
import Login from "./pages/Login";
import DeputyDean from "./pages/deputydean/DeputyDean";
import PdfViewReference from "./pages/PdfViewReference/PdfViewReference";
import MonitoringAssistant from "./pages/monitoringAssistant/MonitoringAssistant";
import PdfViewNotice from "./pages/PdfViewNotice/PdfViewNotice";
import 'react-toastify/dist/ReactToastify.min.css'
import './components/charts/doughnutchart/CartDoughnutChart.css'
import './App.css';

export const AlertNavBar = React.createContext();

function App() {
    const [isLogin,setIsLogin] = useState(false);
    const toggleLogin = () => setIsLogin(prev => !prev);
    const user = useSelector(state => state.user.user);

    useEffect(() => {
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey && e.shiftKey && e.keyCode == 67) ||
                (e.ctrlKey && e.shiftKey && e.keyCode == 74) ||
                (e.ctrlKey && e.shiftKey && e.keyCode == 73) ||
                (e.keyCode == 123)) {
                e.preventDefault();
            }
        });
    }, []);
    useEffect(()=>{
        document.title = user && user?.fullName || "KIUT LMS";
    },[user])

    return (
        <AlertNavBar.Provider value={isLogin}>
            <Router>
                <ToastContainer/>
                <Routes>
                    <Route exact path="/" element={<Login toggle={toggleLogin}/>}/>
                    <Route exact path="/login" element={<Login toggle={toggleLogin}/>}/>
                    <Route path="/rektor/*" element={user ? <RektorPage/> : <Login/>}/>
                    <Route path="/dekan/*" element={user ? <Dekan/> : <Navigate to="/login"/>}/>
                    <Route path="/deputydean/*" element={user ? <DeputyDean/> : <Navigate to="/login"/>}/>
                    <Route path="/admin/*" element={user ? <Admin/> : <Navigate to="/login"/>}/>
                    <Route path="/kafedra/*" element={user ? <Kafedra/> : <Navigate to="/login"/>}/>
                    <Route path="/error" element={user ? <Error/> : <Navigate to="/login"/>}/>
                    <Route path="/student/*" element={user ? <Student/> : <Navigate to="/login"/>}/>
                    <Route path="/teacher/*" element={user ? <Teacher/> : <Navigate to="/login"/>}/>
                    <Route path="/super/*" element={user ? <SuperAdmin/> : <Navigate to="/login"/>}/>
                    <Route path="/bulim/*" element={user ? <Bulim/> : <Navigate to="/login"/>}/>
                    <Route path="/boshqarma/*" element={user ? <BoshqarmaPage/> : <Navigate to="/login"/>}/>
                    <Route path="/staff/*" element={user ? <StaffPage/> : <Navigate to="/login"/>}/>
                    <Route path="/uquv/*" element={ user ? <EducationalDepartment />: <Navigate to="/login"/> }/>
                    <Route path="/monitoringAssistant/*" element={user? <MonitoringAssistant />: <Navigate to="/login"/>}/>
                    // public routes
                    <Route path="/file/services/reference/:id" element={ <PdfViewReference/>}/>
                    <Route path="/file/services/notice/:id" element={ <PdfViewNotice/>}/>
                </Routes>
            </Router>
        </AlertNavBar.Provider>
    );
}

export default App;