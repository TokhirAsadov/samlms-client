import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import 'react-phone-input-2/lib/style.css'
import {Link} from "react-router-dom";
import {BASE_URL, getHeaders, mainColor} from "../../utills/ServiceUrls";
import axios from "axios";
import {useHttp} from "../hook/useHttp";
import {useDispatch, useSelector} from "react-redux";
import {fetchUser} from "../../redux/actions/user/user_actions";
import {FaSave} from "react-icons/fa";


const prepareForm = (formArr) => {
    return formArr.reduce((r,v) => v.name!=="lessonDtos" ? ({...r,[v.name]: ""}) : ({...r,[v.name]: []}),{});
}


const SaveAddress = ({ constant,formArr, redirect,onClose }) => {

  const [form,setForm] = useState(prepareForm(formArr));

  const [isValid, setIsValid] = useState(false)
  const user = useSelector(state => state?.user?.user);

  const { request } = useHttp();
  const dispatch = useDispatch();

  const onChangeHandler = (e,name) => setForm(p => ({...p,[name]: e.target.value}));


  const fixedForm = async () => {
    if (constant){
      if (user?.address?.id!==null){
        setForm(p => ({...p,id: user?.address?.id}))
      }
      setForm(p => ({...p,constant: constant,asCurrent:false}))
    }
    else {
      if (user?.addressCurrent?.id!==null){
        setForm(p => ({...p,id: user?.addressCurrent?.id}))
      }
      setForm(p => ({...p,constant: constant,asCurrent:true}))
    }
  }

  useEffect(()=>{
    fixedForm();
  },[])

  const close = () => onClose();
  const onSubmitHandler = async () => {
    isValid && axios.post(BASE_URL+"/address/createForUser",form,{headers})
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


  useEffect(() =>{
    if (form?.country && form?.region && form?.area && form?.address && form?.constant!==null && form?.asCurrent!==null){
      setIsValid(true);
    }
  },[form])




  return (
      <SForm >
          <Title>{constant ? "Constant address" : "Current address"}</Title>
               <InputWrapper >
                  {formArr?.map(({label,name,placeholder,type},index) => {
                      return <Wrapper key={index}>
                        <Label htmlFor={name} display={name === "id"}>{label}</Label>
                        <Input
                          key={index}
                          display={name === "id"}
                          id={name}
                          name={name}
                          type={type}
                          value={form[name]}
                          onChange={(e) => onChangeHandler(e,name)}
                          placeholder={placeholder}
                          required={true}
                        />
                      </Wrapper>
                  })}
              </InputWrapper>
          <Button
              onClick={(e) => {
                  e.preventDefault();
                  onSubmitHandler();
              }}
          ><FaSave/>
            Save
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
  flex-direction: column;
  gap: 20px;
  width: 90%;
   
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  & > div{
    width: 250px!important;
  }
`;

const Input = styled.input`
  border: 1px solid ${mainColor};
  width: 200px;
  //height: 20px;
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

export default SaveAddress;