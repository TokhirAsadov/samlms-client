import React from 'react';
import styled from "styled-components";
import logo from "../utills/images/logo_nav.png";
import logomini from "../utills/images/logo.png";
import {extrasmall, large, medium, small, xlarge, xxlarge} from "../responsiv";
import {Link,} from "react-router-dom";

const LogoNav = () => {

    return (
        <Link to={"/"}>
            <Container>
                <Image/>
            </Container>
            <Containermobil>
                <Imagemobil/>
            </Containermobil>
        </Link>
    );
};

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 50px;
    ${small({
        display: "none",
    })}
    ${extrasmall({
        display: "none",
    })}
`;
const Containermobil = styled.div`
    display: flex;
    align-items: center;
    width: 50px;
    height: 50px;
    justify-content: center;
    ${xxlarge({
        display: "none",
    })}
    ${xlarge({
        display: "none",
    })}
    ${large({
        display: "none",
    })}
    ${medium({
        display: "none",
    })}
`
const Image = styled.img.attrs({
    src: `${logo}`,
    alt:'logo'
})`
    width: 100%;
    cursor: pointer;

`;
const Imagemobil = styled.img.attrs({
    src: `${logomini}`,
    alt:'logo_mabil'
})`
    width: 100%;
    cursor: pointer;

`;


export default LogoNav;