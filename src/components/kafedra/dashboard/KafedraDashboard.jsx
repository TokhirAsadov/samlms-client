import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import KafedraChart from "./KafedraChart";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import {GiTeacher} from "react-icons/gi";
import RememberButton from "./RememberButton";
import moment from "moment";
import {useHttp} from "../../hook/useHttp";
import {BsFillArrowLeftCircleFill, BsFillArrowRightCircleFill, BsThreeDotsVertical} from "react-icons/bs";
import {extrasmall} from "../../../responsiv";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {DesktopDatePicker} from "@mui/x-date-pickers";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import {IoClose} from "react-icons/io5";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Card, CardContent, Stack} from "@mui/material";
import Button from "@mui/material/Button";
import {fetchSection} from "../../../redux/actions/kafedra/section_actions";
import {toast} from "react-toastify";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";
import EmptyDataImg from "../../emptyDataImg/EmptyDataImg";


const KafedraDashboard = () => {
    const kafedra = useSelector(state => state?.section?.section);
    const user = useSelector(state => state?.user?.user);
    const [kafedraId, setKafedraId] = useState(null);
    const [series, setSeries] = useState([0, 0]);
    const [spinner, setSpinner] = useState(true);
    const [remembers, setRemembers] = useState([]);
    const [checkRemembers, setCheckRemembers] = useState([]);
    const [stop, setStop] = useState(false);
    const [intervalId, setIntervalId] = useState(0);
    const [openChangeKafedraName, setOpenChangeKafedraName] = useState(false)
    const [statistics, setStatistics] = useState(null);
    const [value, setValue] = React.useState(moment());
    const [departmentName, setDepartmentName] = useState({})
    const [loadTimeTable, setLoadTimeTable] = useState(true);
    const {headers} = getHeaders();
    const dispatch = useDispatch();
    const {request} = useHttp();

    const [objWeek, setObjWeek] = useState({
        date: new Date(),
        dateFrom: moment().startOf('isoWeek').toDate(),
        dateTo: moment().endOf('isoWeek').toDate(),
        weekNumber: moment().isoWeek(),
        year: moment().year(),
        month: moment().month(),
        day: moment().date(),
        weekday: moment().day(),
    });
    let thisWeek = moment(new Date()).isoWeek();
    let thisWeekday = moment(new Date()).day();
    const handleOpenModal = () => setOpenChangeKafedraName(true)
    const handleCloseModal = () => setOpenChangeKafedraName(false)
    const onChange = (dateValue) => {
        const weekNumber = moment((dateValue).format('YYYY-MM-DD')).isoWeek();
        const weekday = moment((dateValue).format('YYYY-MM-DD')).day();
        const day = moment((dateValue).format('YYYY-MM-DD')).date();
        const month = moment((dateValue).format('YYYY-MM-DD')).month();
        const year = moment((dateValue).format('YYYY-MM-DD')).year();
        const dateFrom = moment((dateValue).format('YYYY-MM-DD')).startOf('isoWeek').toDate();
        const dateTo = moment((dateValue).format('YYYY-MM-DD')).endOf('isoWeek').toDate();

        setObjWeek({
            dateValue,
            dateFrom,
            dateTo,
            weekNumber,
            year,
            weekday,
            day,
            month
        })
    }

    useEffect(() => {
        setLoadTimeTable(true)
        kafedra?.id && axios.get(BASE_URL + "/timeTableByWeekOfYear/getTeacherTimeTableAndStatisticsForKafedra?kafedraId=" + kafedra?.id + "&year=" + objWeek?.year + "&month=" + (objWeek?.month + 1) + "&day=" + objWeek?.day + "&week=" + objWeek?.weekNumber + "&weekday=" + objWeek?.weekday, {headers})
            .then(res => {
                setTable(res?.data?.obj.reduce((accumulator, currentObject) => {
                    const existingObject = accumulator.find(obj => obj.teacherData.id === currentObject.teacherData.id);

                    if (existingObject) {
                        existingObject.shows = [...existingObject.shows, ...currentObject.shows];
                    } else {
                        accumulator.push(currentObject);
                    }

                    return accumulator;
                }, []));
                setStatistics(res?.data?.secondObj);
                setLoadTimeTable(false)
            })
            .catch(err => {
                setTable([]);
                setLoadTimeTable(false)
                console.log(err)
            })

    }, [objWeek])

    useEffect(() => {
        setDepartmentName(kafedra)

    }, [kafedra]);
    useEffect(() => {
        onChange(value)
    }, [value])


    const returnTime = () => {
        const newIntervalId = setInterval(() => {
            fetchRemembers();
        }, 60000);

        setIntervalId(newIntervalId);
    }

    const [table, setTable] = useState([])


    useEffect(() => {
        if (kafedra) {
            setKafedraId(kafedra?.id)
        }
        kafedra?.id && axios.get(BASE_URL + "/timeTableByWeekOfYear/getTeacherTimeTableAndStatisticsForKafedra?kafedraId=" + kafedra?.id + "&year=" + objWeek?.year + "&month=" + (objWeek?.month + 1) + "&day=" + objWeek?.day + "&week=" + objWeek?.weekNumber + "&weekday=" + objWeek?.weekday, {headers})
            .then(res => {
                setTable(res?.data?.obj);
                setStatistics(res?.data?.secondObj);
                setLoadTimeTable(false)
            })
            .catch(err => {
                setTable([]);
                setLoadTimeTable(false)
                console.log(err)
            })
    }, [kafedra])


    useEffect(() => {
        kafedra?.id && axios.get(BASE_URL + "/kafedra/getComeCountTodayStatistics?id=" + kafedra?.id, {headers})
            .then(res => {
                let arr = [];
                res?.data?.obj?.comeCount !== null ? arr.push(res?.data?.obj?.comeCount) : arr.push(0);
                res?.data?.obj?.comeCount !== null ? arr.push(res?.data?.obj?.allCount - res?.data?.obj?.comeCount) : arr.push(res?.data?.obj?.allCount);
                setSeries(() => arr);
                setSpinner(false);
            })
            .catch(err => {
                console.log(err)
            })
        kafedra?.id && axios.get(BASE_URL + "/kafera-mudiri/getTeachersStatisticsForKafedraDashboard?kafedraId=" + kafedraId, {headers})
            .then(res => {
                setStatistics(res?.data?.obj)
            })
            .catch(err => {
                console.log(err)
            })

    }, [kafedraId])


    useEffect(() => {

        fetchRemembers();
        returnTime();


        kafedra?.id && axios.get(BASE_URL + "/timeTableByWeekOfYear/getTeacherTimeTableAndStatisticsForKafedra?kafedraId=" + kafedra?.id + "&year=" + objWeek?.year + "&month=" + (objWeek?.month + 1) + "&day=" + objWeek?.day + "&week=" + objWeek?.weekNumber + "&weekday=" + objWeek?.weekday, {headers})
            .then(res => {
                setTable(res?.data?.obj);
                setStatistics(res?.data?.secondObj);
                setLoadTimeTable(false)
            })
            .catch(err => {
                setTable([]);
                setLoadTimeTable(false)
                console.log(err)
            })

    }, [])


    useEffect(() => {
        if (checkRemembers?.length === 0) {
            setStop(true)
        } else {
            setStop(false)
        }
    }, [checkRemembers])


    const fetchRemembers = async () => {
        await axios.get(`${BASE_URL}/user/notification?week=${45}&year=${2023}`, {headers})
            .then(res => {
                setRemembers(res?.data?.obj);
            })
            .catch(err => {
                setStop(true);
                console.log(err);
            })
    }

    useEffect(() => {
        clearInterval(intervalId);
    }, [stop]);


    useEffect(() => {
        if (remembers?.length === 0) {
            clearInterval(intervalId);
        } else {
            changeCheckRemembers(table);
        }
    }, [remembers, table]);

    const changeCheckRemembers = (data) => {
        let arr = [];

        remembers?.map((item, index) => {
            let catchItem = data?.find(i => i?.teacherData?.id === item?.id);
            let h1 = new Date();
            h1.setHours(h1.getHours(), 0, 0)
            let h2item = times.find(i => moment(i.hour).format("HH:mm:ss") === moment(h1).format("HH:mm:ss"))?.id;
            let h3item = catchItem?.shows?.find(i => i?.hourNumber === (h2item + 2));

            if (h3item) {
                arr.push(item)
            }

        })

        if (arr.length !== 0) {
            setCheckRemembers(arr)
        } else {
            setCheckRemembers([])
        }
    }
    const event = new Date();

    const times = [
        {
            id: 1,
            time: "9:00-9:50",
            hour: event.setHours(9, 0, 0),
            end: event.setHours(9, 50, 0)
        },
        {
            id: 2,
            time: "10:00-10:50",
            hour: event.setHours(10, 0, 0),
            end: event.setHours(10, 50, 0)
        },
        {
            id: 3,
            time: "11:00-11:50",
            hour: event.setHours(11, 0, 0),
            end: event.setHours(11, 50, 0)
        },
        {
            id: 4,
            time: "12:00-12:50",
            hour: event.setHours(12, 0, 0),
            end: event.setHours(12, 50, 0)
        },
        {
            id: 5,
            time: "13:00-13:50",
            hour: event.setHours(13, 0, 0),
            end: event.setHours(13, 50, 0)
        },
        {
            id: 6,
            time: "14:00-14:50",
            hour: event.setHours(14, 0, 0),
            end: event.setHours(14, 50, 0)
        },
        {
            id: 7,
            time: "15:00-15:50",
            hour: event.setHours(15, 0, 0),
            end: event.setHours(15, 50, 0)
        },
        {
            id: 8,
            time: "16:00-16:50",
            hour: event.setHours(16, 0, 0),
            end: event.setHours(16, 50, 0)
        },
        {
            id: 9,
            time: "17:00-17:50",
            hour: event.setHours(17, 0, 0),
            end: event.setHours(17, 50, 0)
        },
        {
            id: 10,
            time: "18:00-18:50",
            hour: event.setHours(18, 0, 0),
            end: event.setHours(18, 50, 0)
        },
        {
            id: 11,
            time: "19:00-19:50",
            hour: event.setHours(19, 0, 0),
            end: event.setHours(19, 50, 0)
        },
        {
            id: 12,
            time: "20:00-20:50",
            hour: event.setHours(20, 0, 0),
            end: event.setHours(20, 50, 0)
        }
    ]

    const handleSaveDepartment = async () => {
        if (departmentName?.name.trim().length === 0) return;
        console.log(departmentName)
        user && await axios.put(`${BASE_URL}/kafera-mudiri/changeNameOfKafedra`, departmentName, {headers})
            .then(response => {
                toast.success(response?.data?.message)
                dispatch(fetchSection(request));
                handleCloseModal()
            })
            .catch(err => {
                console.log(err)
                toast.error(err?.response?.data?.message)
            })
    }

    return (
        <Container>
            <Header>
                <HeaderSection>
                    <BodyCardSection>

                        <BodyCardTitleWrapper>
                            <IconButton
                                onClick={handleOpenModal}
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                }} title={'change kafedra name'}>
                                <BsThreeDotsVertical/>
                            </IconButton>
                            <BodyCardTitleIcon>
                                <GiTeacher/>
                            </BodyCardTitleIcon>
                            <HeaderWrapper>
                                <Title>{kafedra?.name}</Title>
                            </HeaderWrapper>
                        </BodyCardTitleWrapper>
                    </BodyCardSection>

                    <HeaderSectionItem>
                        {
                            !stop && checkRemembers.length !== 0 &&
                            <RememberWrapper>
                                <RememberButton data={checkRemembers}/>
                            </RememberWrapper>
                        }
                        {
                            kafedraId !== null && series?.reduce((prev, current) => prev + current) ?
                                <KafedraChart seriesK={series} isSpinner={spinner}/> : "Not exists teachers"
                        }
                    </HeaderSectionItem>
                </HeaderSection>
            </Header>
            <hr style={{width: "100%", minHeight: "2px", backgroundColor: mainColor}}/>


            <Boxcore>
                <Title>Teacher's schedule</Title>

                <LocalizationProvider dateAdapter={AdapterMoment}>

                    <DesktopDatePicker
                        label="Day"
                        inputFormat="DD/MM/YYYY"
                        value={value}
                        onChange={(newValue) => {
                            setValue(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} sx={{width: 165, margin: "20px 0"}}/>}
                    />

                </LocalizationProvider>
                <Card sx={{minHeight: 250}}>
                    <CardContent>
                        <Tablecorebox>

                            <Table>
                                {table.length !== 0 && <TableHeader>
                                    <User>Full name</User>
                                    {
                                        times.map((item, key) => (
                                            <Times sz={"12px"} key={key}>{item.time}</Times>
                                        ))
                                    }
                                </TableHeader>}

                                <TableBody>
                                    {
                                        loadTimeTable ?
                                            <Box sx={{width: '100%'}}>
                                                <LinearProgress/>
                                            </Box> : table?.map((item, index) => (
                                                <Wrapper key={index}>
                                                    <User> {
                                                        item?.teacherData?.fullName?.split(" ")?.slice(0,2)?.join(" ")
                                                    }</User>
                                                    {
                                                        times.map((i2, key) => {

                                                            let statistic = statistics?.find(statistic => statistic?.id === item?.teacherData?.id);
                                                            let hourItem = item?.shows?.find(item => item?.hourNumber === i2?.id);
                                                            let times = statistic?.rooms?.find(i3 => i3?.room?.startsWith(hourItem?.room?.substring(0, hourItem?.room?.indexOf('-') + 4)))?.times;
                                                            let timesTouch = times?.filter(item => item?.section === i2?.id)
                                                            return item?.shows?.filter(i => i.hourNumber === i2?.id)?.length !== 0
                                                                ?
                                                                <Tooltip
                                                                    key={key}
                                                                    title={item?.shows?.filter(i => i?.hourNumber === i2?.id)[0]?.lessonName}
                                                                    arrow>
                                                                    <Times2
                                                                        bg={value < new Date() && (timesTouch === undefined || timesTouch?.length === 0) && (i2.hour < new Date() || objWeek.weekNumber < thisWeek || (objWeek.weekNumber === thisWeek && objWeek.weekday < thisWeekday) || objWeek.year < new Date().getFullYear()) && statistics !== null && statistics?.length !== 0 && "red"}
                                                                        sz={"12px"}
                                                                        cl={value < new Date() && (timesTouch === undefined || timesTouch?.length === 0) && (i2.hour < new Date() || objWeek.weekNumber < thisWeek || (objWeek.weekNumber === thisWeek && objWeek.weekday < thisWeekday) || objWeek.year < new Date().getFullYear()) && statistics !== null && statistics?.length !== 0 && "red" && "#fff"}>
                                                                        <TimeTableGroup>
                                                                            {
                                                                                item?.shows?.filter(i => i?.hourNumber === i2?.id)[0]?.groups?.length > 1
                                                                                    ?
                                                                                    item?.shows?.filter(i => i?.hourNumber === i2?.id)[0]?.groups?.join('/ ')
                                                                                    :
                                                                                    item?.shows?.filter(i => i?.hourNumber === i2?.id)[0]?.groups[0]
                                                                            }
                                                                        </TimeTableGroup>

                                                                        {
                                                                            timesTouch && timesTouch?.length !== 0 &&
                                                                            <TimeTouch color={new Date(i2?.hour).setDate(
                                                                                new Date(timesTouch[0]?.time).getDate()
                                                                            ) >= timesTouch[0]?.time ? "green" : "red"}>
                                                                                {moment(new Date(
                                                                                    new Date(i2?.hour).setDate(
                                                                                        new Date(timesTouch[0]?.time).getDate()
                                                                                    ) >= timesTouch[0]?.time

                                                                                        ?

                                                                                        new Date(i2?.hour).setDate(
                                                                                            new Date(timesTouch[0]?.time).getDate()
                                                                                        ) - timesTouch[0]?.time

                                                                                        :

                                                                                        timesTouch[0]?.time
                                                                                        -
                                                                                        new Date(i2?.hour).setDate(
                                                                                            new Date(timesTouch[0]?.time).getDate()
                                                                                        )
                                                                                )).format("mm:ss")}

                                                                                {
                                                                                    new Date(i2?.hour)?.setDate(
                                                                                        new Date(timesTouch[0]?.time)?.getDate()
                                                                                    ) >= timesTouch[0]?.time
                                                                                        ?
                                                                                        <BsFillArrowLeftCircleFill
                                                                                            size={16}/>
                                                                                        :
                                                                                        <BsFillArrowRightCircleFill
                                                                                            size={16}/>
                                                                                }
                                                                            </TimeTouch>
                                                                        }

                                                                        {
                                                                            value < new Date() && (timesTouch === undefined || timesTouch?.length === 0) && (i2.hour < new Date() || objWeek.weekNumber < thisWeek || (objWeek.weekNumber === thisWeek && objWeek.weekday < thisWeekday)) && statistics !== null && statistics?.length !== 0 &&
                                                                            <TimeTouch color={
                                                                                'red'
                                                                            }>
                                                                                50:00 <BsFillArrowRightCircleFill
                                                                                size={12}/>
                                                                            </TimeTouch>
                                                                        }


                                                                        <span>
                                                          {item?.shows?.filter(i => i?.hourNumber === i2?.id)[0]?.room}
                                                        </span>
                                                                    </Times2>
                                                                </Tooltip>
                                                                :
                                                                <Times2 key={key}></Times2>
                                                        })
                                                    }
                                                </Wrapper>
                                            ))
                                    }
                                </TableBody>
                            </Table>
                        </Tablecorebox>
                        {
                            table.length === 0 && (
                                <EmptyDataImg w={200} h={180}/>
                            )
                        }
                    </CardContent>
                </Card>

            </Boxcore>


            <Modal
                open={openChangeKafedraName}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} component={style2}>
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography variant={'h6'} color={mainColor} mt={1}>
                            Update department name
                        </Typography>
                        <IconButton onClick={handleCloseModal}> <IoClose size={22}/></IconButton>
                    </Box>

                    <Box>
                        <Stack sx={{height: "150px", padding: "0 10px"}} direction="row" justifyContent="center"
                               alignItems="center">
                            <TextField
                                fullWidth
                                required
                                value={departmentName?.name}
                                label="Department"
                                onChange={(e) => setDepartmentName(prev => ({...prev, name: e.target.value}))}
                            />
                        </Stack>

                        <Stack direction="row" spacing={2} justifyContent="flex-end"
                               alignItems="center">
                            <Button variant="outlined" onClick={handleCloseModal}>Cancel</Button>
                            <Button variant="contained" onClick={handleSaveDepartment}>
                                Update
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Modal>
        </Container>
    );
};


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    padding: "15px",
    borderRadius: "8px",
};
const style2 = styled.div`
    ${extrasmall({
        width: "95% !important",
    })}
`
const TimeTouch = styled.span`
    color: ${props => props?.color};
    position: absolute;
    top: 40%;
    right: -8px;
    font-size: 11px;
    rotate: 90deg;
`


const TimeTableGroup = styled.div`
    font-size: 8px;
    width: 100%;
    display: flex;
    text-align: start;
`

const Times2 = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    font-size: ${props => props.sz};
    padding: 0.95rem !important;
    background-color: ${props => props.bg || "#fff"};
    color: ${props => props.cl || "#000"};
    border: 1px solid lightgray;
    position: relative;
`


const Wrapper = styled.div`
    width: 100%;
    display: flex;
`;

const TableBody = styled.div`
    width: 100%;
    display: flex;
    margin: 0 auto;
    flex-direction: column;
`

const Times = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${props => props.sz};
    font-weight: bold;
    padding: 0.95rem !important;
    background-color: ${mainColor};
    color: #ffffff;
    border: 1px solid lightgray;
`

const User = styled.div`
    flex: 1.5;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem !important;
    background-color: ${mainColor};
    font-weight: bold;
    font-size: 12px;
    color: #ffffff;
    text-align: center;
    border: 1px solid lightgray;
`

const TableHeader = styled.div`
    width: 100%;
    display: flex;
    margin: 0 auto;
`;
const Boxcore = styled.div`
    width: 100%;
`;
const Tablecorebox = styled.div`
    width: 100%;
    overflow: scroll;
`
const Table = styled.div`
    width: 1400px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
`;

const RememberWrapper = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    width: 80px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;

const BodyCardTitleIcon = styled.span`
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    background: #f7f7f7;
    border-radius: 50%;
`;


const BodyCardTitleWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 30px;
`;

const BodyCardSection = styled.div`
    padding: 10px;
    margin: 0 20px;
    display: flex;
    align-items: center;
    flex: 1;
    border-radius: 0.75rem;
    background-color: #fff;
    min-height: 250px;
    color: ${mainColor};
`;

const HeaderSectionItem = styled.div`
    position: relative;
    flex: 1;
    margin: 0 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem;
    background-color: #fff;
    min-height: 250px;
`

const HeaderSection = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    ${extrasmall({
        flexDirection: "column",
        gap: "30px"
    })}
`;

const Title = styled.span`
    display: block;
    font-size: 25px;
    color: ${mainColor};
`;

const HeaderWrapper = styled.div`
`;

const Header = styled.div`
    font-size: 24px;
    color: ${mainColor};
`;


const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-height: 500px;
    border-radius: 10px;
    padding: 1rem;
    margin-bottom: 20px;
`;

export default KafedraDashboard;