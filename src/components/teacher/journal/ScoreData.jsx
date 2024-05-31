import React, {memo} from 'react';
import Box from "@mui/material/Box";
import styled from "styled-components";
import Tooltip from "@mui/material/Tooltip";

const ScoreData = ({item, handleOpen2}) => {

    const formatScore=parseFloat(((item?.allSumGrade || 0) + (item?.allGradesForAttendance || 0))?.toFixed(3))

    const bgColorData = (number) => {
        const numberFormat = parseFloat((number * 10 / 3).toFixed(3));
        if (numberFormat >= 0 && numberFormat < 60) {
            return '#FF0000';
        } else if (numberFormat >=60  && numberFormat < 85) {
            return 'rgb(215,215,0)';
        } else if (numberFormat >= 85) {
            return '#00bd00';
        }
    }
    return (
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <Tooltip title={'max:30'} arrow>
                <BoxNb bgColor={bgColorData(formatScore)}
                    onClick={() => handleOpen2(item)}>
                    {formatScore}
                </BoxNb>
            </Tooltip>
        </Box>

    );
};
const BoxNb = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 5px;
    border: 1px solid #a6a6e0;
    background-color: ${props => props.bgColor};
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: #f1f1f1;

    &:hover {
        opacity: 0.8;
    }

`;
export default memo(ScoreData);