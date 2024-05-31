import React from 'react';
import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {MdClose} from "react-icons/md";
import moment from "moment";
import {BiCalendarAlt} from "react-icons/bi";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {mainColor} from "../../utills/ServiceUrls";
import EmptyDataImg from "../emptyDataImg/EmptyDataImg";
import {ClearNotificationData, deleteItemNotification} from "../../redux/actions/notification/notification_action";
import ButtonMui from "@mui/material/Button";
import {AiOutlineClear} from "react-icons/ai";

const Notification2 = ({closeNotification}) => {

    const notifications = useSelector(state => state?.notification?.notification) || [];
    const dispatch = useDispatch()
    const handleDelete = (id) => {
        dispatch(deleteItemNotification(id))
    }

    const handleClearNotification = () => {
        dispatch(ClearNotificationData())
    }

    return (
        <>
            <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
                <Typography color={mainColor} fontSize="20px" fontWeight='bold'>Notification </Typography>
                <IconButton onClick={closeNotification}>
                    <MdClose/>
                </IconButton>
            </Box>
            {notifications.length > 0 &&
                <Box sx={{
                    mb: 3,
                    display: 'flex',
                    justifyContent: 'end',
                }}
                >
                    <ButtonMui
                        onClick={handleClearNotification}
                        variant={'contained'}
                        color={'error'}
                        endIcon={<AiOutlineClear/>}
                        size={'small'}>clear</ButtonMui>
                </Box>}
            <NotificationContainer>
                {
                    notifications.length > 0 ? notifications?.map((notification, index) => (
                        <Container key={index}
                                   className={"container p-4 bg-blue-200 rounded-lg flex justify-between items-center relative"}>
                            <Content>
                                {notification?.content}
                            </Content>
                            <CloseItem
                                onClick={() => handleDelete(notification.id)}
                                className={"w-6 h-6 absolute top-1 right-1 bg-white rounded-full flex items-center justify-center text-xs text-red-500 hover:bg-red-500 hover:text-white cursor-pointer transition"}><MdClose/></CloseItem>
                            <TimeWrapper>
                                <Time>
                                    <BiCalendarAlt/>{moment(new Date(notification?.createdAt)).format("DD.MM.YYYY HH:mm:ss")}
                                </Time>
                            </TimeWrapper>
                        </Container>
                    )) : (
                        <EmptyDataImg w={180} h={160}/>
                    )
                }
            </NotificationContainer>
        </>
    );
};

const Time = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
`

const TimeWrapper = styled.div`
    width: 150px;
    height: 1.5rem;
    display: flex;
    align-items: end;
    justify-content: end;
    font-style: italic;
    //background-color: #f00;
    position: absolute;
    bottom: 0.25rem;
    right: 0.8rem;
    font-size: 10px
`
const Content = styled.div`
    font-size: 12px;
    margin: .5rem 0;
`

const CloseItem = styled.div`
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    line-height: 1rem;
    --tw-text-opacity: 1;
    color: rgb(239 68 68 / var(--tw-text-opacity));
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    --tw-bg-opacity: 1;
    background-color: rgb(255 255 255 / var(--tw-bg-opacity));
    border-radius: 9999px;
    cursor: pointer;
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;

    &:hover {
        background-color: red !important;
        color: white;
    }
`
const Button = styled.button`
    padding: 0.25rem 0.5rem;
    --tw-bg-opacity: 1;
    background-color: rgb(255 255 255 / var(--tw-bg-opacity));
    border-radius: 0.25rem;
    margin-right: 1rem;
    font-size: 11px;
`
const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    padding: 1rem;

    --tw-bg-opacity: 1;
    background-color: rgb(191 219 254 / var(--tw-bg-opacity));
    border-radius: 0.5rem;

    @media (min-width: 640px) {
        .container {
            max-width: 640px;
        }
    }
    @media (min-width: 768px) {
        .container {
            max-width: 768px;
        }
    }
    @media (min-width: 1024px) {
        .container {
            max-width: 1024px;
        }
    }
    @media (min-width: 1280px) {
        .container {
            max-width: 1280px;
        }
    }
    @media (min-width: 1536px) {
        .container {
            max-width: 1536px;
        }
    }
`

const NotificationContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`
export default Notification2;
