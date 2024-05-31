import React, {memo} from 'react';
import {Card, CardContent} from "@mui/material";
import moment from "moment/moment";
import Button from "@mui/material/Button";
import {BsDownload} from "react-icons/bs";
import axios from "axios";
import {BASE_URL, getHeaders, mainColor} from "../../utills/ServiceUrls";
import {toast} from "react-toastify";
import styled from "styled-components";
import Spinner from "../../components/spinner/Spinner";
import EmptyDataImg from "../../components/emptyDataImg/EmptyDataImg";

const HistoryDataGrid = ({fileData, isLoading}) => {
        const {headers} = getHeaders();
        const getFileDownload = (name) => {
            axios.get(`${BASE_URL}/table/uploadFromSystemUser?fileName=${name}`, {headers})
                .then(res => {
                    if (res.status === 200) {
                        const newWindow = window.open('', '_blank');
                        newWindow.location.href = `${BASE_URL}/table/uploadFromSystemUser?fileName=${name}`;
                    } else {
                        toast.error('Unexpected response status:', res.status);
                    }
                })
                .catch(err => {
                    toast.error('Error:', err);
                });
        }

        return (
            <Card sx={{mt: 3}}>
                <CardContent>
                    {isLoading ? <Spinner/> : fileData?.length !== 0 ? < BodyBox>
                        < table>
                            < thead>
                            < tr>
                                < th>№</th>
                                <th>Year</th>
                                <th>Month</th>
                                <th>Created</th>
                                <th>File</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                fileData.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{item?.year}</td>
                                        <td>{item?.month}</td>
                                        <td>{moment(item?.createdAt).format('DD.MM.YYYY HH:mm')}</td>
                                        <td>
                                            <Button
                                                variant={'contained'}
                                                onClick={() => getFileDownload(item.fileName)}
                                            >
                                                <BsDownload/>
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            }
                            </tbody>

                        </table>
                    </BodyBox> : <EmptyDataImg w={200} h={180}/>
                    }

                </CardContent>
            </Card>
        )
            ;
    }
;

const BodyBox = styled.div`
    margin-top: 25px;
    width: 100%;
    overflow-x: scroll;

    table {
        min-width: 1000px;
        border-collapse: collapse;
        width: 100%;
        text-align: center;
        border-radius: 5px;
        overflow: hidden;

        td, th {
            border: 1px solid #ddd;
            padding: 8px;
            font-size: 14px;
        }

        tr {
            &:nth-child(even) {
                background-color: #f2f2f2;
            }
        }

        th {
            background-color: ${mainColor};
            color: white;
        }
    }`;
export default memo(HistoryDataGrid);