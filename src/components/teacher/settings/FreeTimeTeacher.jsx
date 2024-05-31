import React, {memo, useEffect, useState} from 'react';
import {Card, CardContent, Skeleton} from "@mui/material";
import {green} from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import styled from "styled-components";
import ModalAddFreeTime from "./ModalAddFreeTime";
import axios from "axios";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import {useSelector} from "react-redux";
import EmptyDataImg from "../../emptyDataImg/EmptyDataImg";
import {FaRegCalendar} from "react-icons/fa6";
import IconButton from "@mui/material/IconButton";
import {extrasmall, medium, small} from "../../../responsiv";
import {FaRegClock} from "react-icons/fa";
import {MdDelete} from "react-icons/md";
import {toast} from "react-toastify";

const FreeTimeTeacher = ({modalAdd, setModalAdd}) => {

    const {headers} = getHeaders()

    const teacherId = useSelector(state => state.teacher?.teacher.id)
    const [dataHour, setDataHour] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const getTeachersFreeHours = (id) => {
        setIsLoading(true)
        axios.get(`${BASE_URL}/teachersFreeHours/getAllHoursByTeacherId/${id}`, {headers})
            .then(res => {
                const data = res.data.obj;
                const groupedData = data?.reduce((acc, current) => {
                    const existingGroup = acc?.find(group => group[0]?.day === current?.day);
                    if (existingGroup) {
                        existingGroup.push(current);
                    } else {
                        acc.push([current]);
                    }
                    return acc;
                }, []);
                setDataHour(groupedData)
            })
            .catch(err => {
                console.log(err)
                setDataHour([])
            })
            .finally(() => {
                setIsLoading(false)
            })
    }
    const handleClickDeleteTime = (id) => {
        axios.delete(`${BASE_URL}/teachersFreeHours/delete/${id}`, {headers})
            .then(res=>{
                getTeachersFreeHours(teacherId)
                toast.warning('Delete time')
            })
            .catch(err => {
                toast.error('Error deleting time')
            })
    };

    const handleClose = () => {
        setModalAdd(false);
    };



    useEffect(() => {
        getTeachersFreeHours(teacherId)
    }, []);


    return (
        <Box>
            <BoxCardContent>
                {isLoading ? (
                    Array.from({length: 4}).map((sk, index) => (
                        <Skeleton key={index} variant="rectangular" width={'100%'} height={80}/>
                    ))
                ) : dataHour.length !== 0 && (
                    dataHour.map((item, index) => (
                        <Card key={index}>
                            <CardContent>
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center'}}>
                                    <Typography color={green[600]} fontWeight={'bold'}> <FaRegCalendar
                                        size={18}/></Typography>
                                    <Typography color={green[600]} fontWeight={'bold'}
                                                fontSize={14}>{item[0].day}</Typography>
                                </Box>
                                <Box sx={{display: 'flex', flexDirection: 'column', gap: '10px', mt: '8px'}}>
                                    {
                                        item.map(i2 => (
                                            <Box key={i2} sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                border: 1,
                                                borderColor: 'grey.500',
                                                borderRadius: 1,
                                                p: 0.5
                                            }}>
                                                <Box display={'flex'} alignItems={'center'} gap={0.5}>
                                                    <FaRegClock size={20}/>
                                                    <Typography fontSize={'14px'}>{i2.schedule}</Typography>
                                                </Box>
                                                <IconButton
                                                    onClick={() => handleClickDeleteTime(i2?.id)}
                                                    size="small"
                                                >
                                                    <MdDelete/>
                                                </IconButton>
                                            </Box>
                                        ))
                                    }
                                </Box>
                            </CardContent>
                        </Card>
                    ))
                )}
            </BoxCardContent>
            {dataHour.length === 0 && (
                <EmptyDataImg w={200} h={180}/>
            )}
            <ModalAddFreeTime getData={() => getTeachersFreeHours(teacherId)} open={modalAdd}
                              handleClose={handleClose}/>
        </Box>
    );
};

const BoxCardContent = styled.div`
    margin-top: 15px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    ${medium({
        gridTemplateColumns: 'repeat(3, 1fr)',
    })} ${small({
        gridTemplateColumns: 'repeat(2, 1fr)',
    })}
    ${extrasmall({
        gridTemplateColumns: 'repeat(1, 1fr)',
    })}
`;
export default memo(FreeTimeTeacher);