import React, {useEffect, useState} from 'react';
import Form from "../components/form/Form";
import styled from "styled-components";
import axios from "axios";
import {toast} from "react-toastify";
import {AUTH, BASE_URL, getHeaders, getToken, mainColor, TOKEN, USER} from "../utills/ServiceUrls";
import jwtDecode from "jwt-decode";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {userFetched} from "../redux/slice/user/user_slice";
import {fetchUser} from "../redux/actions/user/user_actions";
import {useHttp} from "../components/hook/useHttp";
import {fetchSection} from "../redux/actions/kafedra/section_actions";
import {fetchStudent} from "../redux/actions/student/student_actions";
import {fetchTeacher} from "../redux/actions/teacher/teacher_actions";
import {fetchDekanat} from "../redux/actions/dekanat/dekanat_actions";
import {fetchBadBest} from "../redux/actions/dekan/badBest_actions";
import Grid from '@mui/material/Grid';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {fetchSecondBulim} from "../redux/actions/bulim/bulim_second_actions";
import Backdrop from '@mui/material/Backdrop';
import {extrasmall, large, medium, small} from "../responsiv";
import {Card, CardContent} from "@mui/material";

const Login = ({toggle}) => {
    const defaultTheme = createTheme();
    const dispatch = useDispatch();
    const {request} = useHttp();
    const [isLoadingLogin, setIsLoadingLogin] = useState(false)

    const [openBg, setOpenBg] = useState(false);
    const [decode, setDecode] = useState(null);

    const navigate = useNavigate();
    const submitLogin = (form) => {
        setIsLoadingLogin(true)
        axios.post(BASE_URL + AUTH.LOGIN, form)
            .then(response => {
                dispatch(userFetched(response.data));
                toast.success("Success login");
                localStorage.setItem(TOKEN, response.data.accessToken);
                const decode = jwtDecode(response.data.accessToken);
                dispatch(fetchUser(request))


                // console.log(decode?.roles," <- roles")

                let roleName2 = decode?.roles.find(i => i.roleName === 'ROLE_KAFEDRA')?.roleName;
                let roleName3 = decode?.roles.find(i => i.roleName === 'ROLE_TEACHER')?.roleName;

                if (roleName2 === "ROLE_KAFEDRA") {
                    dispatch(fetchSection(request));
                    navigate("/kafedra/dashboard");
                }

                if (decode?.roles?.length > 1) {
                    setDecode(decode?.roles);
                    setOpenBg(true);
                } else {

                    let roleName = decode.roles[0].roleName;
                    if (roleName === "ROLE_REKTOR") {
                        toggle();
                        navigate("/rektor/menu");
                    } else if (roleName === "Kengash raisi") {
                        toggle();
                        navigate("/rektor/menu");
                    } else if (roleName === "ROLE_STUDENT") {
                        dispatch(fetchStudent(request))
                        navigate("/student/menu");
                    } else if (roleName === "ROLE_DEKAN") {
                        dispatch(fetchBadBest(request));
                        dispatch(fetchDekanat(request));
                        navigate(`/dekan/dashboard`);
                    } else if (roleName === "ROLE_ADMIN") {
                        navigate(`/admin/menu`);
                    } else if (roleName === "ROLE_KAFEDRA") {
                        dispatch(fetchSection(request));
                        navigate("/kafedra/dashboard");
                    } else if (roleName === "ROLE_STUDENT") {
                        dispatch(fetchStudent(request));
                        navigate("/student/menu");
                    } else if (roleName === "ROLE_TEACHER") {
                        dispatch(fetchTeacher(request));
                        navigate("/teacher/menu");
                    } else if (roleName === "ROLE_SUPER_ADMIN") {
                        // dispatch(fetchTeacher(request));
                        navigate("/super/groups");
                    } else if (roleName === "ROLE_MONITORING") {
                        toggle();
                        navigate("/uquv/dashboard");
                    } else if (roleName === "ROLE_USER") {

                    } else if (roleName === "ROLE_STAFF") {
                        navigate("/staff/statistics")
                    } else if (roleName === "ROLE_MONITORING_ASSISTANT") {
                        toggle();
                        navigate("/monitoringAssistant/rating")
                    } else if (roleName === "Boshqarma boshlig`i") {
                        dispatch(fetchSecondBulim(request))
                        navigate("/boshqarma/dashboard")
                    } else if (roleName === "Ta'lim yo`nalishi rahbari o`rinbosari") {
                        dispatch(fetchSecondBulim(request))
                        navigate("/deputydean/dashboard")
                    } else {
                        dispatch(fetchSecondBulim(request))
                        navigate("/bulim/dashboard")
                    }
                }

            })
            .catch(res => {
                toast.error("Unauthorized");
            })
            .finally(() => setIsLoadingLogin(false));
    }

    useEffect(() => {

        document.title = "KIUT LMS";

        const {headers} = getHeaders();
        const {token} = getToken();

        axios.get(BASE_URL + USER.CHECK_ROLE, {headers})
            .then(res => {
                if (res.status === 200) {
                    const decode = jwtDecode(token);


                    let roleName2 = decode?.roles.find(i => i.roleName === 'ROLE_KAFEDRA')?.roleName;
                    let roleName3 = decode?.roles.find(i => i.roleName === 'ROLE_TEACHER')?.roleName;

                    if (roleName2 === "ROLE_KAFEDRA") {
                        // dispatch(fetchSection(request));
                        navigate("/kafedra/dashboard");
                    }


                    if (decode?.roles?.length > 1) {
                        setDecode(decode?.roles);
                        setOpenBg(true);
                    } else {


                        let roleName = decode.roles[0].roleName;
                        if (roleName === "ROLE_REKTOR") {
                            toggle();
                            navigate("/rektor/menu");
                        } else if (roleName === "Kengash raisi") {
                            toggle();
                            navigate("/rektor/menu");
                        } else if (roleName === "ROLE_STUDENT") {
                            navigate("/student/menu");
                        } else if (roleName === "ROLE_DEKAN") {
                            // dispatch(fetchBadBest(request));
                            dispatch(fetchDekanat(request))
                            navigate(`/dekan/dashboard`);
                        } else if (roleName === "ROLE_ADMIN") {
                            navigate(`/admin/menu`);
                        } else if (roleName === "ROLE_KAFEDRA") {
                            dispatch(fetchSection(request));
                            navigate("/kafedra/dashboard");
                        } else if (roleName === "ROLE_STUDENT") {
                            dispatch(fetchStudent(request))
                            navigate("/student/menu");
                        } else if (roleName === "ROLE_TEACHER") {
                            dispatch(fetchTeacher(request));
                            navigate("/teacher/menu");
                        } else if (roleName === "ROLE_SUPER_ADMIN") {
                            // dispatch(fetchTeacher(request));
                            navigate("/super/groups");
                        } else if (roleName === "ROLE_MONITORING") {
                            toggle();
                            navigate("/uquv/dashboard");
                        } else if (roleName === "ROLE_USER") {

                        } else if (roleName === "ROLE_STAFF") {
                            navigate("/staff/statistics")
                        } else if (roleName === "ROLE_MONITORING_ASSISTANT") {
                            toggle();
                            navigate("/monitoringAssistant/rating")
                        } else if (roleName === "Boshqarma boshlig`i") {
                            dispatch(fetchSecondBulim(request))
                            navigate("/boshqarma/dashboard")
                        } else if (roleName === "Ta'lim yo`nalishi rahbari o`rinbosari") {
                            dispatch(fetchSecondBulim(request))
                            navigate("/deputydean/dashboard")
                        } else {
                            dispatch(fetchSecondBulim(request))
                            navigate("/bulim/dashboard")
                        }

                    }
                }
            })
            .catch(err => {
                console.log(err);
            })

    }, [])

    const redirectPage = (roleName) => {
        setOpenBg(false);

        if (roleName === "ROLE_REKTOR" || roleName === "Kengash raisi") {
            toggle();
            navigate("/rektor/menu");
        } else if (roleName === "Kengash raisi") {
            toggle();
            navigate("/rektor/menu");
        } else if (roleName === "ROLE_STUDENT") {
            dispatch(fetchStudent(request))
            navigate("/student/menu");
        } else if (roleName === "ROLE_DEKAN") {
            // dispatch(fetchBadBest(request));
            dispatch(fetchDekanat(request))
            navigate(`/dekan/dashboard`);
        } else if (roleName === "ROLE_ADMIN") {
            navigate(`/admin/menu`);
        } else if (roleName === "ROLE_KAFEDRA") {
            dispatch(fetchSection(request));
            navigate("/kafedra/dashboard");
        } else if (roleName === "ROLE_STUDENT") {
            dispatch(fetchStudent(request))
            navigate("/student/menu");
        } else if (roleName === "ROLE_TEACHER") {
            dispatch(fetchTeacher(request));
            navigate("/teacher/menu");
        } else if (roleName === "ROLE_SUPER_ADMIN") {
            // dispatch(fetchTeacher(request));
            navigate("/super/groups");
        } else if (roleName === "ROLE_MONITORING") {
            toggle();
            navigate("/uquv/dashboard");
        } else if (roleName === "ROLE_USER") {

        } else if (roleName === "ROLE_STAFF") {
            navigate("/staff/statistics")
        } else if (roleName === "Boshqarma boshlig`i") {
            dispatch(fetchSecondBulim(request))
            navigate("/boshqarma/dashboard")
        } else if (roleName === "ROLE_MONITORING_ASSISTANT") {
            toggle();
            navigate("/monitoringAssistant/rating")
        } else if (roleName === "Ta'lim yo`nalishi rahbari o`rinbosari") {
            dispatch(fetchSecondBulim(request))
            navigate("/deputydean/dashboard")
        } else {
            dispatch(fetchSecondBulim(request))
            navigate("/bulim/dashboard")
        }


    }


    return (<>

            <ThemeProvider theme={defaultTheme}>
                <Grid container component="main" sx={{height: '100vh'}}>

                    <Grid
                        item
                        xs={false}
                        sm={false}
                        md={false}
                        lg={7}

                        sx={{
                            flexWrap: "nowrap",
                            backgroundImage: 'url(/assets/imgforlogin.jpg)',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}

                    >
                        <Bgimg>
                            <div className="boxlogo3d">
                                <img src="/assets/logo3d.png" alt="logo3d"/>
                            </div>
                        </Bgimg>
                    </Grid>


                    <Form
                        title="Login"
                        isLoadingLogin={isLoadingLogin}
                        formArr={[
                            {
                                label: "Login",
                                name: "login",
                                type: "text"
                            },
                            {
                                label: "Password",
                                name: "password",
                                type: "password"
                            }
                        ]}
                        submitBtn="Login"
                        onSubmit={(form) => submitLogin(form)}
                    />

                </Grid>

                <Backdrop
                    sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                    open={openBg}
                >
                    <Wrapper>
                        {
                            decode?.map(i => {
                                return <Card
                                    sx={{
                                        background: `${mainColor}`,
                                        color: '#FFF',
                                        boxShadow: '0px 0px 9px 9px rgba(255, 255, 255, 0.4)',
                                        '&:hover': {
                                            cursor: 'pointer',
                                            boxShadow: '0px 0px 5px 9px rgba(255, 255, 255, 1)',
                                        }
                                    }}
                                    key={i.roleName}
                                    onClick={() => redirectPage(i.roleName)}>
                                    <CardContent sx={{p: '25px !important'}}>
                                        <span>{i.roleName}</span>
                                    </CardContent>
                                </Card>
                            })
                        }
                    </Wrapper>
                </Backdrop>

            </ThemeProvider>

        </>
    );
};

const Bgimg = styled.div`
    width: 100%;
    height: 100%;
    backdrop-filter: blur(7px);
    background: linear-gradient(90deg, rgba(0, 150, 219, 0.46) 0%, rgba(0, 150, 219, 0.46) 0%, rgba(255, 255, 255, 0.6) 100%);
    display: flex;
    align-items: center;
    justify-content: center;

    .boxlogo3d {
        width: 550px;
        height: 550px;

        img {
            width: 100%;
        }

        ${large({
            display: "none"
        })}
        ${medium({
            display: "none"
        })}
        ${small({
            display: "none"
        })}
        ${extrasmall({
            display: "none",
        })}
    }

`

const Wrapper = styled.div`
    width: 50%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 40px;
    color: #2f2d2f;
`


export default Login;