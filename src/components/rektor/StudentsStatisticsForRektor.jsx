import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import axios from "axios";
import {BASE_URL, getHeaders, mainColor} from "../../utills/ServiceUrls";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {extrasmall, small} from "../../responsiv";
import PropTypes from "prop-types";
import Skeleton from "@mui/material/Skeleton";
import NoImg from "../../utills/images/no-picture.jpg";
import moment from "moment/moment";
import {fetchEducationYear} from "../../redux/actions/educationYear/education_year_actions";
import {useDispatch, useSelector} from "react-redux";
import EmptyDataImg from "../emptyDataImg/EmptyDataImg";

const StudentsStatisticsForRektor = () => {
    const [allData, setAllData] = useState([])
    const [dean, setDean] = useState("");
    const [deanData, setdeanData] = useState({})
    const [allDeans, setAllDeans] = useState([])
    const [allGroups, setAllGroups] = useState([])
    const [valueTabs, setValueTabs] = useState(0);
    const [levelStatistics, setLevelStatistics] = useState([]);
    const [levelTimeTable, setLevelTimeTable] = useState([]);
    const [s1, setS1] = useState([])
    const educationYear = useSelector(state => state?.educationYear?.educationYear)
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setError] = useState(false);
    const {headers} = getHeaders();
    const dispatch = useDispatch()

    const emptyState = [1, 2, 3, 4]
    let days = [1, 2, 3, 4, 5]
    const [objWeek, setObjWeek] = useState({
        date: new Date(),
        dateFrom: moment().startOf('isoWeek').toDate(),
        dateTo: moment().endOf('isoWeek').toDate(),
        weekNumber: moment().isoWeek(),
        weekDay: moment().day()
    });
    const fetchEducationYears = async () => {
        await axios.get(BASE_URL + '/education/educationYearsForSelected', {headers})
            .then(res => {
                dispatch(fetchEducationYear(res?.data?.obj?.[0]))
            })
            .catch(err => {
                console.log(err);
            })
    }
    const handleChange = (event) => {
        setDean(event.target.value);
    };
    const handleChangeTab = (event, newValue) => {
        setValueTabs(newValue);
    };

    useEffect(() => {
        axios.get(BASE_URL + "/dekanat/all", headers)
            .then(res => {
                setAllData(res.data.obj);
                setAllDeans(res.data.obj?.map(item => item.name))
                setDean(res.data.obj[0].name)
            })
            .catch(e => console.log(e))
    }, [])


    useEffect(() => {
        fetchEducationYears()
    }, [])

    useEffect(() => {
        setS1([])
        setIsLoading(true)
        allGroups?.length > 0 && educationYear && axios.get(`${BASE_URL}/timeTableByWeekOfYear/studentStatisticsWithWeekOfEduYear/${educationYear?.id}?facultyId=${allGroups[valueTabs].id}&facultyShortName=${allGroups[valueTabs].shortName}&eduType=${deanData?.eduType?.name}&eduTypeId=${deanData?.eduType?.id}`)
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
                setError(true)
                console.log(err)
            })
    }, [educationYear, valueTabs, allGroups])

    useEffect(() => {
        setAllGroups(allData.find(item => item.name === dean)?.faculties || [])

        setdeanData(allData.find(item => item.name === dean))
        console.log(allData.find(item => item.name === dean), 'allll deeean')
    }, [dean]);

    useEffect(() => {
        console.log(allGroups)
    }, [allGroups])

    let steps = [5, 10, 20, 30, 40, 50];
    const [step, setStep] = useState(steps[0]);
    const handleChangeSelectInput = (event) => {
        setStep(event.target.value);
    };


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


    /********tabs****************/
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


    return (
        <Container>
            <FormControl sx={{width: "200px", m: 2}}>
                <InputLabel id="demo-simple-select-label">Dean</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={dean}
                    label="Dean"
                    onChange={handleChange}
                >
                    {allDeans.map((item, key) => (
                        <MenuItem value={item} key={key}>{item}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <div className='dekantabs'>
                <Tabs variant="scrollable"
                      scrollButtons
                      allowScrollButtonsMobile
                      value={valueTabs}
                      onChange={handleChangeTab}
                      indicatorColor=""
                      aria-label="basic tabs example">

                    {allGroups?.map((item, key) => (
                        <Tab
                            component={tabsitem}
                            key={key}
                            label={item?.shortName} {...a11yProps(key)}/>
                    ))}
                </Tabs>
            </div>

            {allGroups?.map((item, key) => (
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
                        {!isLoading && levelStatistics ? levelStatistics?.map((item, index) => (
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
                                                    <NbBox>
                                                        {
                                                            student?.counter
                                                        }
                                                    </NbBox>
                                                </CardBodyItem>

                                            }
                                        ) : <Box>
                                            <EmptyDataImg w={150} h={130}/>
                                        </Box>}

                                </CardBody>
                            </CardMain>
                        )) : (
                            !isLoading && emptyState.map((item, i) => (
                                <CardMain>
                                    <TitleCard
                                        cl={(i === 0 && `${mainColor}`) || (i === 1 && `#FD8539`) || (i === 2 && `#2ED480`) || (i === 3 && `#FE6D8E`)}>{i + 1}-Course</TitleCard>
                                    <CardBody>
                                        <h5>No data Students</h5>
                                    </CardBody>
                                </CardMain>
                            ))
                        )}

                    </Cardcore2>

                </TabPanel>
            ))
            }
        </Container>
    );
};

const NbBox = styled.div`
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
        margin: 30px 0;
        color: ${mainColor};
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


const SelectBox = styled.div`
    display: flex;
    justify-content: end;
    margin: 20px 0;
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

const Container = styled.div`
    width: 100%;
    padding: 10px;

`
export default StudentsStatisticsForRektor;
