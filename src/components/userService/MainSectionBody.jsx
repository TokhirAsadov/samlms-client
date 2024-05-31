import React, {useEffect, useState} from 'react';
import {FaNetworkWired, FaUserAlt, FaUserFriends, FaUserGraduate, FaUserTie} from "react-icons/fa";
import {GiTeacher} from "react-icons/gi";
import {BASE_URL, getHeaders, mainColor} from "../../utills/ServiceUrls";
import styled from "styled-components";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {RiCloseLine} from "react-icons/ri";
import {motion as m} from "framer-motion";
import Spinner from "../spinner/Spinner";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {useDispatch, useSelector} from "react-redux";
import {useHttp} from "../hook/useHttp";
import {fetchRektorDashboardStudents} from "../../redux/actions/rektor/rektor_dashboard_students_action";
import {fetchRektorDashboardStaffs} from "../../redux/actions/rektor/rektor_dashboard_staffs_action";
import RektorDashboardChart from "../rektor/dashboard/RektorDashboardChart";
import {fetchBulim} from "../../redux/actions/bulim/bulim_actions";
import BulimDashboard from "../bulim/dashboard/BulimDashboard";
import {extrasmall, large, medium, small, xlarge, xxlarge} from "../../responsiv";
import Statistics from "../rektor/statistics/Statistics";
import {BsMoonStars, BsSun} from "react-icons/bs";
import {FcBusinessman, FcBusinesswoman} from "react-icons/fc";
import {SVGMap} from "react-svg-map";
import {Uzbmap} from "../../data/data";
import Bolimtable from "../rektor/Bolimtable";
import professor from "../../utills/kuitimgs/professor.png";
import dosent from "../../utills/kuitimgs/dosent.png";
import katta_uqituvchi from "../../utills/kuitimgs/Katta_uqituvchi.png";
import uqituvchi from "../../utills/kuitimgs/uqituvchi.png";
import assistent1 from "../../utills/kuitimgs/assistent1.png";
import Tooltip from "@mui/material/Tooltip";
import {useNavigate} from "react-router-dom";

const MainSectionBody = () => {
    const [staff, setStaff] = useState([]);
    const [students, setStudents] = useState([]);
    const [rahbariyat, setRahbariyat] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [openRahbariyat, setOpenRahbariyat] = useState(false);
    const [openTeacher, setOpenTeacher] = useState(false);
    const [openStudent, setOpenStudent] = useState(false);
    const [openStaff, setOpenStaff] = useState(false);
    const [openbatafsil, setopenbatafsil] = useState(false);
    const [openbatafsil2, setopenbatafsil2] = useState(false);
    const [countTeachersStatus, setCountTeachersStatus] = useState([]);
    const [countTeachersPositions, setCountTeachersPositions] = useState([]);
    const [countStudentType, setCountStudentType] = useState([]);
    const [countStudentLang, setCountStudentLang] = useState([]);
    const [countStudentForm, setCountStudentForm] = useState([]);
    const [mapStatistics, setMapStatistics] = useState([]);
    const {headers} = getHeaders()
    const dispatch = useDispatch();
    const {request} = useHttp();
    const navigate = useNavigate()

    const [positionItems, setPositionItems] = useState([]);

    useEffect(() => {
        axios.get(BASE_URL + "/user/rektorDashboard", {headers})
            .then(res => {
                setRahbariyat(res?.data?.rahbariyat)
                setStudents(res?.data?.students)
                setCountStudentForm(res?.data?.countStudentForm)
                setCountStudentLang(res?.data?.countStudentLang)
                setCountStudentType(res?.data?.countStudentType)
                setCountTeachersPositions(res?.data?.countTeachersPositions)

                let arr = [];
                let photo = [professor, dosent, katta_uqituvchi, uqituvchi, assistent1];
                res?.data?.countTeachersPositions?.forEach(
                    (i, index) => {
                        arr.push(
                            {
                                lavozmi: i?.name,
                                asosiy: i?.workStatus[0]?.count,
                                orindosh: i?.workStatus[1]?.count,
                                soatbay: i?.workStatus[2]?.count,
                                jami: i?.count,
                                comeperson: i?.come,
                                photo: photo[index]
                            }
                        )
                    }
                )

                setPositionItems(arr)


                setCountTeachersStatus(res?.data?.countTeachersStatus)
                let come = 0;
                let all = 0;
                res?.data?.teachers?.map(i => {
                    come += i.comeCount;
                    all += i.allCount;
                })
                setTeachers([come, all])

                let come1 = 0;
                let all1 = 0;
                res?.data?.staffs?.map(i => {
                    come1 += i.comeCount;
                    all1 += i.allCount;
                })
                setStaff([come1, all1])
            })
            .catch(err => {
                console.log(err)
            })

        axios.get(BASE_URL + "/address/getMapStatistics")
            .then(res => {
                setMapStatistics(res?.data?.obj)
            })
            .catch(err => {
                console.log(err, "map statistics error")
            })
    }, [])

    const rektorDashboardStudents = useSelector(state => state?.rektorDashboardStudents);
    const rektorDashboardTeachers = useSelector(state => state?.rektorDashboardTeachers);
    const rektorDashboardStaffs = useSelector(state => state?.rektorDashboardStaffs);

    const handleCloseOpenRahbariyat = () => {
        setOpenRahbariyat(false);
    }
    const section = useSelector(state => state?.bulim?.bulim)
    const handleOpenRahbariyat = () => {
        navigate('/rektor/rahbariyat')
        /* dispatch(fetchBulim(request));
         if (section) {
             setSpinnerRahbaryat(false);
         }
         setOpenRahbariyat(true);*/
    }
    const handleOpenBatafsil = () => {
        setopenbatafsil(true)
    }
    const handleOpenBatafsil2 = () => {
        setopenbatafsil2(true)
    }
    const handleCloseBatafsil = () => {
        setopenbatafsil(false)
    }
    const handleCloseBatafsil2 = () => {
        setopenbatafsil2(false)
    }
    const handleCloseOpenTeacher = () => {
        setOpenTeacher(false);
        setSpinnerTeacher(true);
    }


    const handleCloseOpenStudent = () => {
        setOpenStudent(false);
        setSpinnerStudent(true)
    }
    const handleOpenStudent = () => {
        if (rektorDashboardStudents?.rektorDashboardStudents?.length === 0) {
            dispatch(fetchRektorDashboardStudents(request));
            setDataStudent(rektorDashboardStudents?.rektorDashboardStudents)
        } else {
            setDataStudent(rektorDashboardStudents?.rektorDashboardStudents)
            setSpinnerStudent(false)
        }
        setOpenStudent(true);
    }

    const handleCloseOpenStaff = () => {
        setOpenStaff(false);
        setSpinnerStaff(true);
    }
    const handleOpenStaff = () => {
        if (rektorDashboardStaffs?.rektorDashboardStaffs?.length === 0) {
            dispatch(fetchRektorDashboardStaffs(request));
            setDataStaff(rektorDashboardStaffs?.rektorDashboardStaffs)
        } else {
            setDataStaff(rektorDashboardStaffs?.rektorDashboardStaffs)
            setSpinnerStaff(false)
        }
        setOpenStaff(true);
    }


    useEffect(() => {
        if (rektorDashboardStudents?.rektorDashboardStudentsLoadingStatus === "done") {
            setDataStudent(rektorDashboardStudents?.rektorDashboardStudents)
            setSpinnerStudent(false)
        }
        if (rektorDashboardStaffs?.rektorDashboardStaffsLoadingStatus === "done") {
            setDataStaff(rektorDashboardStaffs?.rektorDashboardStaffs)
            setSpinnerStaff(false)
        }
        if (rektorDashboardTeachers?.rektorDashboardTeachersLoadingStatus === "done") {
            setDataTeacher(rektorDashboardTeachers?.rektorDashboardTeachers)
            setSpinnerTeacher(false)
        }
    })



    const columnsStaff = [
        {
            field: 'count',
            headerName: '№',
            width: 40,
            align:'center',
            editable: false
        },
        {
            field: 'fullName',
            headerName: 'Name',
            type: 'string',
            minWidth: 300,
            flex: 1,
            editable: false,
            renderCell: (cellValues) => {
                return (<Wrapper>
                    {cellValues?.row?.photo ? <img
                        src={cellValues?.row?.photo ? BASE_URL + "/attachment/download/" + cellValues?.row?.photo?.id : ""}
                        width={"40px"} height={"40px"}
                        alt={cellValues?.value}
                        style={{borderRadius: "50%"}}
                    /> : <span style={{
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px"
                    }}><FaUserAlt/></span>}
                    <span style={{
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px"
                    }}>{cellValues?.value}</span>
                </Wrapper>);
            }
        },
        {field: 'login', headerName: 'Login', type: 'string', minWidth: 100,flex:0.7, align:'center', editable: false,},
        {field: 'email', headerName: 'Email', type: 'string', minWidth: 150,flex:0.7, align:'center', editable: false,},
        {field: 'rfid', headerName: 'RFID', type: 'string', minWidth: 100,flex:0.7, align:'center', editable: false,},
        {field: 'passport', headerName: 'Passport', type: 'string', minWidth: 150,flex:0.7, align:'center', editable: false,},
        {
            field: 'roleName',
            headerName: 'Role',
            type: 'string',
            minWidth: 200,
            flex:0.7,
            align:'center',
            editable: false,
            renderCell: (cellValues) => {
                // console.log(cellValues?.row)
                return (<Wrapper>
            <span style={{
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px"
            }}>{cellValues?.row?.roleName}</span>
                </Wrapper>);
            }
        },
    ];
    const [dataTeacher, setDataTeacher] = useState([])
    const [dataStudent, setDataStudent] = useState([])
    const [dataStaff, setDataStaff] = useState([])
    const [spinnerTeacher, setSpinnerTeacher] = useState(true)
    const [spinnerStudent, setSpinnerStudent] = useState(true)
    const [spinnerRahbaryat, setSpinnerRahbaryat] = useState(true)
    const [spinnerStaff, setSpinnerStaff] = useState(true)
    const [stateName, setStateName] = useState("");
    const totallman = 400;
    const totallwooman = 300;
    const totall = totallman + totallwooman;

    const [select, setSelect] = useState([])

    const [tooltipStyle, setTooltipStyle] = useState({
        display: 'none',
    });
    const onLocationMouseOver = (event) => {
        setStateName(event.target.getAttribute("name"));
        setSelect(mapStatistics?.find(i => i?.region === event.target.getAttribute("name")))
    };

    function onLocationMouseOut(event) {
        setStateName("")
        setTooltipStyle({
            display: 'none'
        })
    }

    function handleLocationMouseMove(event) {
        setTooltipStyle({
            display: 'block', position: "absolute", right: 0, top: 0,
        })
    }


    const stylelavozim = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "66vw",
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: 0.9,
        p: 4,
    };
    const stylestatistics = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "97vw",
        height: "99vh",
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: 0.9,
        p: 4,
    }

    const comeperson = 13;

    function pres(a, b) {
        if (!a || !b) return 0
        return Math.ceil(b * 100 / a)
    }

    function pres2(a) {
        return 100 - a
    }

    return (
        <BodySection>
            <BodyCard>

                <BodyCardSection onClick={handleOpenRahbariyat}>
                    <BodyCardTitleWrapper>
                        <BodyCardTitleIconWrapper>
                            <BodyCardTitleIcon>
                                <FaUserTie/>
                            </BodyCardTitleIcon>
                            <ComeCount>{rahbariyat?.length === 2 ? rahbariyat[0] : 0}</ComeCount>
                        </BodyCardTitleIconWrapper>
                        <BodyCardTitle>
                            <h3>Leadership</h3>
                            <BodyCardCountUsers>{rahbariyat?.length === 2 ? rahbariyat[1] : rahbariyat?.length === 1 ? rahbariyat[0] : 0}</BodyCardCountUsers>
                        </BodyCardTitle>
                    </BodyCardTitleWrapper>
                </BodyCardSection>

                {/*** ================= rahbariyat =================== ***/}
                <Modal
                    open={openRahbariyat}
                    onClose={handleCloseOpenRahbariyat}
                    aria-labelledby="keep-mounted-modal-title"
                    aria-describedby="keep-mounted-modal-description"
                >
                    <Box sx={styleTable}>
                        <CloseMyButtonForChild
                            onClick={handleCloseOpenRahbariyat}
                            whileHover={{rotate: 180, scale: 1.1}}
                            whileTap={{scale: 0.9}}
                            transition={{duration: 0.3}}
                        ><RiCloseLine/></CloseMyButtonForChild>
                        <h2 style={{textAlign: "center", color: mainColor}}>Rahbaryat</h2>
                        {
                            spinnerRahbaryat
                                ?
                                <Spinner/>
                                :
                                <Wrapper2>
                                    <BulimDashboard s={false}/>
                                    <hr/>
                                    {/*<BulimStaffs />*/}
                                </Wrapper2>
                        }
                    </Box>
                </Modal>
                {/*** ================= rahbariyat =================== ***/}
                {/*** ================= rahbariyat =================== ***/}
                <Modal
                    open={openRahbariyat}
                    onClose={handleCloseOpenRahbariyat}
                    aria-labelledby="keep-mounted-modal-title"
                    aria-describedby="keep-mounted-modal-description"
                >
                    <Box sx={styleTable}>
                        <CloseMyButtonForChild
                            onClick={handleCloseOpenRahbariyat}
                            whileHover={{rotate: 180, scale: 1.1}}
                            whileTap={{scale: 0.9}}
                            transition={{duration: 0.3}}
                        ><RiCloseLine/></CloseMyButtonForChild>
                        <h2 style={{textAlign: "center", color: mainColor}}>Rahbaryat</h2>
                        {spinnerRahbaryat ? <Spinner/> : <Wrapper2>
                            <BulimDashboard s={false}/>
                            <hr/>
                            {/*<BulimStaffs />*/}
                        </Wrapper2>}
                    </Box>
                </Modal>
                {/*** ================= rahbariyat =================== ***/}

                <BodyCardSection
                    onClick={() => navigate('/rektor/employees/teachers')}
                >
                    <BodyCardTitleWrapper>
                        <BodyCardTitleIconWrapper>
                            <BodyCardTitleIcon>
                                <GiTeacher/>
                            </BodyCardTitleIcon>
                            <ComeCount>{teachers?.length === 2 ? teachers[0] : 0}</ComeCount>
                        </BodyCardTitleIconWrapper>
                        <BodyCardTitle>
                            <h3>Teachers</h3>
                            <BodyCardCountUsers>{teachers?.length === 2 ? teachers[1] : teachers?.length === 1 ? teachers[0] : 0}</BodyCardCountUsers>
                        </BodyCardTitle>
                    </BodyCardTitleWrapper>
                </BodyCardSection>

                {/*** ================= teacher =================== ***/}
                <Modal
                    open={openTeacher}
                    onClose={handleCloseOpenTeacher}
                    aria-labelledby="keep-mounted-modal-title"
                    aria-describedby="keep-mounted-modal-description"
                >
                    <Box sx={styleTable}>
                        <CloseMyButtonForChild onClick={handleCloseOpenTeacher}
                                               whileHover={{rotate: 180, scale: 1.1}}
                                               whileTap={{scale: 0.9}}
                                               transition={{duration: 0.3}}
                        ><RiCloseLine/></CloseMyButtonForChild>
                        <h2 style={{textAlign: "center", color: mainColor}}>Teachers</h2>

                    </Box>
                </Modal>
                {/*** ================= teacher =================== ***/}

                <BodyCardSection onClick={() => navigate('/rektor/students/allStudents')}>
                    <BodyCardTitleWrapper>
                        <BodyCardTitleIconWrapper>
                            <BodyCardTitleIcon>
                                <FaUserGraduate/>
                            </BodyCardTitleIcon>
                            <ComeCount>{students?.length === 2 ? students[0] : 0}</ComeCount>
                        </BodyCardTitleIconWrapper>
                        <BodyCardTitle w>
                            <h3> Students</h3>
                            <BodyCardCountUsers>{students?.length === 2 ? students[1] : students?.length === 1 ? students[0] : 0}</BodyCardCountUsers>
                        </BodyCardTitle>
                    </BodyCardTitleWrapper>
                </BodyCardSection>


                <BodyCardSection onClick={handleOpenStaff}>
                    <BodyCardTitleWrapper>
                        <BodyCardTitleIconWrapper>
                            <BodyCardTitleIcon>
                                <FaUserFriends/>
                            </BodyCardTitleIcon>
                            <ComeCount>{staff?.length === 2 ? staff[0] : 0}</ComeCount>
                        </BodyCardTitleIconWrapper>
                        <BodyCardTitle>
                            <h3> Staff</h3>
                            <BodyCardCountUsers>{staff?.length === 2 ? staff[1] : staff?.length === 1 ? staff[0] : 0}</BodyCardCountUsers>
                        </BodyCardTitle>
                    </BodyCardTitleWrapper>
                </BodyCardSection>
                {/*** ================= staff =================== ***/}
                <Modal
                    open={openStaff}
                    onClose={handleCloseOpenStaff}
                    aria-labelledby="keep-mounted-modal-title"
                    aria-describedby="keep-mounted-modal-description"
                >
                    <Box sx={styleTable}>
                        <CloseMyButtonForChild onClick={handleCloseOpenStaff}
                                               whileHover={{rotate: 180, scale: 1.1}}
                                               whileTap={{scale: 0.9}}
                                               transition={{duration: 0.3}}
                        ><RiCloseLine/></CloseMyButtonForChild>
                        <h2 style={{textAlign: "center", color: mainColor}}>Staffs</h2>
                        {spinnerStaff ? <Spinner/> : <DataGrid
                            style={{width: "500px!important", minHeight: "300px!important"}}
                            columns={columnsStaff}
                            rows={dataStaff}
                            components={{Toolbar: GridToolbar}}
                            autoHeight
                            pageSize={6}
                            initialState={{
                                columns: {
                                    columnVisibilityModel: {
                                        login: false,
                                        card: false,
                                        rfid: false,
                                        email: false,
                                        passport: false
                                    },
                                },
                            }}
                        />}
                    </Box>
                </Modal>
                {/*** ================= staff =================== ***/}


            </BodyCard>


            <hr style={{width: "100%"}}/>


            <Mainbox>

                <Cardallcity>
                    <Coreboxlavozim>
                        <Cardxodimheader>
                            {positionItems?.length > 0 && positionItems?.map((item, key) => (
                                <Cardxodimbody key={key}>
                                    <Cardimg>
                                        <img style={{width: "100%"}} src={item.photo} alt="rasim"/>
                                    </Cardimg>
                                    <Cardxodiminfo>
                                        <Statusxodim>
                                            <h6>{item.lavozmi}</h6>
                                            <Cardjami>
                                                <h6 style={{margin: 0}}>{item.jami}</h6>
                                            </Cardjami>

                                            <Progres>
                                                <Tooltip title={`kelgan:${item?.comeperson}`}>
                                                    <Progresitem bgcolor={"#2ecc71"}
                                                                 width={`${pres(item.jami, item?.comeperson)}%`}/>
                                                </Tooltip>
                                                <Tooltip title={`kelmagan:${item.jami - item?.comeperson}`}>
                                                    <Progresitem bgcolor={"#ff0000"}
                                                                 width={`${pres2(pres(item.jami, item?.comeperson))}%`}/>
                                                </Tooltip>
                                            </Progres>
                                        </Statusxodim>
                                        <Statusxodim pos={"end"}>
                                            <h6>asosiy:{item.asosiy}</h6>
                                            <h6>o'rindosh:{item.orindosh}</h6>
                                            <h6>soatbay:{item.soatbay}</h6>
                                        </Statusxodim>
                                    </Cardxodiminfo>
                                </Cardxodimbody>
                            ))}
                            <Box sx={{display: 'flex', justifyContent: 'end'}}>
                                <Aboutteacher><h6 onClick={handleOpenBatafsil}
                                                  style={{margin: 0, cursor: "pointer"}}>Read more</h6>
                                </Aboutteacher>
                            </Box>

                        </Cardxodimheader>

                        <Modal
                            open={openbatafsil}
                            onClose={handleCloseBatafsil}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={stylelavozim} component={stylelavozimres}>
                                <CloseMyButtonForChild onClick={handleCloseBatafsil}
                                                       whileHover={{rotate: 180, scale: 1.1}}
                                                       whileTap={{scale: 0.9}}
                                                       transition={{duration: 0.3}}
                                ><RiCloseLine/></CloseMyButtonForChild>
                                <Bolimtable data={positionItems}/>
                            </Box>
                        </Modal>
                    </Coreboxlavozim>
                </Cardallcity>

                <Cardmap>
                    <Titlecard><img width='38' height='38'
                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5UlEQVR4nO2WMQrCQBBFp7UQvIvewhTClt7JkwRUtDSFmMiiaBODYC3aRBfTKoygFiFRFAuHkf/gQ2DZJX/2zyREAAAAwF/gj1mVSuQWvSjmzmbL9dGCK90J1/rR00Na09Xb558b8KKYB7uDfIX9Lw3Mjxk3gqVeA9n5wtVe+HLjJ7ERjdBc+w00w5iHe8U9QA8TtykU3KdQe7bWEyHSoiIJEWsSFUndiTWJYMDhBhgRyiMdiRRN7OSrmmKMOsUfskT7rwRZw6pUQvqFLAwY+apaRMjIV9aiiY0OlVBvAAAAACB9XAG14TcfvSfSJAAAAABJRU5ErkJggg=="
                                    alt='icon'/>
                        Region of statistics</Titlecard>

                    <Cardmapinfo style={tooltipStyle}>
                        <Titlemapcard>{stateName.split(" ")[0]}: {select?.count}</Titlemapcard>
                        <Wrapperinfo>
                            <Wrappershakli>
                                <Wrappericon>
                                    <BsSun size={22}/>
                                    <Numbericon>- {select?.eduTypes?.find(i => i?.eduType === "KUNDUZGI")?.count}</Numbericon>
                                </Wrappericon>
                                <Wrappericon>
                                    <BsMoonStars size={22}/>
                                    <Numbericon>- {select?.eduTypes?.find(i => i?.eduType === "KECHKI")?.count}</Numbericon>
                                </Wrappericon>
                                <Wrappericon>
                                    <FaNetworkWired size={22}/>
                                    <Numbericon>- {select?.eduTypes?.find(i => i?.eduType === "SIRTQI")?.count}</Numbericon>
                                </Wrappericon>
                            </Wrappershakli>
                            <Gender>
                                <Wrappericon>
                                    <FcBusinessman size={25}/>
                                    <Numbericon>- {select?.ganders?.find(i => i?.gander === "MALE")?.count}</Numbericon>
                                </Wrappericon>
                                <Wrappericon>
                                    <FcBusinesswoman size={25}/>
                                    <Numbericon>- {select?.ganders?.find(i => i?.gander === "FEMALE")?.count}</Numbericon>
                                </Wrappericon>
                            </Gender>
                        </Wrapperinfo>
                    </Cardmapinfo>

                    <SVGMap
                        map={Uzbmap}
                        onLocationMouseOver={onLocationMouseOver}
                        onLocationMouseOut={onLocationMouseOut}
                        onLocationMouseMove={handleLocationMouseMove}
                    />

                    <Batafsilposition>
                        <Aboutteacher><h6 onClick={handleOpenBatafsil2}
                                          style={{margin: 0, cursor: "pointer"}}>Read more</h6>
                        </Aboutteacher>
                    </Batafsilposition>

                    <Modal
                        open={openbatafsil2}
                        onClose={handleCloseBatafsil2}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={stylestatistics} component={stylestatist}>
                            <CloseMyButtonForChild onClick={handleCloseBatafsil2}
                                                   whileHover={{rotate: 180, scale: 1.1}}
                                                   whileTap={{scale: 0.9}}
                                                   transition={{duration: 0.3}}
                            ><RiCloseLine/></CloseMyButtonForChild>
                            <Statistics data={mapStatistics}/>
                        </Box>
                    </Modal>
                </Cardmap>
                <BodySection2>
                    <BodySection2Body>

                        {countStudentType?.length !== 0 && <RektorDashboardChart title={"Type of students education"}
                                                                                 series={countStudentType?.map(i => i.count)}
                                                                                 labels={countStudentType?.map(i => i.name)}
                                                                                 isSpinner={false}/>}
                    </BodySection2Body>

                    <BodySection2Body>


                        {countStudentLang?.length !== 0 &&
                            <RektorDashboardChart title={"Language of students education"}
                                                  series={countStudentLang?.map(i => i.count)}
                                                  labels={countStudentLang?.map(i => i.name)}
                                                  isSpinner={false}/>}
                    </BodySection2Body>
                </BodySection2>
            </Mainbox>

        </BodySection>
    );
};
const Progresitem = styled.div`
    width: ${props => props.width};
    height: 100%;
    background-color: ${props => props.bgcolor};
`
const Progres = styled.div`
    display: flex;
    margin-top: 5px;
    width: 100%;
    overflow: hidden;
    height: 8.5px;
    border-radius: 5px;
`


const stylelavozimres = styled.div`
    ${extrasmall({
        width: "95vw !important"
    })}
`
const stylestatist = styled.div`
    ${extrasmall({
        width: "97vw !important",
        padding: "5px !important",
        height: "100vh !important"
    })}
`

const Cardjami = styled.div`
    background-color: ${mainColor};
    width: 40px;
    height: 25px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
`
const Statusxodim = styled.div`
    display: flex;
    gap: 5px;
    padding: 5px;
    align-items: ${props => props.pos || "start"};
    flex-direction: column;
`
const Cardxodiminfo = styled.div`
    display: grid;
    grid-template-columns: 1fr 0.3fr;
    width: 100%;
`
const Cardimg = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
`
const Cardxodimbody = styled.div`
    padding: 8px;
    width: 100%;
    gap: 8px;
    margin: 0 auto 15px;
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em;
`
const Cardxodimheader = styled.div`
`
const Coreboxlavozim = styled.div`
    width: 100%;
`
const Batafsilposition = styled.div`
    position: absolute;
    bottom: 5px;
    right: 25px;
`
const Aboutteacher = styled.div`
    width: 70px;
    display: flex;
    padding: 5px;
    border-radius: 5px;
    justify-content: center;
    align-items: center;
    color: #FFF;
    background-color: ${mainColor};

    &:hover {
        opacity: 0.8;
    }
`


const Titlecard = styled.h2`
    display: flex;
    font-size: 30px;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 10px;
    ${extrasmall({
        fontSize: "22px"
    })}
`

const Wrappershakli = styled.div`
    display: flex;
    gap: 10px;
    flex-direction: column;
    align-items: center;
`
const Wrappericon = styled.div`
    display: flex;
    align-items: center;
`
const Numbericon = styled.h6`
    margin: 0;
    font-size: 14px;
`

const Gender = styled.div`
    display: flex;
    gap: 10px;
    flex-direction: column;
    align-items: center;
`

const Titlemapcard = styled.h6`
    text-align: center;
    font-size: 15px;
`
const Wrapperinfo = styled.div`
    display: flex;
    gap: 10px;
    justify-content: space-between;
`
const Cardmapinfo = styled.div`
    width: 150px;
    min-height: 100px;
    border-radius: 10px;
    padding: 10px;
    border: 1px solid silver;
    background-color: #ffffff;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    ${xxlarge({
        width: 175,
    })}
    ${xlarge({
        width: 200,
    })}
    ${large({
        width: 200,
    })}
    ${extrasmall({
        width: 200
    })}
`

const Cardmap = styled.div`
    position: relative;
    padding: 20px;
    width: 100%;
    height: auto;
    background: #eae5e5;
    border-radius: 10px;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`

const Cardallcity = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 30px;
    width: 100%;
    height: auto;
    padding: 10px;
    background: #eae5e5;
    border-radius: 10px;
    box-shadow: rgba(99, 99, 99, 0.2) 0 2px 8px 0;
`

const Mainbox = styled.div`
    width: 100%;
    display: grid;
    align-content: center;
    align-items: stretch;
    ${xxlarge({
        gridTemplateColumns: "0.6fr 1fr 0.1fr",
        gap: "20px",
    })}
    ${xlarge({
        gridTemplateColumns: "0.7fr 1fr ",
        gap: "20px",
    })}
    ${large({
        gridTemplateColumns: " 1fr ",
        gap: "30px",
    })}
    ${medium({
        gridTemplateColumns: " 1fr ",
        gap: "30px",
    })}
    ${small({
        gridTemplateColumns: " 1fr ",
        gap: "30px",
    })}
    ${extrasmall({
        gridTemplateColumns: " 1fr ",
        gap: "30px",
    })}
`;


const Wrapper2 = styled.div`
    width: 100%;
    display: flex;
    gap: 20px;
    flex-direction: column;
    padding-bottom: 50px !important;
`

/***** =========== 23.12.2022 =========== ****/

const BodySection2Body = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-wrap: wrap;
    gap: 40px;
    ${large({
        "justify-content": "center",
    })}
    ${medium({
        "justify-content": "center",
    })}
    ${small({
        "justify-content": "center",
    })}
`

const BodySection2 = styled.div`
    display: grid;
    gap: 20px;
`

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    gap: 10px;
    margin: 5px !important;
`;

const styleTable = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "95vw",
        height: "90vh",
        bgcolor: '#fff',
        boxShadow: 24, borderRadius: 3,
        p: 2,
        border: "none",
        outline: 'none',
    }
;const CloseMyButtonForChild = styled(m.button)`
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${mainColor};
    border-radius: 50%;
    color: white;
    font-size: 26px;
    border: none;
    position: absolute;
    top: 10px;
    right: 10px;
`;

const ComeCount = styled.div`
    align-self: flex-end;
    color: lime;
    display: flex;

`


const BodyCardCountUsers = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    //margin-right: 10px;
    font-size: 30px;
    font-weight: 200;
`;

const BodyCardTitle = styled.span`
    margin-top: 20px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;

`;

const BodyCardTitleIcon = styled.span`
    margin-top: -30px;
    width: 55px;
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    background: #deedf4;
    border-radius: 8px;
    ${extrasmall({
        width: "65px", height: "65px",
    })}
`;

const BodyCardTitleIconWrapper = styled.span`
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 24px;
`;

const BodyCardTitleWrapper = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    padding: 5px 15px !important;
    margin-top: 10px !important;
`;

const BodyCardSection = styled.div`
    width: 100%;
    height: 150px;
    background-color: #fff;
    border-radius: 5px;
    color: ${mainColor};
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.1) 0 1px 2px 0;

    &:hover {
        box-shadow: 2px 3px 5px 1px rgba(81, 159, 219, 0.43);
    }

`;

const BodyCard = styled.div`
    margin-top: 20px;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;

    ${medium({
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '30px',
    })}
    ${small({
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '30px',
    })}
    ${extrasmall({
        gridTemplateColumns: 'repeat(1, 1fr)',
        gap: '30px',
    })}

`;

const BodySection = styled.div`
    padding: 1rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 30px;
  
`;


export default MainSectionBody;