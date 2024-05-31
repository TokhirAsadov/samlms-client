import React from 'react';
import {Stack} from "@mui/material";
import Button from "@mui/material/Button";
import styled from "styled-components";
import {mainColor} from "../../../utills/ServiceUrls";
import EmptyDataImg from "../../emptyDataImg/EmptyDataImg";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import moment from "moment";

const OldData = ({dataOld, isLoadData}) => {


    return (
        <>
            <Bodybox>
                <table>
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Full Name</th>
                        <th>Group</th>
                        <th>Subject</th>
                        <th>Status</th>
                        <th>Deadline</th>
                    </tr>
                    </thead>
                    <tbody>
                    {!isLoadData && dataOld?.length > 0 && dataOld?.map((item, index) => (
                        <tr key={index}>
                            <td style={{textAlign: 'center'}}>{index + 1}</td>
                            <td className={'date_position'}>{item?.teacher?.fullName}
                                <span>{moment(item?.createdAt).format('DD.MM.YYYY HH:mm')}</span></td>
                            <td style={{textAlign: 'center'}}>{item?.subject?.name}</td>
                            <td style={{textAlign: 'center'}}>{item?.group?.name}</td>
                            <td>
                                <Stack direction="row" justifyContent="center">
                                    <Button
                                        color={item.status === 'CONFIRM' ? 'success' : (item.status === 'AT_PROCESS' ? 'primary' : 'error')}
                                        variant={'contained'}>{item.status}</Button>
                                </Stack>
                            </td>
                            <td style={{textAlign: 'center'}}>{item?.deadline && moment(item?.deadline).format('DD.MM.YYYY HH:mm')}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Bodybox>
            {isLoadData && <Box sx={{width: "100%"}}>
                <LinearProgress/>
            </Box>}
            {!isLoadData && dataOld?.length === 0 && <EmptyDataImg w={200} h={180}/>}
        </>
    );
};
const Bodybox = styled.div`
    margin-top: 25px;
    width: 100%;
    overflow-x: scroll;


    table {
        min-width: 700px;
        border-collapse: collapse;
        width: 100%;
        border-radius: 5px;
        overflow: hidden;

        td, th {
            border: 1px solid #ddd;
            padding: 8px;
            font-size: 15px;
        }

        th {
            text-align: center;
        }

        tr {
            &:nth-child(even) {
                background-color: #fcf9f9;
            }
        }

        th {
            background-color: ${mainColor};
            color: white;
        }
    }

    .date_position {
        position: relative;

        span {
            width: 100%;
            position: absolute;
            bottom: 0;
            left: 0;
            padding-right: 5px;
            color: #c9bcbc;
            font-size: 12px;
            text-align: end;
        }
    }

`;
export default OldData;
