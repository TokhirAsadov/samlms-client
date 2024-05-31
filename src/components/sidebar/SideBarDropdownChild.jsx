import React, {useState} from 'react';
import styled from "styled-components";
import {NavLink as BaseNavLink} from "react-router-dom";
import {BASE_URL, DEKAN, mainColor, TOKEN, TokenType} from "../../utills/ServiceUrls";
import axios from "axios";
import {useSelector} from "react-redux";
import {large, medium} from "../../responsiv";

const SideBarDropdownChild = ({item}) => {
    const [subChildNav, setSubChildNav] = useState(false);
    const [groups, setGroups] = useState([]);
    const btntoggleval = useSelector(state => state.btnvalue.btnval)


    const showSubChildNav = () => {

        if (groups.length === 0) {
            setSubChildNav(() => true);

            const token = localStorage.getItem(TOKEN)
            const headers = {
                'Authorization': TokenType + token,
                'Access-Control-Allow-Origin': '*'
            }

            axios.get(BASE_URL + DEKAN.GET_GROUPS_NAMES_FOR_DEKAN_BY_FACULTY_ID_AND_LEVEL + item.course, {headers})
                .then(res => {
                    setGroups(res.data);
                })
                .catch(res => {
                    console.log(res, "res err SIDEBAR");
                })
        } else {
            setGroups([]);
            setSubChildNav(false);
        }


    };

    console.log(groups, "groups++++++++++++++++++++++")
    return (
        <div>
            {
                groups.length !== 0 && item.course === null ?
                    <DropdownLink to={item.path} onClick={showSubChildNav}>
                        <ItemTitle>{item.title}</ItemTitle>
                    </DropdownLink> : <ItemNav to={item.path} onClick={showSubChildNav}>
                        {btntoggleval ? (<ItemTitle> {item.course}-c </ItemTitle>) : (
                            <ItemTitle> {item.title} </ItemTitle>)}
                    </ItemNav>
            }
            {
                groups && groups?.map((groupItem, index) => {
                    return (
                        <DropdownChildLink to={`${item.path}/${groupItem}`} key={index}>
                            <ItemTitlechild btnval={btntoggleval} key={index}>{groupItem}</ItemTitlechild>
                        </DropdownChildLink>
                    )
                })
            }

        </div>
    );
};


const ItemNav = styled.div`
    padding-left: 0.5rem;
    display: flex;
    align-items: center;
    text-decoration: none;
    font-size: 14px;
    cursor: pointer;
    color: #FFF;

    ${large({
        paddingLeft: "0",
    })}
    &:hover {
        background-color: #DEEDF4;
        color: ${mainColor};
    }

    &.active {
        background-color: #DEEDF4;
        color: ${mainColor};
    }
`

const DropdownLink = styled(BaseNavLink)`
    padding-left: 0.5rem;
    display: flex;
    align-items: center;
    text-decoration: none;
    font-size: 14px;

    &:hover {
        background-color: #DEEDF4;
    }

    &.active {
        background-color: #DEEDF4;
    }
`

const DropdownChildLink = styled(BaseNavLink)`
    padding-left: 1.5rem;
    display: flex;
    align-items: center;
    text-decoration: none;
    font-size: 12px;
    color: #fff;

    &:hover {
        background-color: #DEEDF4;
        color: ${mainColor};
    }

    &.active {
        background-color: #DEEDF4;
        color: ${mainColor};
    }
`

const ItemTitle = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 18px;
    font-size: 18px;
    font-weight: 600;

    ${large({
        marginLeft: "10px",
    })}

    ${medium({
        marginLeft: "2px",
    })}
`;
const ItemTitlechild = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 5px;
    margin-left: ${props => props.btnval ? "-18px" : "20px"};
    font-size: ${props => props.btnval ? "13px" : "15px"};
    font-weight: 600;

`;


//
// const ItemNav = styled.div`
//   padding-left: 0.5rem;
//   display: flex;
//   align-items: center;
//   text-decoration: none;
//   font-size: 14px;
//   cursor: pointer;
//
//   &:hover {
//     background-color: #DEEDF4;
//   }
//   &.active {
//     background-color: #DEEDF4;
//   }
// `
//
// const DropdownLink = styled(BaseNavLink)`
//   padding-left: 0.5rem;
//   display: flex;
//   align-items: center;
//   text-decoration: none;
//   font-size: 14px;
//
//   &:hover {
//     background-color: #DEEDF4;
//   }
//   &.active {
//     background-color: #DEEDF4;
//   }
// `
//
// const DropdownChildLink = styled(BaseNavLink)`
//   padding-left: 1.5rem;
//   display: flex;
//   align-items: center;
//   text-decoration: none;
//   font-size: 12px;
//
//   &:hover {
//     background-color: #DEEDF4;
//   }
//   &.active {
//     background-color: #DEEDF4;
//   }
// `
//
// const ItemTitle = styled.span`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   margin-left: 20px!important;
//   font-size: 18px;
//   font-weight: 300;
// `;

export default SideBarDropdownChild;