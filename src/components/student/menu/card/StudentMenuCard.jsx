import React, {memo} from 'react';
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import {Card, CardContent} from "@mui/material";

const StudentMenuCard = ({icon, title, count, color, index, path}) => {

    const navigate = useNavigate()


    return (
        <Card sx={{cursor: 'pointer'}} onClick={() => navigate(`../${path}`)}>
            <CardContent>
                <IconWrapper color={color}>
                    <Icon>
                        {React.createElement(icon)}
                    </Icon>
                </IconWrapper>
                <Body color={color}>
                    <Title>{title}</Title>
                    <Count></Count>
                </Body>
            </CardContent>
        </Card>

    );
};


const Count = styled.span`
    font-size: 30px;
`

const Title = styled.span`
    font-size: 24px;
`

const Body = styled.div`
    margin-top: 30px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    color: ${props => props.color};
`;

const Icon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;
const IconWrapper = styled.div`
    width: 100%;
    display: flex;
    font-size: 36px;
    color: ${props => props.color};
`;
export default memo(StudentMenuCard);