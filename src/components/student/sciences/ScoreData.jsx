import React, {memo} from 'react';
import styled from "styled-components";
import Tooltip from "@mui/material/Tooltip";

const ScoreData = ({item2,handleOpenGrade}) => {
    const formatScore=parseFloat((item2?.sumGrade || 0).toFixed(3))
    const bgColorData = (number) => {
        const numberFormat = parseFloat((number * 10 / 3).toFixed(3));
        if (numberFormat >= 0 && numberFormat < 60) {
            return '#FF0000';
        } else if (numberFormat >= 60 && numberFormat <= 84) {
            return 'rgb(215,215,0)';
        } else if (numberFormat >= 85) {
            return '#00bd00';
        }
    }
    return (
        <Tooltip title={'max:30'} arrow>
            <BoxNb bgColor={bgColorData(formatScore)} onClick={() => handleOpenGrade(item2)}>
                {formatScore}
            </BoxNb>
        </Tooltip>
    );
};
const BoxNb = styled.div`
    margin: 0 auto;
    width: 50px;
    height: 50px;
    border-radius: 5px;
    border: 1px solid #a6a6e0;
    background-color: ${props => props.bgColor};
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color:#ffffff;

    &:hover {
        opacity: 0.8;
    }
    
`;
export default memo(ScoreData);