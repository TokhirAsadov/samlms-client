import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {BASE_URL, getHeaders, mainColor, USER} from "../../../../utills/ServiceUrls";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import {RiCloseLine} from "react-icons/ri";
import axios from "axios";
import {Skeleton, Stack} from "@mui/material";
import SimpleBar from 'simplebar-react';
import {extrasmall} from "../../../../responsiv";
import Noimg from "../../../../utills/images/no-picture.jpg";
import moment from "moment";
import AccordionScienceAttendance from "./AccordionScienceAttendance";
import {fetchEducationYear} from "../../../../redux/actions/educationYear/education_year_actions";
import {useDispatch, useSelector} from "react-redux";
import StudentTimeTableOfWeek from "../../../student/timeTable/StudentTimeTableOfWeek";
import TeacherTimeTableOfWeek from "../../../teacher/timeTable/TeacherTimeTableOfWeek";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {fetchEducationYearStatistics} from "../../../../redux/actions/educationYear/education_year_statistics_actions";




const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "95vw",
    height: "95vh",
    bgcolor: 'background.paper',
    borderRadius: "5px",
    boxShadow: 24,
    positions: 'relative',
};


function ChildModal({group, studentData}) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const [objWeek, setObjWeek] = useState({
        date: new Date(),
        dateFrom: moment(new Date()).startOf('isoWeek').toDate(),
        dateTo: moment(new Date()).endOf('isoWeek').toDate(),
        weekNumber: moment(new Date()).isoWeek()
    });

    return (
        <React.Fragment>
            <Button
                style={{
                    width: "150px",
                    background: `${mainColor}`,
                    color: "#fff",
                    margin: "5px 0",
                    fontSize: "12px",
                    padding: "2px 5px",
                    borderRadius: "10px"
                }} onClick={handleOpen}>Time Table of Week</Button>
            <Modal
                hideBackdrop
                open={open}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={style}>
                    <CloseButtonForChild onClick={handleClose}><RiCloseLine/></CloseButtonForChild>
                    {/*<TimeTableOfWeek group={group}/>*/}
                    <StudentTimeTableOfWeek userId={studentData?.id} group={studentData?.groupData?.name} s={false}
                                            obj={objWeek}/>
                </Box>
            </Modal>
        </React.Fragment>
    );
}

const RektorTalabaForModal = ({data, group, results, accountLocked}) => {
    console.log(data,group,results,accountLocked,'abs');
    const educationYear = useSelector(state => state?.educationYear?.educationYear) || null;
    const [today, setToday] = useState([]);
    const [check, setCheck] = useState(false);
    const dispatch = useDispatch();
    const [eduYearId, setEduYearId] = useState(null)
    const {headers} = getHeaders();

    const [value, setValue] = useState(0);

    function CustomTabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 2 }}>
                        <>{children}</>
                    </Box>
                )}
            </div>
        );
    }



    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }
        const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    let fails = 0;

    results?.map(result => result.score < 60 ? fails++ : "");

    useEffect(() => {
        const day = new Date().getDay();
      group &&  axios.get(BASE_URL + USER.TIME_TABLE + group + "?day=" + day)
            .then(res => {
                setToday(() => res.data.obj)
                setCheck(true);
            })

    }, [group]);
    useEffect(() => {
        fetchEducationYears();
    }, []);

    useEffect(() => {
        fetchStatistics()
    }, [eduYearId]);

    const fetchStatistics =async () => {
        eduYearId  && data?.groupData?.name && data?.id && await  dispatch(fetchEducationYearStatistics(eduYearId,data?.groupData?.name,data?.id,headers))

    }
    const fetchEducationYears = async () => {
        await axios.get(BASE_URL + '/education/educationYearsForSelected', {headers})
            .then(res => {
                // console.log(res?.data?.obj,"education years res come")
                dispatch(fetchEducationYear(res?.data?.obj?.[0]))
                setEduYearId(res?.data?.obj?.[0]?.id)
            })
            .catch(err => {
                console.log(err);
            })

    }

    return (
        <Container>
            <Header>{data?.fullName}</Header>
            <Body>
                <Section>
                    <UserDetailsWrapper>
                        <UserDetailsSection>
                            <PhotoWrapper>
                                <img src={Noimg} alt={"img"} style={{width: "100%"}}/>
                            </PhotoWrapper>
                            <UserMainDetail>
                                <MainDetailItemLabel>
                                    ID :
                                </MainDetailItemLabel>
                                <MainDetailTitle>
                                    {data?.login}
                                </MainDetailTitle>
                            </UserMainDetail>
                            <UserMainDetail>
                                <MainDetailItemLabel>
                                    Passport :
                                </MainDetailItemLabel>
                                <MainDetailTitle>
                                    {data?.passportNum}
                                </MainDetailTitle>
                            </UserMainDetail>

                            <UserMainDetail>
                                <MainDetailItemLabel>
                                    Age :
                                </MainDetailItemLabel>
                                <MainDetailTitle>
                                    {moment(new Date(data?.bornYear)).format("DD.MM.YYYY")}
                                </MainDetailTitle>
                            </UserMainDetail>
                            <UserMainDetail>
                                <MainDetailItemLabel>
                                    Millati :
                                </MainDetailItemLabel>
                                <MainDetailTitle>
                                    {data?.nationality}
                                </MainDetailTitle>
                            </UserMainDetail>
                            <UserMainDetail>
                                <MainDetailItemLabel>
                                    State :
                                </MainDetailItemLabel>
                                <MainDetailTitle>
                                    {data?.citizenship}
                                </MainDetailTitle>
                            </UserMainDetail>
                            {data?.phones?.map((item, key) => (
                                <UserMainDetail key={key}>
                                    <MainDetailItemLabel>
                                        {item.phoneType === "MOBILE_PHONE" && "Mobil phone"}
                                        {item.phoneType === "HOME_PHONE" && "Home phone"}
                                        {item.phoneType === "WORK_PHONE" && "Work phone"}
                                    </MainDetailItemLabel>
                                    <MainDetailTitle>
                                        +{item?.phoneNumber}
                                    </MainDetailTitle>
                                </UserMainDetail>
                            ))}
                        </UserDetailsSection>


                    </UserDetailsWrapper>
                    {data.groupData && (
                        <TeachingContainer>
                            <UserMainDetail>
                                <MainDetailItemLabel>Type of Education:</MainDetailItemLabel>
                                <MainDetailTitle>{data.groupData && data.groupData.educationTypeName}</MainDetailTitle>
                            </UserMainDetail>
                            <UserMainDetail>
                                <MainDetailItemLabel>Direction:</MainDetailItemLabel>
                                <MainDetailTitle>{data.groupData && data.groupData.facultyName}</MainDetailTitle>
                            </UserMainDetail>
                            <UserMainDetail>
                                <MainDetailItemLabel>Group:</MainDetailItemLabel>
                                <MainDetailTitle>{data.groupData && data.groupData.name}</MainDetailTitle>
                            </UserMainDetail>
                        </TeachingContainer>
                    )}


                    <FailContainer>
                        <FailWrapper>
                            FAILS
                            <FailCircle>{fails}</FailCircle>
                        </FailWrapper>
                    </FailContainer>
                </Section>

                {accountLocked && <Section>
                    <TimeTableWrapper>
                        {
                            check ? <TimeTable>
                                    <TimeTableHeader>
                                        <TimeTableHeaderLeft>TIME</TimeTableHeaderLeft>
                                        <TimeTableHeaderRight>TODAY</TimeTableHeaderRight>
                                    </TimeTableHeader>
                                    <TimeTableBody>
                                        {
                                            today?.filter(item => item.hourNumber === 1).map((item, index) => {
                                                return <TimeTableRow key={index}>
                                                    <TimeTableRowLeftItem>
                                                        <DuringTime>{item.periodStartAndEndTime}</DuringTime>
                                                    </TimeTableRowLeftItem>
                                                    <TimeTableRowRightItem>
                                                        {item.teacherName.map((e, num) =>
                                                            <TeacherName key={num}>{e}</TeacherName>
                                                        )}
                                                        <LessonName
                                                            fontSize={item.lessonName > 18 ? "7px" : "9px"}>{item.lessonName}</LessonName>
                                                        <RoomNumber>{item.room}</RoomNumber>
                                                    </TimeTableRowRightItem>
                                                </TimeTableRow>
                                            })
                                        }
                                        {
                                            today?.filter(item => item.hourNumber === 2).map((item, index) => {
                                                return <TimeTableRow>
                                                    <TimeTableRowLeftItem>
                                                        <DuringTime>{item.periodStartAndEndTime}</DuringTime>
                                                    </TimeTableRowLeftItem>
                                                    <TimeTableRowRightItem>
                                                        {item.teacherName.map((e, num) =>
                                                            <TeacherName key={num}>{e}</TeacherName>
                                                        )}
                                                        <LessonName
                                                            fontSize={item.lessonName > 18 ? "7px" : "9px"}>{item.lessonName}</LessonName>
                                                        <RoomNumber>{item.room}</RoomNumber>
                                                    </TimeTableRowRightItem>
                                                </TimeTableRow>
                                            })
                                        }
                                        {
                                            today?.filter(item => item.hourNumber === 3).map((item, index) => {
                                                return <TimeTableRow>
                                                    <TimeTableRowLeftItem>
                                                        <DuringTime>{item.periodStartAndEndTime}</DuringTime>
                                                    </TimeTableRowLeftItem>
                                                    <TimeTableRowRightItem>
                                                        {item.teacherName.map((e, num) =>
                                                            <TeacherName key={num}>{e}</TeacherName>
                                                        )}
                                                        <LessonName
                                                            fontSize={item.lessonName > 18 ? "7px" : "9px"}>{item.lessonName}</LessonName>
                                                        <RoomNumber>{item.room}</RoomNumber>
                                                    </TimeTableRowRightItem>
                                                </TimeTableRow>
                                            })
                                        }
                                        {
                                            today?.filter(item => item.hourNumber === 4).map((item, index) => {
                                                return <TimeTableRow>
                                                    <TimeTableRowLeftItem>
                                                        <DuringTime>{item.periodStartAndEndTime}</DuringTime>
                                                    </TimeTableRowLeftItem>
                                                    <TimeTableRowRightItem>
                                                        {item.teacherName.map((e, num) =>
                                                            <TeacherName key={num}>{e}</TeacherName>
                                                        )}
                                                        <LessonName
                                                            fontSize={item.lessonName > 18 ? "7px" : "9px"}>{item.lessonName}</LessonName>
                                                        <RoomNumber>{item.room}</RoomNumber>
                                                    </TimeTableRowRightItem>
                                                </TimeTableRow>
                                            })
                                        }
                                        {
                                            today?.filter(item => item.hourNumber === 5).map((item, index) => {
                                                return <TimeTableRow>
                                                    <TimeTableRowLeftItem>
                                                        <DuringTime>{item.periodStartAndEndTime}</DuringTime>
                                                    </TimeTableRowLeftItem>
                                                    <TimeTableRowRightItem>
                                                        {item.teacherName.map((e, num) =>
                                                            <TeacherName key={num}>{e}</TeacherName>
                                                        )}
                                                        <LessonName
                                                            fontSize={item.lessonName > 18 ? "7px" : "9px"}>{item.lessonName}</LessonName>
                                                        <RoomNumber>{item.room}</RoomNumber>
                                                    </TimeTableRowRightItem>
                                                </TimeTableRow>
                                            })
                                        }
                                        {
                                            today?.filter(item => item.hourNumber === 6).map((item, index) => {
                                                return <TimeTableRow>
                                                    <TimeTableRowLeftItem>
                                                        <DuringTime>{item.periodStartAndEndTime}</DuringTime>
                                                    </TimeTableRowLeftItem>
                                                    <TimeTableRowRightItem>
                                                        {item.teacherName.map((e, num) =>
                                                            <TeacherName key={num}>{e}</TeacherName>
                                                        )}
                                                        <LessonName
                                                            fontSize={item.lessonName > 18 ? "7px" : "9px"}>{item.lessonName}</LessonName>
                                                        <RoomNumber>{item.room}</RoomNumber>
                                                    </TimeTableRowRightItem>
                                                </TimeTableRow>
                                            })
                                        }
                                        {
                                            today?.filter(item => item.hourNumber === 7).map((item, index) => {
                                                return <TimeTableRow>
                                                    <TimeTableRowLeftItem>
                                                        <DuringTime>{item.periodStartAndEndTime}</DuringTime>
                                                    </TimeTableRowLeftItem>
                                                    <TimeTableRowRightItem>
                                                        {item.teacherName.map((e, num) =>
                                                            <TeacherName key={num}>{e}</TeacherName>
                                                        )}
                                                        <LessonName
                                                            fontSize={item.lessonName > 18 ? "7px" : "9px"}>{item.lessonName}</LessonName>
                                                        <RoomNumber>{item.room}</RoomNumber>
                                                    </TimeTableRowRightItem>
                                                </TimeTableRow>
                                            })
                                        }
                                        {
                                            today?.filter(item => item.hourNumber === 8).map((item, index) => {
                                                return <TimeTableRow>
                                                    <TimeTableRowLeftItem>
                                                        <DuringTime>{item.periodStartAndEndTime}</DuringTime>
                                                    </TimeTableRowLeftItem>
                                                    <TimeTableRowRightItem>
                                                        {item.teacherName.map((e, num) =>
                                                            <TeacherName key={num}>{e}</TeacherName>
                                                        )}
                                                        <LessonName
                                                            fontSize={item.lessonName > 18 ? "7px" : "9px"}>{item.lessonName}</LessonName>
                                                        <RoomNumber>{item.room}</RoomNumber>
                                                    </TimeTableRowRightItem>
                                                </TimeTableRow>
                                            })
                                        }
                                        {
                                            today?.filter(item => item.hourNumber === 9).map((item, index) => {
                                                return <TimeTableRow>
                                                    <TimeTableRowLeftItem>
                                                        <DuringTime>{item.periodStartAndEndTime}</DuringTime>
                                                    </TimeTableRowLeftItem>
                                                    <TimeTableRowRightItem>
                                                        {item.teacherName.map((e, num) =>
                                                            <TeacherName key={num}>{e}</TeacherName>
                                                        )}
                                                        <LessonName
                                                            fontSize={item.lessonName > 18 ? "7px" : "9px"}>{item.lessonName}</LessonName>
                                                        <RoomNumber>{item.room}</RoomNumber>
                                                    </TimeTableRowRightItem>
                                                </TimeTableRow>
                                            })
                                        }
                                        {
                                            today?.filter(item => item.hourNumber === 10).map((item, index) => {
                                                return <TimeTableRow>
                                                    <TimeTableRowLeftItem>
                                                        <DuringTime>{item.periodStartAndEndTime}</DuringTime>
                                                    </TimeTableRowLeftItem>
                                                    <TimeTableRowRightItem>
                                                        {item.teacherName.map((e, num) =>
                                                            <TeacherName key={num}>{e}</TeacherName>
                                                        )}
                                                        <LessonName
                                                            fontSize={item.lessonName > 18 ? "7px" : "9px"}>{item.lessonName}</LessonName>
                                                        <RoomNumber>{item.room}</RoomNumber>
                                                    </TimeTableRowRightItem>
                                                </TimeTableRow>
                                            })
                                        }
                                        {
                                            today?.filter(item => item.hourNumber === 11).map((item, index) => {
                                                return <TimeTableRow>
                                                    <TimeTableRowLeftItem>
                                                        <DuringTime>{item.periodStartAndEndTime}</DuringTime>
                                                    </TimeTableRowLeftItem>
                                                    <TimeTableRowRightItem>
                                                        {item.teacherName.map((e, num) =>
                                                            <TeacherName key={num}>{e}</TeacherName>
                                                        )}
                                                        <LessonName
                                                            fontSize={item.lessonName > 18 ? "7px" : "9px"}>{item.lessonName}</LessonName>
                                                        <RoomNumber>{item.room}</RoomNumber>
                                                    </TimeTableRowRightItem>
                                                </TimeTableRow>
                                            })
                                        }
                                        {
                                            today?.filter(item => item.hourNumber === 12).map((item, index) => {
                                                return <TimeTableRow>
                                                    <TimeTableRowLeftItem>
                                                        <DuringTime>{item.periodStartAndEndTime}</DuringTime>
                                                    </TimeTableRowLeftItem>
                                                    <TimeTableRowRightItem>
                                                        {item.teacherName.map((e, num) =>
                                                            <TeacherName key={num}>{e}</TeacherName>
                                                        )}
                                                        <LessonName
                                                            fontSize={item.lessonName > 18 ? "7px" : "9px"}>{item.lessonName}</LessonName>
                                                        <RoomNumber>{item.room}</RoomNumber>
                                                    </TimeTableRowRightItem>
                                                </TimeTableRow>
                                            })
                                        }
                                    </TimeTableBody>
                                    <ChildModal group={group} studentData={data}/>
                                </TimeTable>
                                : <Stack spacing={1}>
                                    <Skeleton variant="rectangular" width={460} height={570}/>
                                </Stack>
                        }
                    </TimeTableWrapper>
                </Section>}

                <Section>

                    <MarkWrapper>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab label={<p>Attendance</p>} {...a11yProps(0)} />
                            </Tabs>
                            <CustomTabPanel value={value} index={0}>
                                    <AccordionScienceAttendance studentData={data} educationYear={educationYear}/>
                            </CustomTabPanel>
                        </Box>
                    </MarkWrapper>

                </Section>
            </Body>
        </Container>
    );
};

const CloseButtonForChild = styled.button`
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(218, 218, 218, 0.8);
    border-radius: 50%;
    color: ${mainColor};
    font-size: 26px;
    border: none;
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
`;


const MarkWrapper = styled.div`
    width: 100%;
    min-height: 614px;
    background-color: #F4F8FD;
    padding: 20px 10px !important;
    border-radius: 10px;
`;


const RoomNumber = styled.span`
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.8px;
`;

const LessonName = styled.span`
    font-size: ${props => props.fontSize || "12px"};
    font-weight: 600;
    letter-spacing: 0.8px;
`;

const TeacherName = styled.span`
    font-size: 12px;
    font-weight: 300;
    letter-spacing: 0.8px;
`;

const DuringTime = styled.span`
    font-size: 12px;
    font-weight: 300;
`;


const TimeTableRowRightItem = styled.div`
    flex: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border-left: 0.1px solid #cacaca;
    border-bottom-right-radius: ${props => props.borderRadius};
`;

const TimeTableRowLeftItem = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    border-bottom-left-radius: ${props => props.borderRadius};
`;

const TimeTableHeaderRight = styled.div`
    flex: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-weight: 600;
`;

const TimeTableHeaderLeft = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-weight: 600;
`;

const TimeTableRow = styled.div`
    display: flex;
    width: 100%;
    height: 70px;
    background-color: #fff;
    border-top: 0.1px solid #cacaca;

    border-bottom-left-radius: ${props => props.borderRadius};
    border-bottom-right-radius: ${props => props.borderRadius};
`;

const TimeTableBody = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    overflow: scroll;
`;

const TimeTableHeader = styled.div`
    width: 100%;
    height: 35px;
    display: flex;
    background-color: #B4E2FB;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
`;

const TimeTable = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border: 0.1px solid #cacaca;
    border-radius: 10px;
`;

const TimeTableWrapper = styled.div`
    width: 100%;
    min-height: 615px;
    background-color: #F4F8FD;
    border-radius: 10px;
    padding: 20px 10px !important;

`;

const FailCircle = styled.span`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    color: #fff;
    background-color: ${mainColor};
    right: 0;
    top: -50%;
`;

const FailWrapper = styled.span`
    width: 80%;
    background-color: #43B5F4;
    padding-left: 30px !important;
    position: relative;
    border-radius: 20px;
    font-size: 20px;
    color: #fff;
`;

const FailContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px !important;
    padding: 10px 20px !important;
    background-color: #F4F8FD;
    border-radius: 10px;
    width: 100%;
    height: 80px;
`;


const TeachingContainer = styled.div`
    padding-top: 15px;
    min-height: 150px;
    background-color: #F4F8FD;
    border-radius: 10px;
    width: 100%;
    margin-bottom: 20px !important;
`;


const MainDetailTitle = styled.span`
    flex: 1;
    margin-left: 20px !important;
    display: block;

    span {
        font-size: 12px;
    }
`;

const MainDetailItemLabel = styled.span`
    flex: 1;
    margin-left: 10px !important;
    color: ${mainColor};
`;

const UserMainDetail = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px !important;
`;

const PhotoWrapper = styled.div`
    width: 150px;
    height: 150px;
    margin: 0 auto 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 50px;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid #ece7e7;`;

const UserDetailsSection = styled.div`
    flex: 1;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    //background-color: #F4F8FD;
    border-radius: 10px;
`;

const UserDetailsWrapper = styled.div`
    padding-top: 15px;
    min-height: 120px;
    background-color: #F4F8FD;
    border-radius: 10px;
    width: 100%;
    margin-bottom: 20px !important;
`;

const Section = styled.div`
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 10px !important;
`;

const Body = styled.div`
    width: 100%;
    height: 85vh;
    overflow: scroll;
    display: flex;
    flex-wrap: wrap;
`;

const Header = styled.div`
    width: 100%;
    height: 60px;
    background-color: ${mainColor};
    color: #fff;
    font-size: 24px;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    padding-left: 20px !important;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    letter-spacing: 1.2px;
    ${extrasmall({
        fontSize: "15px"
    })}
`;

const Container = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: #fff;
    border-radius: 15px;
`

export default RektorTalabaForModal;