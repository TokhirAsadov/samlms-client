import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {Link} from "react-router-dom";
import {mainColor} from "../../utills/ServiceUrls";
import {FaEdit, FaSave} from "react-icons/fa";


const prepareForm = (formArr) => {
    return formArr.reduce((r,v) => ({...r,[v.name]: ""}),{});
}

const FormForItem = ({ title,formArr, submitBtn, onSubmit,updateItem, redirect }) => {
    const initialForm = prepareForm(formArr);
    const [form,setForm] = useState(prepareForm(formArr));

    const onChangeHandler = (e) => setForm(p => ({...p,[e.target.name]: e.target.value}));

    const onSubmitHandler = () => onSubmit(form, ()=> {
            setForm(initialForm);
        }
    );

    useEffect(()=>{
      if (updateItem?.name) setForm({...form,id:updateItem?.id,name:updateItem?.name})
      else  setForm({...form,id:updateItem?.id,nameEn:updateItem?.nameEn,nameRu:updateItem?.nameRu,nameUz:updateItem?.nameUz})
    },[])

    const hasRedirect = !!redirect;

    return (
        <SForm >
            <Title>{title}</Title>
                <InputWrapper >
            {formArr?.map(({label,name,placeholder,type,value},index) => (
                    <Input
                      key={index}
                        display={ name === "id" }
                        id={name}
                        name={name}
                        type={type}
                        value={form[name]}
                        onChange={(e) => onChangeHandler(e)}
                        placeholder={placeholder}
                    />
            ))}
                </InputWrapper>
            <Button
                onClick={(e) => {
                    e.preventDefault();
                    onSubmitHandler();
                }}
            >{title.startsWith("UPDATE") ? <FaEdit/> : <FaSave/>}
                {submitBtn}
            </Button>
            { hasRedirect && (
                <Redirect>
                    <RedirectLabel>{redirect.label}&nbsp;</RedirectLabel>
                    <RedirectLink to={redirect.link.to}>{redirect.link.label}</RedirectLink>
                </Redirect>
            )}
        </SForm>
    );
};

const SForm = styled.form`
  width: 100%;
  color: ${mainColor};
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Input = styled.input`
  border: 1px solid ${mainColor};
  margin: 0 auto;
  height: 40px;
  width: 200px;
  padding-left: 10px!important;
  border-radius: 5px;
  display: ${props => props.display ? "none" : ""};
  
  &::placeholder{
    font-size: 14px;
    letter-spacing: 1.1px;
    color: ${mainColor};
  }
  &:focus{
    outline: none;
  }
`;


const Button = styled.button`
  width: 200px;
  margin: 0 auto;
  height: 30px;
  margin-top: 30px!important;
  background-color: ${mainColor};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 16px;
  letter-spacing: 0.7px;
  font-weight: 400;
  cursor: pointer;
  transition: all ease 0.4s;
  border: none;
  border-radius: 5px;
  
  &:focus{
    transform: scale(0.9);
  }
`;

const Redirect = styled.div`
  font-size: 12px;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10px!important;
`;

const RedirectLabel = styled.span`

`;
const Title = styled.h3`
  font-size: 18px;
  color: ${mainColor};
  margin-bottom: 20px!important;
`;

const RedirectLink = styled(Link)`
  text-decoration: none;
  color: blue;
`;



export default FormForItem;