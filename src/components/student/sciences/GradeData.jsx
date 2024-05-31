import React, {memo, useEffect, useState} from 'react';
import styled from "styled-components";
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import {Card, CardContent} from "@mui/material";
import moment from "moment/moment";
import EmptyDataImg from "../../emptyDataImg/EmptyDataImg";
import {extrasmall} from "../../../responsiv";
import Button from "@mui/material/Button";
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";
import {FaExclamationTriangle} from "react-icons/fa";

const GradeData = ({gradeDataInfo,openGrade}) => {

    const [allTheme, setAllTheme] = useState([])
    const bgColorData = (number, maxNum) => {
        const numberFormat = parseFloat((number * 100 / maxNum).toFixed(3));
        if (numberFormat >= 0 && numberFormat < 60) {
            return '#FF0000';
        } else if (numberFormat >= 60 && numberFormat < 85) {
            return 'rgb(215,215,0)';
        } else if (numberFormat >= 85) {
            return '#00bd00';
        }
    }
    console.log(gradeDataInfo)
    const getThemeAll = async ( lessonId, eduId,groupId,teacherId) => {
            await axios.get(`${BASE_URL}/themeOfSubjectForGrading/getThemes/${lessonId}/${groupId}?educationYearId=${eduId}&t=${teacherId}`, getHeaders())
                .then(res => {
                    console.log(res.data)
                    setAllTheme(res.data.obj)
                })
                .catch(err => {
                    console.log(err)
                    setAllTheme([])
                })

    }

    useEffect(() => {
        openGrade && getThemeAll(gradeDataInfo.lessonId,gradeDataInfo.educationYearId,gradeDataInfo.groupId,gradeDataInfo?.teacherId)
    }, [openGrade]);

    function getObjectsNotInArray(a, b) {
        const bIds = new Set(b.map(obj => obj.themeId));
        return a.filter(obj => !bIds.has(obj.id));
    }

    return (
        <Container>
            <TitleModal>
                {gradeDataInfo?.lessonName}
            </TitleModal>
            <Card component={CardRes}>
                <CardContent>
                    <div className="btn_att">
                        <Button size={'small'} variant={'contained'} disabled>
                            attendance score : {parseFloat(gradeDataInfo?.allGradesForAttendance?.toFixed(3) || 0)}
                        </Button>
                    </div>
                    <Bodybox>
                        <table>
                            <thead>
                            <tr>
                                <th><h5>Theme</h5></th>
                                <th><h5>Score</h5></th>
                                <th><h5>Max score</h5></th>
                                <th><h5>Date</h5></th>
                            </tr>
                            </thead>

                            <tbody>
                            {gradeDataInfo?.grades.map((item, key) => (
                                <tr key={key}>
                                    <td>
                                        {item?.theme ? item.theme : "-"}
                                    </td>
                                    <td style={{
                                        background: bgColorData(item?.grade, item?.maxGrade || 6),
                                        color: '#fff'
                                    }}>
                                        {item?.grade}
                                    </td>
                                    <td>
                                        {item?.maxGrade || 6}
                                    </td>
                                    <td>
                                        {moment(new Date(item?.time)).format('DD.MM.YYYY HH:mm')}
                                    </td>
                                </tr>
                            ))}
                            {getObjectsNotInArray(allTheme, gradeDataInfo?.grades).map((item2, index) => (
                                <tr key={index}>
                                    <td>{item2?.name}</td>
                                    <Tooltip title={"haven't marked"} arrow placement={'left'}>
                                        <td><FaExclamationTriangle/></td>
                                    </Tooltip>
                                    <td>{item2?.maxGrade}</td>
                                    <td></td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {gradeDataInfo?.grades?.length === 0 && <EmptyDataImg w={200} h={180}/>}
                    </Bodybox>
                </CardContent>
            </Card>

        </Container>
    );
};

const CardRes = styled.div`
    margin-top: 40px;
    ${extrasmall({
        marginTop: '80px',
    })}
`;

const Bodybox = styled.div`
    width: 100%;
    overflow-x: scroll;

    table {
        min-width: 500px;
        border-collapse: collapse;
        width: 100%;
        text-align: center;
        border-radius: 5px;
        overflow: hidden;

        td, th {
            border: 1px solid #ddd;
            padding: 7px;
        }

        tr {
            &:nth-child(even) {
                background-color: #f2f2f2;
            }
        }

        th {
            padding: 7px 0;
            background-color: ${mainColor};
            color: white;
        }
    }
`
const TitleModal = styled.div`
    position: absolute;
    font-size: 20px;
    color: #ffffff;
    background-color: ${mainColor};
    width: 100%;
    top: -1px;
    border-radius: 5px 5px 0 0;
    padding: 10px;
    z-index: 9;
`

const Container = styled.div`
    width: 100%;

    .Mui-disabled {
        color: #000000 !important;
    }

    .btn_att {
        display: flex;
        justify-content: end;
        margin-bottom: 10px;
    }
`
export default memo(GradeData);