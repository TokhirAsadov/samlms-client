import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import {BASE_URL, DEKAN, getHeaders, mainColor} from "../../../../../utills/ServiceUrls";
import './dashboardBarChart.css';
import axios from "axios";
import {useSelector} from "react-redux";
import moment from "moment";
import Box from '@mui/material/Box';
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import {FaLayerGroup} from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import {extrasmall, small} from "../../../../../responsiv";
import Skeleton from '@mui/material/Skeleton';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import '../../tabsgroup.css';
import NoImg from "../../../../../utills/images/no-picture.jpg";
import EmptyDataImg from "../../../../emptyDataImg/EmptyDataImg";
import * as XLSX from 'xlsx';
import Button from "@mui/material/Button";

const DashboardBarChart = () => {

    const [s1, setS1] = useState([])
    const dekanat = useSelector(state => state?.dekanat?.dekanat)
    const educationYear = useSelector(state => state?.educationYear?.educationYear)
    const {headers} = getHeaders()
    const [allgroup, setAllgroup] = useState([])
    const [valueTabs, setValueTabs] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const handleChangeSelectInput = (event) => {
        setStep(event.target.value);
    };
    const handleChange = (event, newValue) => {
        setValueTabs(newValue);
    };

    function pres(a, b) {
        if (!a || !b) return 0
        return Math.ceil(b * 100 / a)
    }

    function pres2(a) {
        return 100 - a
    }

    useEffect(() => {
        axios.get(BASE_URL + DEKAN.GET_GROUP_STATISTICS + `?endTime=${moment(new Date()).format("yyyy.MM.DD")} 23%3A59&&startTime=${moment(new Date()).format("yyyy.MM.DD")} 00%3A00`, {headers})
            .then(res => {

                setAllgroup(res.data?.reduce((acc, {name, allCount, comeCount, level}) => {
                    const title = name.split("-")[0];
                    const existingGroup = acc.find((item) => item.title === title);

                    if (existingGroup) {
                        existingGroup.groups.push({name, allCount, comeCount, level});
                    } else {
                        acc.push({
                            title,
                            groups: [{name, allCount, comeCount, level}],
                        });
                    }

                    return acc;
                }, []))

            })
            .catch(err => {
                console.log(err)
            })
    }, [])


    function TabPanel(props) {
        const {children, value, index, ...other} = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{p: 0}}>
                        <div>{children}</div>
                    </Box>
                )}
            </div>
        );
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }


    let steps = [5, 10, 20, 30, 40, 50];
    const [step, setStep] = useState(steps[0]);

    let days = [1, 2, 3, 4, 5]
    const [objWeek, setObjWeek] = useState({
        date: new Date(),
        dateFrom: moment().startOf('isoWeek').toDate(),
        dateTo: moment().endOf('isoWeek').toDate(),
        weekNumber: moment().isoWeek(),
        weekDay: moment().day()
    });


    const [levelStatistics, setLevelStatistics] = useState([]);
    const [levelTimeTable, setLevelTimeTable] = useState([]);

    useEffect(() => {
        setS1([])
        setIsLoading(true)
        allgroup?.length > 0 && dekanat && educationYear && axios.get(`${BASE_URL}/timeTableByWeekOfYear/studentStatisticsWithWeekOfEduYear/${educationYear?.id}?facultyId=${dekanat?.faculties?.find(faculty => faculty?.shortName === allgroup?.[valueTabs]?.title?.substring(0, 3))?.id}&facultyShortName=${dekanat?.faculties?.find(faculty => faculty?.shortName === allgroup?.[valueTabs]?.title?.substring(0, 3))?.shortName}&eduType=${dekanat?.eduType?.name}&eduTypeId=${dekanat?.eduType?.id}`)
            .then(res => {
                setLevelStatistics(
                    res?.data?.obj?.map(item => {
                        let arr3 = [];
                        item?.map(child => {

                            days.map(day => {
                                child?.sortNumber === objWeek?.weekNumber ?
                                    day <= objWeek?.weekDay && arr3.push(child?.[day]?.statistics?.map(statistic => ({
                                        ...statistic,
                                        day,
                                        week: child?.sortNumber
                                    })))
                                    :
                                    arr3.push(child?.[day]?.statistics?.map(statistic => ({
                                        ...statistic,
                                        day,
                                        week: child?.sortNumber
                                    })))
                            })


                        })

                        return Object.values(groupObjectsByFullName(arr3?.flat()));
                    })
                )

                setLevelTimeTable(
                    res?.data?.secondObj?.map(timeTable => (
                            timeTable?.map(tableChild => ({
                                ...tableChild,
                                count: Object.values(groupObjectsByCount(tableChild?.count))
                            }))
                        )
                    )
                )

                res?.data?.obj?.map(item1 => {
                    item1.map(item => {
                        item?.sortNumber === objWeek?.weekNumber ?
                            days.map(day => {
                                day <= objWeek?.weekDay && setS1(prevState => [...prevState, ...item?.[day]?.statistics])
                            })
                            :
                            days.map(day => {
                                setS1(prevState => [...prevState, ...item?.[day]?.statistics])
                            })
                    })

                })
                setIsLoading(false)
            })
            .catch(err => {
                setIsLoading(false)
                console.log(err)
            })
    }, [educationYear, valueTabs, allgroup])


    function groupObjectsByLevel(arr) {
        return arr.reduce((groupedObjects, obj) => {
            const name = obj?.level;

            if (groupedObjects[name]) {
                groupedObjects[name].push(obj);
            } else {
                groupedObjects[name] = [obj];
            }

            return groupedObjects;
        }, {});
    }

    function groupObjectsByCount(arr) {
        return arr.reduce((groupedObjects, obj) => {
            const name = obj;

            if (groupedObjects[name]) {
                groupedObjects[name].push(obj);
            } else {
                groupedObjects[name] = [obj];
            }

            return groupedObjects;
        }, {});
    }

    function groupObjectsByFullName(arr) {

        return arr.reduce((groupedObjects, obj) => {
            const name = obj?.fullName;

            if (groupedObjects[name]) {
                groupedObjects[name].push(obj);
            } else {
                groupedObjects[name] = [obj];
            }

            return groupedObjects;
        }, {});


    }


    useEffect(() => {
        console.log(Object.values(groupObjectsByLevel(s1)))

    }, [valueTabs])

    const exportToExcel = (data) => {
        if (!data || data.length === 0) {
            console.error('No data to export.');
            return;
        }
        const sortedData = data.sort((a, b) =>
            a.name.toUpperCase().localeCompare(b.name.toUpperCase())
        );

        const headerRow = ['№', 'Group Name', 'All Students', 'Students Came', 'Percent', 'Level', `${moment().format('DD.MM.YYYY HH:mm')}`];

        const sheetData = [headerRow, ...sortedData.map((item, index) => [
            index + 1,
            item.name,
            item.allCount,
            item.comeCount || 0,
            pres(item.allCount, item.comeCount || 0),
            item.level,
        ])];

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'GroupData');
        const fileName = `${sortedData[0].name.substring(0, sortedData[0].name.indexOf('-'))}-groups.xlsx`;
        XLSX.writeFile(workbook, fileName);
    };

    return (
        <Container id={"chart"}>
            <div className='dekantabs'>
                <Tabs variant="scrollable"
                      scrollButtons
                      allowScrollButtonsMobile
                      value={valueTabs}
                      onChange={handleChange}
                      indicatorColor=""
                      aria-label="basic tabs example">

                    {allgroup?.map((item, key) => (
                        <Tab
                            component={tabsitem}
                            key={key}
                            label={item?.title} {...a11yProps(key)}/>
                    ))}
                </Tabs>
            </div>
            {allgroup?.map((item, key) => (
                <TabPanel value={valueTabs} index={key} key={key}>
                    <SelectBox>
                        <FormControl sx={{minWidth: 100}} size="small">
                            <InputLabel id="select-label">Size</InputLabel>
                            <Select
                                labelId="select-label"
                                id="select-small-size"
                                value={step}
                                label="Size"
                                onChange={handleChangeSelectInput}
                            >
                                {steps.map((item, index) => (
                                    <MenuItem key={index} value={item}>{item}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </SelectBox>

                    <Cardcore2>
                        {isLoading && Array.from({length: 4}).map((_, index) => (
                            <CardMain key={index}>
                                <TitleCard
                                    cl={(index === 0 && `${mainColor}`) || (index === 1 && `#FD8539`) || (index === 2 && `#2ED480`) || (index === 3 && `#FE6D8E`)}>{index + 1}-Course
                                </TitleCard>
                                <CardBody>
                                    <Box sx={{width: "100%"}}>
                                        <Skeleton/>
                                        <Skeleton animation="wave"/>
                                        <Skeleton animation={false}/>
                                    </Box>
                                </CardBody>
                            </CardMain>
                        ))}
                        {!isLoading && levelStatistics?.map((item, index) => (
                            <CardMain key={index}>
                                <TitleCard
                                    cl={(index === 0 && `${mainColor}`) || (index === 1 && `#FD8539`) || (index === 2 && `#2ED480`) || (index === 3 && `#FE6D8E`)}>{index + 1}-Course
                                </TitleCard>
                                <CardBody>
                                    {

                                        item.length > 0 ? item?.sort(function (o1, o2) {
                                            if (o1?.length < o2?.length) return 1;
                                            else if (o1?.length > o2?.length) return -1;
                                            else return 0;
                                        })?.map((student, i) => {
                                            let counter = 0;
                                            student?.map(s3 => {

                                                const nowWeek = moment().isoWeek()
                                                const nowDay = moment().format('DD')

                                                if (nowWeek > s3.week && Number(nowDay) > s3.day) {
                                                    if (levelTimeTable?.[index]?.find(t => t?.week === s3?.week && t.groupName === s3?.groupName)?.count?.[s3?.day - 1]?.length) {
                                                        counter += levelTimeTable?.[index]?.find(t => t?.week === s3?.week && t?.groupName === s3?.groupName)?.count?.[s3?.day - 1]?.length
                                                    }
                                                }

                                            })

                                            return {...student, counter}
                                        })?.sort(function (o1, o2) {
                                            if (o1?.counter < o2?.counter) return 1;
                                            else if (o1?.counter > o2?.counter) return -1;
                                            else return 0;
                                        })?.map((student, i) => {

                                                return i < step && <CardBodyItem key={i}>
                                                    <AvatarBox>
                                                        <img style={{width: "100%"}}
                                                             src={student?.avatarimg ? student?.avatarimg : NoImg}
                                                             alt="avatar"/>
                                                    </AvatarBox>
                                                    <StudentInfo>
                                                        <h6>
                                                            {student?.[0]?.fullName}
                                                        </h6>
                                                        <p>
                                                            {student?.[0]?.groupName}
                                                        </p>
                                                    </StudentInfo>
                                                    <Nbbox>
                                                        {
                                                            student?.counter
                                                        }
                                                    </Nbbox>
                                                </CardBodyItem>

                                            }
                                        ) : <Box>
                                            <EmptyDataImg w={150} h={130}/>
                                        </Box>}

                                </CardBody>
                            </CardMain>
                        ))}

                    </Cardcore2>

                    <Cardcore>
                        {item.groups?.sort((a, b) => {
                            const nameA = a.name.toUpperCase();
                            const nameB = b.name.toUpperCase();

                            if (nameA < nameB) {
                                return -1;
                            }
                            if (nameA > nameB) {
                                return 1;
                            }
                            return 0;
                        })?.map((item, key) => (
                            <Carditem key={key}>
                                <Rigthbox>
                                    <Titlecard>
                                        <FaLayerGroup/> {item.name}
                                    </Titlecard>
                                    <Numberbox>
                                        <Numstudent color={'#9cd365'}>{item.allCount}</Numstudent>
                                        <Numstudent
                                            color={mainColor}>{pres(item.allCount, item.comeCount)}%</Numstudent>
                                    </Numberbox>
                                    <Progres>
                                        <Tooltip title={`kelgan:${item.comeCount}`}>
                                            <Progresitem bgcolor={mainColor}
                                                         width={`${pres(item.allCount, item.comeCount)}%`}/>
                                        </Tooltip>
                                        <Tooltip title={`kelmagan:${item.allCount - item.comeCount}`}>
                                            <Progresitem bgcolor={"red"}
                                                         width={`${pres2(pres(item.allCount, item.comeCount))}%`}/>
                                        </Tooltip>
                                    </Progres>
                                </Rigthbox>
                            </Carditem>
                        ))}
                    </Cardcore>
                    <Box display={'flex'} justifyContent={'end'} marginY={2}>
                        <Button variant={'contained'} onClick={() => exportToExcel(item.groups)}>export to
                            excel</Button>
                    </Box>
                </TabPanel>
            ))
            }
        </Container>
    );
};


const SelectBox = styled.div`
    display: flex;
    justify-content: end;
    margin-bottom: 20px;
`

const Nbbox = styled.div`
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    background-color: red;
    color: white;
    border-radius: 50%;
`
const StudentInfo = styled.div`
    h6 {
        font-size: 11px;
        font-weight: bold;
        color: #000000;
    }

    p {
        font-size: 10px;
        font-weight: normal;
        color: silver;
    }

`
const AvatarBox = styled.div`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin: 0 auto;

`
const CardBodyItem = styled.div`
    margin-top: 15px;
    display: grid;
    grid-template-columns: 0.2fr 1fr 0.2fr;
    align-items: center;
    gap: 5px;

`
const CardBody = styled.div`
    margin-top: 20px;

    h5 {
        text-align: center;
    }
`;

const TitleCard = styled.p`
    font-size: 15px;
    font-weight: bold;
    color: ${props => props.cl};
`

const CardMain = styled.div`
    border-radius: 8px;
    background-color: #fff;
    padding: 10px;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`


const tabsitem = styled.div`
    font-size: 13px;
    width: 200px !important;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 8px !important;;
    color: ${mainColor};
    padding: 5px 20px !important;
    height: 42px !important;
    margin: 5px !important;
    box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;

    &:hover {
        color: #ffffff !important;
        background-color: #5093f1 !important;
    }

    &.Mui-selected {
        color: #ffffff !important;
        background-color: #5093f1 !important;
    }
`;


const Progresitem = styled.div`
    width: ${props => props.width};
    height: 100%;
    background-color: ${props => props.bgcolor};
`
const Progres = styled.div`
    display: flex;
    width: 100%;
    overflow: hidden;
    height: 8.5px;
    border-radius: 5px;
`

const Numstudent = styled.h6`
    display: flex;
    align-items: center;
    gap: 5px;
    color: ${props => props.color};
`
const Numberbox = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`
const Titlecard = styled.h6`
    font-size: 14px;
`
const Rigthbox = styled.div`
    width: 100%;
`


const Carditem = styled.div`
    width: 100%;
    padding: 10px;
    background-color: #fff;
    display: flex;
    align-items: center;
    margin: 0 auto;
    gap: 10px;
    border-radius: 5px;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    cursor: pointer;
    transition: 0.06s;

    &:hover {
        transform: scale(1.05);
    }
`

const Cardcore2 = styled.div`
    width: 100%;
    min-width: 300px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 40px;
    ${small({
        gridTemplateColumns: "auto auto",
    })}
    ${extrasmall({
        gridTemplateColumns: "auto",
    })}
`

const Cardcore = styled.div`
    width: 100%;
    min-width: 300px;
    display: grid;
    grid-template-columns: auto auto auto auto;
    gap: 40px;
    ${small({
        gridTemplateColumns: "auto auto",
    })}
    ${extrasmall({
        gridTemplateColumns: "auto",
    })}
`

const Container = styled.div`
    width: 100%;
    margin-top: 10px;
    color: ${mainColor};
`;

export default DashboardBarChart;