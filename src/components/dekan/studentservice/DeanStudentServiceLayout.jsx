import React from 'react';
import styled from "styled-components";
import {mainColor} from "../../../utills/ServiceUrls";
import {Link, Outlet, useLocation} from "react-router-dom";
import {ButtonGroup} from "@mui/material";
import Button from "@mui/material/Button";
import {extrasmall} from "../../../responsiv";

const DeanStudentServiceLayout = () => {
    const location = useLocation()
    const currentUrl = location.pathname.slice('7')

    const buttonVariant = (url) => (currentUrl === url ? 'contained' : 'outlined')
    return (
        <Container>
            <Title>
                <h1>Service</h1>
            </Title>
            <BtnGroup>
                <ButtonGroup>
                    <Link to={''}>
                        <Button variant={buttonVariant('service')}>Reference</Button>
                    </Link>
                    <Link to={'notice'}>
                        <Button variant={buttonVariant('service/notice')}>Notice</Button>
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

const BtnGroup = styled.div`
    ${extrasmall({
    display: 'flex',
    justifyContent: 'center',
})}
`
const Title = styled.div`
  h1 {
    font-size: 30px;
    color: ${mainColor};
  }
`
const Container=styled.div`
    width: 100%;
    padding: 1rem;
`

export default DeanStudentServiceLayout;