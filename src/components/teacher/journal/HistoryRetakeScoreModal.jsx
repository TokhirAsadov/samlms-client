import React, {memo, useEffect, useState} from 'react';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import Button from "@mui/material/Button";
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import styled from "styled-components";
import itemAllStudentNbModal from "./ItemAllStudentNbModal";
import moment from "moment/moment";
import axios from "axios";
import EmptyDataImg from "../../emptyDataImg/EmptyDataImg";

const HistoryRetakeScoreModal = ({data, open, handleClose}) => {
    const [retakesData, setRetakesData] = useState(null)
    const getRetakes = (failGradeId) => {
        open && axios.get(`${BASE_URL}/gradeOfStudentByTeacher/getRetakesOfStudent/${failGradeId}`, getHeaders())
            .then(res => {
                console.log(res.data.obj)
                setRetakesData(res.data.obj)
            })
            .catch(err => {
                console.log(err)
            })
    }
    useEffect(() => {
        getRetakes(data?.failGradeId)
    }, [open]);
    if (open)
        return (
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title-retake-history"
                aria-describedby="alert-dialog-description-retake-history"
            >
                <DialogTitle id="alert-dialog-title-retake-history">
                    Retake ({data?.theme}, max score: {data?.maxGrade})
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description-retake-history">
                        <BodyBox>
                            <table>
                                <thead>
                                <tr >
                                    <th>№</th>
                                    <th>Score</th>
                                    <th>Date</th>
                                </tr>
                                </thead>
                                {data?.failGradeId && <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>{retakesData?.grade}</td>
                                    <td>{moment(new Date(retakesData?.time)).format('DD-MM-YYYY HH:mm')}</td>
                                </tr>
                                {retakesData?.retakes?.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 2}</td>
                                        <td>{item?.grade}</td>
                                        <td>{moment(new Date(item?.time)).format('DD-MM-YYYY HH:mm')}</td>
                                    </tr>
                                ))}
                                </tbody>}

                            </table>
                            {!data?.failGradeId && <EmptyDataImg w={180} h={160}/>}
                        </BodyBox>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>close</Button>
                </DialogActions>
            </Dialog>
        );
};

const BodyBox = styled.div`
    margin-top: 10px;
    width: 100%;
    overflow-x: scroll;
    color: #000;

    table {
        min-width: 500px;
        border-collapse: collapse;
        width: 100%;
        text-align: center;
        border-radius: 5px;
        overflow: hidden;

        td, th {
            border: 1px solid #ddd;
            padding: 5px;
        }

       

        th {
            padding: 8px 0;
            background-color: ${mainColor};
            color: white;
        }
    }
`;
export default memo(HistoryRetakeScoreModal);