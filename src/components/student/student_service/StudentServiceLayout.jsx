import React from 'react';
import styled from "styled-components";
import {extrasmall} from "../../../responsiv";
import {mainColor} from "../../../utills/ServiceUrls";
import {ButtonGroup} from "@mui/material";
import Button from "@mui/material/Button";
import {Link, Outlet, useLocation} from "react-router-dom";

const StudentServiceLayout = () => {
    const location = useLocation()
    const currentUrl = location.pathname.slice('9')

    const buttonVariant = (url) => (currentUrl === url ? 'contained' : 'outlined')
    return (
        <Container>
            <Title>
                <h1>Services</h1>
            </Title>
            <BtnGroup>
                <ButtonGroup>
                    <Link to={''}>
                        <Button variant={buttonVariant('service')}>Reference</Button>
                    </Link>
                    <Link to={'queue'}>
                        <Button variant={buttonVariant('service/queue')}>queue</Button>
                    </Link>
                </ButtonGroup>
            </BtnGroup>

            <Outlet/>
        </Container>
    );
};
const Title = styled.div`
    margin: 5px 10px 15px 10px;

    h1 {
        margin: 0;
        font-size: 35px;
        color: ${mainColor};
        ${extrasmall({
            fontSize: '33px',
        })}
    }
`;
const BtnGroup = styled.div`
    ${extrasmall({
        display: 'flex',
        justifyContent: 'center',
    })}
`
const Container = styled.div`
    width: 100%;
    padding: 1rem;
`
export default StudentServiceLayout;