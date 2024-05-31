import React, {memo, useEffect, useState} from 'react';
import axios from "axios";
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import styled from "styled-components";
import {Card, CardContent} from "@mui/material";
import Typography from "@mui/material/Typography";
import {FaUserGraduate, FaUsers, FaUserTie} from "react-icons/fa";
import {ImUserTie} from "react-icons/im";
import Box from "@mui/material/Box";
import {extrasmall, small, xxlarge} from "../../../responsiv";

const UserInfoDataCard = () => {
    const [data, setData] = useState([])
    const [load, setLoad] = useState(false)
    const getData = async () => {
        setLoad(true)
        await axios.get(`${BASE_URL}/admin/getInformationAboutCountOfUsers`, getHeaders())
            .then(res => {
                const resData = res.data.obj
                const totalCount = resData.reduce((acc, curr) => acc + curr.counts, 0);
                console.log(totalCount)
                setData([...resData, {sections: 'USERS', counts: totalCount}])
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setLoad(false)
            })
    }
    useEffect(() => {
        getData()
    }, []);
    return (
        <BoxCard>
            {data?.length > 0 && data.map((item, index) => (
                <Card key={index} sx={{overflow:'visible'}}>
                    <CardContent>
                        <Box>
                            <Box sx={{display: 'flex', justifyContent: 'start'}}>
                                <Box sx={{
                                    bgcolor:'#deedf4',
                                    p:1.5,
                                    mt:-3,
                                    borderRadius:1,
                                }}>
                                    {item.sections === 'STUDENTS' && <FaUserGraduate size={25} color={mainColor}/>}
                                    {item.sections === 'STUFFS' && <FaUserTie size={25} color={mainColor}/>}
                                    {item.sections === 'TEACHERS' && <FaUserTie size={25} color={mainColor}/>}
                                    {item.sections === 'USERS' && <FaUsers size={25} color={mainColor} />}
                                </Box>

                            </Box>
                            <Box sx={{display: 'flex', justifyContent: 'space-between',mt:3}}>
                                <Typography fontWeight={'bold'} color={mainColor}>{item.sections}: </Typography>
                                <Typography fontWeight={'bold'}  color={'#3c3c7c'}>{item.counts}</Typography>
                            </Box>

                        </Box>
                    </CardContent>
                </Card>
            ))}
        </BoxCard>
    );
};

const BoxCard = styled.div`
    margin: 20px 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30px;
    ${small({
        gridTemplateColumns:'repeat(2,1fr)'
    })}
 ${extrasmall({
        gridTemplateColumns:'repeat(2,1fr)'
    })}

`

export default memo(UserInfoDataCard);