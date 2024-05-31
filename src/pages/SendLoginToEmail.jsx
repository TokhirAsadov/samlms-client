import React from 'react';
import styled from "styled-components";
import axios from "axios";
import {toast} from "react-toastify";
import {AUTH, BASE_URL, navbarHeight} from "../utills/ServiceUrls";
import Form from "../components/form/Form";

const SendLoginToEmail = () => {

    const checkedEmailAndSendMessageEmail = (email) => {
        axios.get(BASE_URL+AUTH.EMAIL+email.email)
            .then(res => {
                if (res.data.success){
                    toast.success(res.data.message);
                }
                else {
                    toast.error(res.data.message+" :(");
                }
            })
            .catch(() => {
                toast.warning("Error Service :(((");
            })
    }

    return (
        <Container>
            <Form
                title = "Email"
                formArr={[
                    {
                        label: "Email",
                        name: "email",
                        type: "text"
                    }
                ]}
                submitBtn = {"Send Email"}
                onSubmit={(email) =>checkedEmailAndSendMessageEmail(email)}
                redirect = {{
                    link:{
                        label: "Login page",
                        to:"/login"
                    }
                }}

            />
        </Container>
    );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - ${navbarHeight});
`;


export default SendLoginToEmail;