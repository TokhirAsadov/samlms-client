import React, {memo} from 'react';
import {Card, CardContent} from "@mui/material";
import PdfNotice from "../../../utills/pdfFiles/PdfNotice";
import moment from "moment";
import Box from "@mui/material/Box";
import EmptyDataImg from "../../emptyDataImg/EmptyDataImg";
import Typography from "@mui/material/Typography";
import {mainColor} from "../../../utills/ServiceUrls";
import {extrasmall, large, medium, small} from "../../../responsiv";
import styled from "styled-components";

const NoticeForStudent = ({data, studentData}) => {

    return (
        <Box sx={{mt: 3}}>
            {data ? (
                <CardBox>
                    {data?.map((item, index) => (
                        <Card sx={{width: '100%'}}  key={index}>
                            <CardContent>
                                <Typography
                                    fontSize={20}
                                    textAlign={'center'}
                                    fontWeight={'bold'}
                                    color={mainColor}
                                >
                                    Xabarnoma
                                </Typography>
                                <Typography
                                    sx={{mt: 1}}
                                    textAlign={'center'}
                                    fontWeight={'bold'}
                                >
                                    {item?.educationYear}
                                </Typography>
                                <Typography sx={{mt: 1}}>
                                    Form Date: <b>{moment(item?.fromDate).format('DD.MM.YYYY')}</b>
                                </Typography>
                                <Typography sx={{mt: 1}}>
                                    To date: <b>{moment(item?.toDate).format('DD.MM.YYYY')}</b>
                                </Typography>
                                <Box
                                    sx={{mt: 2, display: 'flex', justifyContent: 'center'}}
                                >
                                    <PdfNotice
                                        noticeData={item}
                                        studentData={studentData}/>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </CardBox>
            ) : (<Card>
                <CardContent>
                    <Typography
                        fontSize={20}
                        textAlign={'start'}
                        fontWeight={'bold'}
                        color={mainColor}
                    >
                        Xabarnoma
                    </Typography>
                    <EmptyDataImg w={200} h={180}/>
                </CardContent>
            </Card>)
            }
        </Box>
    );
};
const CardBox = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30px;
    ${large({
        gridTemplateColumns:'repeat(3,1fr)',
    })}
    ${medium({
        gridTemplateColumns:'repeat(3,1fr)',
    })}
 ${small({
        gridTemplateColumns:'repeat(2,1fr)',
    })}
${extrasmall({
        gridTemplateColumns:'repeat(1,1fr)',
    })}
    
`;

export default memo(NoticeForStudent);