import React, {useState} from 'react';
import styled from "styled-components";
import {NavLink as BaseNavLink} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {maninsidebar} from "../../utills/ServiceUrls";
import SideBarDropdownChild from "./SideBarDropdownChild";
import {useSelector} from "react-redux";
import {extrasmall} from "../../responsiv";

const SideBarDropdown = ({item}) => {
    const {t} = useTranslation();
    const [subnav, setSubnav] = useState(false);
    const btntoggleval = useSelector(state => state.btnvalue.btnval)
    const btntoggleval2 = useSelector(state => state.btnvalue.btnAction)
    const showSubnav = () => setSubnav(!subnav);

    return (
        <div>
            {!item.subNav ?
                <NavLink btnval={btntoggleval2}
                         to={`${item.link}`}
                         onClick={item.subNav && showSubnav}
                >
                    < item.icon
                        style={{fontSize: "24px"}}/>
                    {btntoggleval ? null : (
                        <ItemTitle>{t(item.heading)}</ItemTitle>
                    )}
                </NavLink> : <ItemNav
                    btnval={btntoggleval}
                    key={item.link}
                    to={`${item.link}`}
                    onClick={item.subNav && showSubnav}
                >
                    < item.icon style={{fontSize: "24px"}}/>
                    {btntoggleval ? null : (
                        <ItemTitle>{t(item.heading)}</ItemTitle>
                    )}
                </ItemNav>

            }
            {subnav &&
                item.subNav.map((item, index) => {
                    return (
                        <>
                            <SideBarDropdownChild key={index} item={item}/>
                        </>
                    );
                })
            }
        </div>
    );
};

const ItemNav = styled.div`
    width: 100%;
    display: flex;
    ${props => props.btnval ? "justify-content:center" : ""};
    align-items: center;
    cursor: pointer;
    border-radius: 8px;
    color: ${maninsidebar};
    padding: ${props => props.btnval ? "0" : "5px 20px"};
    margin-bottom: 10px !important;
    height: 42px !important;

    &:hover {
        background-color: #DEEDF4;
        color: #0a58ca;
    }
`

const NavLink = styled(BaseNavLink)`
    width: 100%;
    display: flex;
    ${props => props.btnval=='open' ? "justify-content:center" : ""};
    align-items: center;
    cursor: pointer;
    border-radius: 8px;
    color: ${maninsidebar};
    margin-bottom: 10px !important;
    padding: ${props => props.btnval =='open' ? "0" : "5px 20px"};
    height: 42px !important;

    &:hover {
        background-color: #DEEDF4;
    }

    &.active {
        background-color: #DEEDF4;
        color: #0a58ca;
    }
`;

const ItemTitle = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 20px !important;
    font-size: 18px;
    font-weight: 400;
    ${extrasmall({
        fontSize: 15,
    })}
`;


export default SideBarDropdown;