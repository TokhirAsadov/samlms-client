import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {DataGrid, GridToolbar} from '@mui/x-data-grid';
import Spinner from "../../spinner/Spinner";
import {ADMIN, BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import axios from "axios";
import {extrasmall} from "../../../responsiv";

const Menu = () => {

    const [spinner, setSpinner] = useState(true);

    const columns = [
        {
            field: 'fullName',
            headerName: 'Full Name',
            minWidth: 300,
            flex: 1,
            align: 'center',
            justifyContent: 'center',
            editable: false,
        },
        {
            field: 'device',
            headerName: 'Device',
            minWidth: 120,
            flex: 0.8,
            align: 'center',
            justifyContent: 'center',
            editable: false,
        },
        {
            field: 'room',
            headerName: 'Room',
            minWidth: 100,
            flex: 0.8,
            align: 'center',
            justifyContent: 'center',
            editable: false,
        },
        {
            field: 'time',
            headerName: 'Time',
            type: 'dateTime',
            minWidth: 200,
            flex: 0.8,
            align: 'center',
            justifyContent: 'center',
            editable: false,
        },
        {
            field: 'passport',
            headerName: 'Passport',
            minWidth: 140,
            flex: 0.8,
            align: 'center',
            justifyContent: 'center',
            editable: false,
        },
        {
            field: 'card',
            headerName: 'Card',
            type: 'string',
            minWidth: 130,
            flex: 0.8,
            align: 'center',
            justifyContent: 'center',
            editable: false,
        },
        {
            field: 'login',
            headerName: 'Login',
            minWidth: 120,
            flex: 0.8,
            align: 'center',
            justifyContent: 'center',
            editable: false,
        },
    ];
    const [data, setData] = useState([])

    useEffect(() => {
        const {headers} = getHeaders();
        axios.get(BASE_URL + ADMIN.MENU, {headers})
            .then(res => {
                const formatData = res.data?.map((user) => {
                    if (user.time !== null)
                        user.time = new Date(user.time);
                    return user;
                })?.sort((a, b) => b?.time - a?.time);
                setData(formatData);
                setSpinner(false);
            })
            .catch(err => {
                console.log(err)
                setSpinner(false);
            });

    }, [])


    return (
        <Container>
            <Title>Statistics Table</Title>
            <Body>
                {
                    spinner ? <Spinner/> : <DataGrid
                        style={{width: "900px", minHeight: "300px!important"}}
                        columns={columns}
                        rows={data}
                        components={{Toolbar: GridToolbar}}/*** print and excel ****/
                        autoHeight
                        rowsPerPageOptions={[10,25, 50, 75, 100]}
                        initialState={{ // hide items
                            ...data.initialState,
                            columns: {
                                columnVisibilityModel: {
                                    id: false,
                                    login: false,
                                    card: false,
                                    passport: false
                                },
                            },
                            pagination: {
                                pageSize: 10,
                            },
                        }}
                    />
                }
            </Body>
        </Container>
    );
};

const Body = styled.div`
    width: 100%;
    background-color: #fff;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Title = styled.h2`
    color: ${mainColor};
    margin: 10px 0 20px 20px;
    ${extrasmall({
        textAlign: "center",
        marginLeft: 0,
    })}
`;

const Container = styled.div`
    padding: 1rem;

    .MuiDataGrid-columnHeaderTitleContainer {
        justify-content: center;
    }
`;

export default Menu;