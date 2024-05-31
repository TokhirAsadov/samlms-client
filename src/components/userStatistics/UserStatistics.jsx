import React, {memo, useEffect, useState} from 'react';
import moment from "moment";
import styled from "styled-components";
import {BASE_URL, getHeaders, mainColor} from "../../utills/ServiceUrls";
import Button from "@mui/material/Button"
import {GrFormNext, GrFormPrevious} from "react-icons/gr";
import axios from "axios";
import Box from "@mui/material/Box";
import {Skeleton} from "@mui/material";
import {RiCloseLine} from "react-icons/ri";
import Modal from "@mui/material/Modal";
import EnterAndOutTimesOfTeacher from "./EnterAndOutTimesOfTeacher";
import {extrasmall, medium, small} from "../../responsiv";
import NoImage from '../../utills/images/no-picture.jpg'
import {FaCircleCheck, FaCircleXmark} from "react-icons/fa6";
import Avatar from "@mui/material/Avatar";

const UserStatistics = ({userName, userId, date, photo, forUser}) => {

    const [time, setTime] = useState(date);
    const [days, setDays] = useState([]);

    const [data, setData] = useState(null);
    const [getItems, setGetItems] = useState(false);

    const [timeModal, setTimeModal] = useState(null);
    const [timeModalItem, setTimeModalItem] = useState(null);
    const [open, setOpen] = useState(false);
    const handleOpen = (item) => {
        setTimeModal(new Date(time.getFullYear(), time.getMonth(), item))
        setTimeModalItem(data[item]);
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }

    const {headers} = getHeaders();

    const getDay = (date) => {
        return date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate()
    }



    const prevMonth = () => {
        setGetItems(false);
        setTime(new Date(time.getFullYear(), time.getMonth() - 1))
    }

    const nextMonth = () => {
        setGetItems(false);
        setTime(new Date(time.getFullYear(), time.getMonth() + 1))
    }

    useEffect(() => {
        setDays(() => Array.from(Array(moment(time).daysInMonth()).keys()).map(i => i + 1))
        getData();
    }, [time])

    const counter = () => {
        let count = 0;
        data && days?.map(item => {
            if (data[item] != null) {
                count++;
            }
        })
        return count;
    }

    const getData = async () => {
        // console.log(getDay(time), "axios")
        await axios.get(`${BASE_URL}/kafera-mudiri/getStatisticss?userId=${userId}&date=${getDay(time)}`, {headers})
            .then(res => {
                setData(res?.data?.obj);
                setGetItems(true);
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <>
            <Container>
                <ImageWrapper>
                        <Avatar
                            component={Imgbox}
                            src={BASE_URL + "/attachment/download/" + photo}
                            alt={userName}
                            sx={{ width: 70, height: 70 }}
                        />
                    <UserName>{userName}</UserName>
                </ImageWrapper>
                <hr/>
                <Wrapper>
                    <Month>
                        <Button style={buttonStyles} onClick={prevMonth}><GrFormPrevious/></Button>
                        <input type="month" id="start" name="start"
                               min="2022-04"
                               value={moment(time).format("YYYY-MM")}
                               onChange={e => setTime(new Date(e.target.value))}
                               style={monthInput}
                        />
                        <Button style={buttonStyles} onClick={nextMonth}><GrFormNext/></Button>
                    </Month>
                    {
                        getItems ?
                            <Tablebox>
                                <WrapperDay>
                                    {
                                        days?.map(item => {
                                            return <Day key={item}>
                                                <NumberDay>
                                                    {item}
                                                    <WeekDay>{moment(new Date(time.getFullYear(), time.getMonth(), item)).format("ddd")}</WeekDay>
                                                </NumberDay>
                                                <StatisticBox  onClick={() => handleOpen(item)}>
                                                    {
                                                        new Date(time.getFullYear(), time.getMonth(), item) <= new Date() ?
                                                            data[item] ? <FaCircleCheck color={'green'}/> : <FaCircleXmark color={'red'} /> : ""
                                                    }
                                                </StatisticBox>
                                            </Day>
                                        })
                                    }
                                    <Day>
                                        <NumberDay>
                                            {'\u2211'}
                                        </NumberDay>
                                        <StatisticBox  bg={counter() !== 0 ? "green" : "red"}>
                                            {counter()}
                                        </StatisticBox>
                                    </Day>
                                </WrapperDay>
                            </Tablebox>
                            : <Skeleton animation="wave" width={"100%"} height={120}/>
                    }
                </Wrapper>

                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="keep-mounted-modal-title"
                    aria-describedby="keep-mounted-modal-description"
                >
                    <Box sx={styleTable} component={Stylemodal}>
                        <CloseMyButtonForChild onClick={handleClose}><RiCloseLine/></CloseMyButtonForChild>
                        <EnterAndOutTimesOfTeacher time={timeModal} item={timeModalItem}/>
                    </Box>
                </Modal>

            </Container>
        </>
    );
};

const CloseMyButtonForChild = styled.button`
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    color: ${mainColor};
    font-size: 26px;
    border: none;
    position: absolute;
    top: 10px;
    right: 10px;
`;
const Imgbox = styled.div`
    ${extrasmall({
        width: "60px !important",
        height: "60px !important"
    })}
`
const UserName = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    color: ${mainColor};
    ${extrasmall({
        fontSize: 15,
    })}
`

const ImageWrapper = styled.div`
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
`;

const StatisticBox = styled.button`
    width: 100%;
    min-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
    border: 1px solid ${mainColor};
    color: #fff;
    background-color: ${props => props.bg ? props.bg : "#fff"};
    transition: 0.1s all ease-in;
    cursor: pointer;

    &:hover {
        filter: brightness(.7);
    }

    &:focus {
        transform: scale(0.95);
    }
`;
const Tablebox = styled.div`
    width: 100%;
    overflow-x: scroll;
`
const WeekDay = styled.span`
    font-size: 12px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const NumberDay = styled.div`
    width: 100%;
    min-height: 40px;
    border: 1px solid ${mainColor};
    display: flex;
    align-items: center;
    flex-direction: column;
`;

const Day = styled.div`
    width: 50px;
    height: 80px;
    display: flex;
    flex-direction: column;
`;

const WrapperDay = styled.div`
    display: flex;
    width: 1200px;
    //justify-content: center;
    margin: 30px auto;
`;

const Month = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-size: 24px;
`;

const Wrapper = styled.div`
    width: 100%;
    margin-top: 20px !important;
`

const Container = styled.div`
    width: 100% !important;
`;

const buttonStyles = {
    width: "40px!important",
    height: "40px!important",
    fontSize: "24px",
}

const monthInput = {
    border: "none",
    background: "transparent"
}

const styleTable = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "50vw",
    minHeight: "50vh",
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 3,
    p: 4,
};

const Stylemodal = styled.div`
    ${medium({
        width: "70vw !important",
    })}
    ${small({
        width: "70vw !important",
    })}
    ${extrasmall({
        width: "90vw !important",
        minHeight: "70vh !important",
    })}
`
export default memo(UserStatistics);