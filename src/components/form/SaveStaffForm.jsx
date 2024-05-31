import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {Link} from "react-router-dom";
import {BASE_URL, getHeaders, mainColor} from "../../utills/ServiceUrls";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import axios from "axios";
import Spinner from "../spinner/Spinner";
import {useSelector} from "react-redux";
import ButtonMui from "@mui/material/Button";
import Box from "@mui/material/Box";
import {extrasmall} from "../../responsiv";
import {FaEdit, FaSave} from "react-icons/fa";

const animatedComponents = makeAnimated();

const prepareForm = (formArr) => {
    return formArr.reduce((r,v) => v.name!=="lessonDtos" ? ({...r,[v.name]: ""}) : ({...r,[v.name]: []}),{});
}


const SaveStaffForm = ({ title,formArr, submitBtn, onSubmit,updateItem, redirect,isSection }) => {

  const user = useSelector(state => state?.user?.user);

  const [userOptions,setUserOptions] = useState([])
  const [positions,setPositions] = useState([])
  const [spinner,setSpinner] = useState(true)

  const initialForm = prepareForm(formArr);
  const [form,setForm] = useState(prepareForm(formArr));

  const onChangeHandler = (e,name) => setForm(p => ({...p,[name]: e}));


  const onSubmitHandler = () => {
    onSubmit(preForm(form));
  }

  const { headers } = getHeaders();

  useEffect(()=>{

    console.log(updateItem,"item up")

    setForm({...form,id:updateItem?.id,userId:updateItem?.userId,sectionId:updateItem?.sectionId});
    axios.get(BASE_URL+"/dekanat/getUserForDekanSave?bool="+isSection,{ headers })
      .then(res => {
        console.log(res?.data,"12")
        setUserOptions(res?.data?.obj?.users)
        setPositions(res?.data?.obj?.positions)

        if (updateItem?.positionId!==null && updateItem?.positionId!==""){
          setForm(prev => ({...prev,positionId: res?.data?.obj?.positions.find(item => item?.label===updateItem?.positionId)}))
        }

        setSpinner(false)
        console.log(res?.data?.obj?.positions)
      })
      .catch(err => {
        console.log(err);
      })
  },[])

  const hasRedirect = !!redirect;

  const handleSearch = (e,name) => {

    if (e.length>2 && name==="userId") {
      axios.get(BASE_URL + "/user/getUserForTeacherSavingSearch?keyword=" + e, {headers})
        .then(res => {
          setUserOptions(res?.data?.obj)
        })
        .catch(err => {
          console.log(err);
        })
    }
  }


  const preForm = (formArr) => {


    return {
      id: formArr?.id,
      sectionId: formArr?.sectionId,
      userId: formArr?.userId?.value,
      positionId: formArr?.positionId?.value
    }
  }

  return (
      <SForm >
        {
          spinner ? <Spinner /> :
            <>
              <Title>{title}</Title>
                   <InputWrapper >
                      {formArr?.map(({label,name,placeholder,type,value},index) => {
                        if (type !== "select") {
                          return <>
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
                          </>
                        } else {
                          return <Wrapper>
                            <Label htmlFor={name}>{label}</Label>
                             <Select
                                width='300px'
                                closeMenuOnSelect={true}
                                components={animatedComponents}
                                isMulti={false}
                                options={ name==="userId" ? userOptions : positions}
                                onChange={e => onChangeHandler(e,name)}
                                value={form[name]}
                                name={name}
                                isClearable={true}
                                onInputChange={e => handleSearch(e,name)}
                                isDisabled={user?.id===updateItem?.userId?.value && name==="userId"}
                             />

                          </Wrapper>
                        }
                      })}
                  </InputWrapper>
             <Box
             sx={{mt:'20px',display: 'flex', justifyContent:'end'}}
             >
                 <ButtonMui
                     variant={'contained'}
                     onClick={(e) => {
                         e.preventDefault();
                         onSubmitHandler();
                     }}
                 >{submitBtn.startsWith("Update") ? <FaEdit style={{ marginRight:"10px" }}/> : <FaSave style={{ marginRight:"10px" }}/>}
                     {submitBtn}
                 </ButtonMui>
             </Box>
              { hasRedirect && (
                  <Redirect>
                      <RedirectLabel>{redirect.label}&nbsp;</RedirectLabel>
                      <RedirectLink to={redirect.link.to}>{redirect.link.label}</RedirectLink>
                  </Redirect>
              )}
            </>
        }
      </SForm>
  );
};

const SForm = styled.form`
  width: 100%;
  border-radius: 10px;
  color: ${mainColor};
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 20px;
  
`;

const Wrapper = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: space-between;
  & > div{
    width: 250px!important;
  }
  ${extrasmall({
    flexDirection: 'column',
  })}
`;

const Input = styled.input`
  border: 1px solid ${mainColor};
  height: 40px;
  width: 200px;
  padding-left: 10px!important;
  border-radius: 5px;
  display: ${props => props.display ? "none" : "block"};

  &::placeholder{
    font-size: 14px;
    letter-spacing: 1.1px;
    color: ${mainColor};
  }
  &:focus{
    outline: none;
  }
`;



const Label = styled.label`
  font-size: 20px;
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
  text-align: start;
`;

const RedirectLink = styled(Link)`
  text-decoration: none;
  color: blue;
`;

export default SaveStaffForm;