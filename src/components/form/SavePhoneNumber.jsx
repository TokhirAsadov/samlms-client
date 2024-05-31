import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {isValidPhoneNumber} from 'react-phone-number-input'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import {Link} from "react-router-dom";
import {BASE_URL, getHeaders, mainColor} from "../../utills/ServiceUrls";
import axios from "axios";
import {useHttp} from "../hook/useHttp";
import {useDispatch, useSelector} from "react-redux";
import {fetchUser} from "../../redux/actions/user/user_actions";
import {FaEdit, FaSave} from "react-icons/fa";

const prepareForm = (formArr) => {
    return formArr.reduce((r,v) => v.name!=="lessonDtos" ? ({...r,[v.name]: ""}) : ({...r,[v.name]: []}),{});
}


const SavePhoneNumber = ({ title,formArr, redirect,phoneType,onClose }) => {

  const initialForm = prepareForm(formArr);
  const [form,setForm] = useState(prepareForm(formArr));

  const [value, setValue] = useState("")
  const [isValid, setIsValue] = useState(false)

  const { request } = useHttp();
  const dispatch = useDispatch();

  const onChangeHandler = (e,name) => setForm(p => ({...p,[name]: e.target.checked}));

  const fixedForm = () => {
    if (form?.hasTg==="") setForm(p => ({...p,hasTg: false}))
    if (form?.hasInstagram==="") setForm(p => ({...p,hasInstagram: false}))
    if (form?.hasFacebook==="") setForm(p => ({...p,hasFacebook: false}))
  }

  const close = () => onClose();
  const onSubmitHandler = async () => {
    await fixedForm();

    isValid && axios.post(BASE_URL+"/phoneNumber/createPhoneNumber",form,{headers})
      .then(res => {
        close();
        dispatch(fetchUser(request))
      })
      .catch(err => {
        console.log(err);
      })
  }

  const { headers } = getHeaders();

  const hasRedirect = !!redirect;
  const user = useSelector(state => state?.user?.user);


  useEffect(() =>{
    console.log(form,"form")
    console.log(formArr,"form")
  },[form])


  const handlePhone = (value, country, e, formattedValue) => {
    setIsValue(isValidPhoneNumber(formattedValue));
    if (isValidPhoneNumber(formattedValue)) {
      setForm(p => (
          {
            ...p,
            phoneNumber: value,
            phoneType:phoneType,
            id:user?.phones.filter(item => item.phoneType===phoneType)[0]?.id
          }
        )
      )
    }
    setValue(value);
  }


  return (
      <SForm >
          <Title>{title}</Title>
               <InputWrapper >
                  {formArr?.map(({label,name,placeholder,type,icon},index) => {
                    if (type === "phone") {
                      return <Wrapper key={index}>
                          <Label htmlFor={name} display={name === "id"}>{label}</Label>
                          <PhoneInput
                                placeholder="Enter phone number"
                                value={value}
                                onChange={handlePhone}
                                international
                                country={'uz'}
                                enableSearch={true}
                          />
                      </Wrapper>
                    } else {
                      return <Wrapper key={index}>
                        <Label htmlFor={name} display={name === "id"}>{React.createElement(icon)}&nbsp;&nbsp;{label}</Label>
                        <Input
                          key={index}
                          display={name === "id"}
                          id={name}
                          name={name}
                          type={type}
                          value={form[name]}
                          onChange={(e) => onChangeHandler(e,name)}
                          placeholder={placeholder}
                        />
                      </Wrapper>
                    }
                  })}
              </InputWrapper>
          <Button
              onClick={(e) => {
                  e.preventDefault();
                  onSubmitHandler();
              }}
          >{user?.phones.filter(item => item.phoneType===phoneType)[0]!==null ? <FaEdit /> : <FaSave />}
              {user?.phones.filter(item => item.phoneType===phoneType)[0]!==null ? "Update" : "Save"}
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
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px;
  color: ${mainColor};
`;

const InputWrapper = styled.div`
  display: flex;
  overflow: scroll;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 20px;
  width: 90%;

`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  & > div{
    width: 300px!important;
  }
`;

const Input = styled.input`
  border: 1px solid ${mainColor};
  width: 20px;height: 20px;
  padding-left: 10px!important;
  border-radius: 5px;
  display: ${props => props.display ? "none" : "block"};
  cursor: pointer;

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
  height: 30px;
  margin-top: 20px!important;
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

const Label = styled.label`
  width: 200px;
  font-size: 20px;
  display: ${props => props.display ? "none" : "block"};
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
  color: ${mainColor};
  margin-bottom: 20px!important;
`;

const RedirectLink = styled(Link)`
  text-decoration: none;
  color: blue;
`;

export default SavePhoneNumber;