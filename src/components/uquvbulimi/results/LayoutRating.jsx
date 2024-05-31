import React from 'react';
import styled from "styled-components";
import {Card} from "@mui/material";
import {NavLink, Outlet} from "react-router-dom";
import {extrasmall, large, medium, small, xlarge, xxlarge} from "../../../responsiv";
import {mainColor} from "../../../utills/ServiceUrls";

const LayoutRating = () => {

    const navRating = [
        {
            label: 'Results',
            path: 'results',
        },
        {
            label: 'Fails',
            path: 'fails',
        },
       {
            label: 'Final',
            path: 'final',
        },
        {
            label: 'GPA',
            path: 'gpa',
        },

    ]

    return (
        <Container>
            <Card>
                <Container>
                    <BoxNav>
                        {navRating.map(item=>(
                            <NavLink to={item.path} key={item.path} >
                                {item.label}
                            </NavLink>
                        ))}
                    </BoxNav>
                </Container>
            </Card>
            <Outlet/>
        </Container>
    );
};

const BoxNav=styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  ${xxlarge({
    gap: "30px",
})}
  ${xlarge({
    gap: "20px",
})}
  ${large({
    gap: "20px",
    gridTemplateColumns: "repeat(3, 1fr)",
})}
  ${medium({
    gap: "20px",
    gridTemplateColumns: "repeat(2, 1fr)",
})}
  ${small({
    gap: "20px",
    gridTemplateColumns: "repeat(2, 1fr)",
})}
  ${extrasmall({
    gap: "30px",
    gridTemplateColumns: "repeat(1, 1fr)",
})}
  a {
    font-size: 16px;
    display: flex;
    justify-content: center;
    padding: 10px 5px;
    background-color: ${mainColor};
    color: #ffffff;
    border-radius: 5px;
    transition: .3s;
  }

  .active {
    font-weight: bold;
    background-color: #eae6e6;
    color: ${mainColor};
  }
`


const Container=styled.div`
  width: 100%;
  padding: 1rem;
`
export default LayoutRating;