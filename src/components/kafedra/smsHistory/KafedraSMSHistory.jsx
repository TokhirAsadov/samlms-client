import React,{useEffect, useState} from 'react';
import styled from "styled-components";
import {BASE_URL, KAFEDRA, mainColor, navbarHeight, TOKEN, TokenType} from "../../../utills/ServiceUrls";
import axios from "axios";
import Spinner from "../../spinner/Spinner";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";
import {IoArrowBackOutline} from "react-icons/io5";
import Box from "@mui/material/Box";

const KafedraSmsHistory = () => {

  const [spinner,setSpinner] = useState(true);
  const navigate =useNavigate()
  const columns = [
    { field: 'id', headerName: 'ID', width: 40, editable: false },
    { field: 'createdAt', headerName: 'Created Time',type: 'dateTime', width: 200, editable: false, },
    { field: 'smsType', headerName: 'TYPE OF SMS', width: 200, editable: false },
    { field: 'messageBody',headerName: 'MESSAGE',width: 400,editable: false },
    {
      field: 'status',
      headerName: 'STATUS',
      width: 100,
      editable: false ,
      renderCell: (cellValues) => {
        return (
          <Wrapper type={cellValues.row.status}>
            {cellValues.row.status}
          </Wrapper>
        );
      }
    },
    { field: 'course',headerName: 'COURSE', width: 40,editable: false },
    { field: 'groupName', headerName: 'GROUP NAME', width: 200, editable: false },
    { field: 'user', headerName: 'USER', width: 400, editable: false },
  ];
  const [data,setData] = useState([
    { id: 1, fullName: "Tohir Asadov", cardNo: "123456", dateAsc: new Date(),dateDesc: new Date(),phoneNumber:"993361603"},
    { id: 2, fullName: "Tohir Asadov", cardNo: "123456", dateAsc: new Date(),dateDesc: new Date(),Print:"OK See",phoneNumber: "993361603"},
  ])

  useEffect(() => {
    const token=localStorage.getItem(TOKEN)
    const headers={
      'Authorization':TokenType+token,
      'Access-Control-Allow-Origin': '*'
    }
    axios.get(BASE_URL+KAFEDRA.GET_MESSAGES_HISTORY,{ headers })
      .then(res => {

        res.data.map( async (user) => {
          user.user = user?.user?.fullName;
          if(user.createdAt !== null)
            user.createdAt = new Date(user.createdAt);
          return user;
        });
        setData(res.data)
      })
      .catch(err => {
        console.log(err);
      })
  },[])

  return (
    <Container>
      <Box sx={{
        mb:3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Title>History of SMS</Title>
        <Button variant={'outlined'} startIcon={<IoArrowBackOutline/>} onClick={()=>navigate(-1)} >back</Button>
      </Box>
      <Body>
        {
          !spinner ? <Spinner /> : <DataGrid
            checkboxSelection
            style={{width:"900px",minHeight:"300px!important"}}
            columns={columns}
            rows={ data }
            components={{ Toolbar: GridToolbar }}/*** print and excel ****/
            autoHeight
            pageSize={5}
            initialState={{ // hide items
              ...data.initialState,
              columns: {
                columnVisibilityModel: {
                  id: false,
                  user: false,
                  groupName:false,
                  course:false
                },
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

const Wrapper = styled.div`
  width: 100%;
  background-color: ${props => props.type === 'SEND' ? 'lime' : props.type === 'SENDING' ? 'yellow' : 'red'};
  padding: 5px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px!important;
  border-radius: 10px;
 
`;

const Title = styled.h3`
  color: ${mainColor};
`;



const Container = styled.div`
  display: flex;
  padding: 1rem!important;
  flex-direction: column;
  height: calc(100hv -${navbarHeight});
`;

export default KafedraSmsHistory;