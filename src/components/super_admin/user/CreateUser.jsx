import React from 'react';
import styled from "styled-components";
import {GrAttachment} from "react-icons/gr";
import {BASE_URL, TOKEN, TokenType} from "../../../utills/ServiceUrls";
import axios from "axios";
import {toast} from "react-toastify";

const CreateUser = () => {


  const savePhoto = (e) => {
    e.preventDefault()
    const url = BASE_URL+"/student/uploadStudent";
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    const token=localStorage.getItem(TOKEN)
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization':TokenType+token,
        'Access-Control-Allow-Origin': '*'
      }
    }
    axios.post(url, formData, config)
      .then((response) => {
        console.log(response.data,'RES upload');

        toast.success("Saved photo successfully...", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        })
      })
      .catch(err=>{
        console.log(err,"err upload")
      })
  }

  return (
    <Container>
      <Wrapper>
        <h3>Create users</h3>
        <label
          style={{
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            fontSize:"20px",
            cursor:"pointer"
          }}
        >
          <GrAttachment />
          <input type="file" style={{ display: "none" }} onChange={savePhoto}/>
        </label>
      </Wrapper>

    </Container>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
    align-items: center;
  gap: 20px;
  
  &>label{
    width: 40px;
    height: 40px;
    background-color: #fff;
    border-radius: 1rem;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 60%;
  min-height: 500px;
  border-radius: 10px;
  margin-top: 10px!important;
  margin-left: 10px!important;
  padding: 5px 10px!important; 
`;

export default CreateUser;