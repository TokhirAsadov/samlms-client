import React, {useCallback, useMemo, useState} from 'react';
import styled from "styled-components";
import "./statisticsedustyle.css"
import moment from "moment";
import {extrasmall, medium, small} from "../../../responsiv";
import {mainColor} from "../../../utills/ServiceUrls";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import {RiCloseLine} from "react-icons/ri";
import ModalSelectDay from "./ModalSelectDay";
import Button from "@mui/material/Button";
import {IoSave} from "react-icons/io5";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const TableEduMaster = () => {
    const yearsDAta = [2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]
    const [NowDate, setNowDate] = useState(+moment(new Date()).format("YYYY"))
    const [open, setOpen] = useState(false);
    const [mouseHandler, setMouseHandler] = useState(false)
    const [allData, setAllData] = useState([])
    const handleOpen = (data) => {
        setAllData([data])
        setOpen(true)
    };

    const handleChange = (event) => {
        setNowDate(event.target.value);
    };
    const handleClose = () => {
        setAllData([])
        setOpen(false)
    };
    const monthdata = []
    const courseLevel = [1, 2,]
    const getMonthData = useCallback((year, month) => {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const firstDay = new Date(year, month - 1, 1).getDay();
        const lastDate = new Date(year, month, 0).getDate();
        const monthName = monthNames[month - 1];
        const MonDay = [];
        const FriDay = [];
        let weekCount = 0;

        for (let date = 1; date <= lastDate; date++) {
            const day = new Date(year, month - 1, date).getDay();

            if (day === 1) {
                MonDay.push(date);
            } else if (day === 5) {
                FriDay.push(date);
            }

            if (day === firstDay && date !== 1) {
                weekCount++;
            }
        }

        if (lastDate === 28 && firstDay === 0) {
            weekCount = 4;
        } else if (lastDate === 31 && firstDay >= 5 && (MonDay.length < 5 || FriDay.length < 5)) {
            weekCount = 6;
        } else {
            weekCount = 5;
        }

        return {
            monthName,
            MonDay,
            FriDay,
            weeks: weekCount
        };
    }, [monthdata])

    for (let i = 9; i <= 12; i++) {
        monthdata.push(getMonthData(+NowDate, i))
    }
    for (let i = 1; i <= 8; i++) {
        monthdata.push(getMonthData(+NowDate + 1, i))
    }

    const weeks = []
    for (let i = 1; i <= 52; i++) {
        weeks.push(i)
    }


    const allweek = (yeardata) => {
        let mondaydata = [];
        let fridaydata = [];

        for (const year of yeardata) {
            mondaydata.push(...year.MonDay);
            fridaydata.push(...year.FriDay);
        }

        if (mondaydata.length !== 0 && mondaydata[0] > fridaydata[0]) {
            fridaydata.shift();
        }

        if (mondaydata.length !== fridaydata.length) {
            mondaydata.pop();
        }

        return {mondaydata, fridaydata};
    };

    const HandleDown = (e) => {
        setMouseHandler(true)
    }
    const HandleUp = (e) => {
        setMouseHandler(false)
        setOpen(true)
    }

    const HandleMove = useCallback((data) => {
        const exists = allData.some((item) => item?.weeksOrder === data?.weeksOrder && item.level == data.level);
        if (!exists) {
            setAllData((prevArray) => [...prevArray, data]);
        }
    }, [allData])

    const memoizedHandleMove = useMemo(() => HandleMove, [HandleMove]);


    return (
        <Container>
            <MainBox>
                <YearBox>
                    <FormControl sx={{width: "150px"}}>
                        <InputLabel id="demo-simple-select-label">Select year</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={NowDate}
                            label="Select year"
                            onChange={handleChange}
                        >
                            {yearsDAta.map((item, key) => (
                                <MenuItem value={item} key={key}>{item}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <p><b> {+NowDate}/{+NowDate + 1}</b> academic year</p>
                </YearBox>
                <TableScrollBox>
                    <TableBox>
                        <tbody>
                        <tr>
                            <th rowSpan='4'>
                                LEVEL
                            </th>
                            {monthdata.map((item, key) => (
                                <th key={key} colSpan={item.MonDay.length}>
                                    {item.monthName}
                                </th>
                            ))}
                        </tr>

                        <tr>
                            {
                                weeks.map((item, key) => {
                                    const day = allweek(monthdata).mondaydata[key]
                                    return <td key={key}>{day ? day : "-"}</td>
                                })
                            }
                        </tr>
                        <tr>

                            {
                                weeks.map((item, key) => {
                                    const day = allweek(monthdata).fridaydata[key]
                                    return <td key={key}>{day ? day : "-"}</td>
                                })
                            }
                        </tr>
                        <tr>
                            {weeks.map((item, key) => (
                                <td style={{fontWeight: "bold"}} key={key}>{item}</td>
                            ))}
                        </tr>


                        {courseLevel.map((level, key) => (
                            <tr key={key}>
                                <th>
                                    {level === 1 && "I"}
                                    {level === 2 && "II"}
                                    {level === 3 && "III"}
                                    {level === 4 && "IV"}
                                </th>
                                {
                                    weeks.map((item, key) => {

                                        const weekinfo = {
                                            weeksOrder: item,
                                            weekstart: allweek(monthdata).mondaydata[key],
                                            weekend: allweek(monthdata).fridaydata[key],
                                            level
                                        }
                                        return <td key={key}
                                                   className={`itemday ${allData.find(findItem => findItem.weeksOrder === item && findItem.level === weekinfo.level) ? "selected" : ""}`}
                                                   onClick={() => handleOpen(weekinfo)}
                                                   onMouseDown={HandleDown}
                                                   onMouseMove={() => {
                                                       if (mouseHandler) {
                                                           memoizedHandleMove(weekinfo)
                                                       }
                                                   }}
                                                   onMouseUp={HandleUp}
                                        >-</td>
                                    })
                                }
                            </tr>
                        ))}

                        </tbody>
                    </TableBox>
                </TableScrollBox>
                <BtnSaveData>
                    <Button variant="contained" endIcon={<IoSave/>}> Save table</Button>
                </BtnSaveData>
                <TableInfoItem>
                    <h6>Abbreviations:</h6>
                    <InfoItem>
                        <InfoBox bg={""}>
                            OW
                        </InfoBox>
                        <InfoBoxTitle>Orientation week</InfoBoxTitle>
                    </InfoItem>
                    <InfoItem>
                        <InfoBox bg={"#bbcbc7"}>
                            TE
                        </InfoBox>
                        <InfoBoxTitle>Theoretical education</InfoBoxTitle>
                    </InfoItem>
                    <InfoItem>
                        <InfoBox bg={mainColor}>
                            F
                        </InfoBox>
                        <InfoBoxTitle>Final exams</InfoBoxTitle>
                    </InfoItem>
                    <InfoItem>
                        <InfoBox bg={"#b28a8a"}>
                            V
                        </InfoBox>
                        <InfoBoxTitle>Vacation</InfoBoxTitle>
                    </InfoItem>
                    <InfoItem>
                        <InfoBox bg={"#00ffd3"}>
                            TE/PE
                        </InfoBox>
                        <InfoBoxTitle>Theoretical/Practical education</InfoBoxTitle>
                    </InfoItem>
                </TableInfoItem>
            </MainBox>

            {/* Modal select day */}

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box component={styledModal}>
                    <CloseButton onClick={handleClose}><RiCloseLine/></CloseButton>
                    <ModalSelectDay setOpen={setOpen} dateInfo={allData} setAllData={setAllData}/>
                </Box>
            </Modal>

        </Container>
    );
};

const BtnSaveData = styled.div`
    width: 100%;
    padding-top: 20px;
    display: flex;
    justify-content: end;
    ${extrasmall({
        justifyContent: "center",
    })}
`;

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #dcd7d7;
    border-radius: 50%;
    color: red;
    font-size: 26px;
    border: none;
    cursor: pointer;
    z-index: 1000;

`;
const styledModal = styled.div`
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    background-color: #FFFFFF;
    border-radius: 10px;
    ${extrasmall({
        width: "320px"
    })}
`

const InfoBoxTitle = styled.h6`
    font-size: 12px;
    font-weight: normal;
`
const InfoBox = styled.div`
    font-size: 10px;
    font-weight: bold;
    color: black;
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    border: 1px solid black;
    border-radius: 5px;
    background-color: ${props => props.bg || "#FFF"};
`
const InfoItem = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`
const TableInfoItem = styled.div`
    margin-top: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    gap: 20px;
    align-items: center;
    ${medium({
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr ",
    })}
    ${small({
        gridTemplateColumns: "1fr 1fr 1fr 1fr ",
    })}
    ${extrasmall({
        gridTemplateColumns: "1fr 1fr  ",
    })}
`
const YearBox = styled.div`
    margin: 20px;
    display: flex;
    gap: 30px;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    color: black;

    p {
        font-size: 17px;
    }

    ${extrasmall({
        justifyContent: "center"
    })}
`
const TableScrollBox = styled.div`
    width: 100%;
    overflow: scroll;
`
const TableBox = styled.table`
    width: 100%;
    border-collapse: collapse;
    border-radius: 5px;

    .selected {
        background-color: rgba(0, 0, 0, 0.3);
    }

    td, th {
        border: 1px solid black;
        border-collapse: collapse;
        text-align: center;
        padding: 8px;
        color: black;
    }

    th {
        color: #FFFFFF;
        background-color: ${mainColor};
    }

    .itemday {
        cursor: pointer;

        :hover {
            background-color: rgba(0, 0, 0, 0.3);
        }
    }

`
const MainBox = styled.div`
    width: 100%;
    background-color: #ffffff;
    min-height: 300px;
    border-radius: 5px;
    padding: 20px 10px;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`
const Container = styled.div`
    padding: 1rem;
    width: 100%;
`
export default TableEduMaster;