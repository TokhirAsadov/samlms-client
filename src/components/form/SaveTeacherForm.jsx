import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {Link} from "react-router-dom";
import {BASE_URL, getHeaders, mainColor} from "../../utills/ServiceUrls";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import axios from "axios";
import {useSelector} from "react-redux";
import {FaEdit, FaSave} from "react-icons/fa";

const animatedComponents = makeAnimated();

const prepareForm = (formArr) => {
    return formArr.reduce((r,v) => v.name!=="lessonDtos" ? ({...r,[v.name]: ""}) : ({...r,[v.name]: []}),{});
}


const SaveTeacherForm = ({ title,formArr, submitBtn, onSubmit,updateItem, redirect }) => {

  const [userOptions,setUserOptions] = useState([])
  const [kafedraOptions,setKafedraOptions] = useState([])
  const [subjectOptions,setSubjectOptions] = useState([])
  const [positions,setPositions] = useState([])
  const [workerStatuses,setWorkerStatuses] = useState([])

  const [form,setForm] = useState(prepareForm(formArr));

  const section = useSelector(state => state?.section?.section);

  const onChangeHandler = (e,name) => {
    setForm(p => ({...p,[name]: e}));
  }
const onChangeHandler2 = (e,name) => {
    setForm(p => ({...p,[name]: e.target.value}));
  }


  const onSubmitHandler = () => {
    onSubmit(preForm(form));
  }

  const { headers } = getHeaders();

  useEffect(()=>{
    setForm({...form,id:updateItem?.id,userId:updateItem?.userId,kafedraId:section?.id,lessonDtos:updateItem?.lessonDtos});
    axios.get(BASE_URL+"/user/getUserForTeacherSaving",{ headers })
      .then(res => {
        setUserOptions(res?.data?.obj?.users)
        setKafedraOptions(res?.data?.obj?.kafedras)
        setSubjectOptions(res?.data?.obj?.subjects)
        setPositions(res?.data?.obj?.positions)
        setWorkerStatuses(res?.data?.obj?.workerStatus?.map((item,index) => ({value: index,label:item})))
      })
      .catch(err => {
        console.log(err);
      })
  },[])

  const hasRedirect = !!redirect;

  const handleSearch = (e,name) => {

    if (e.length>4 && name==="userId") {
      axios.get(BASE_URL + "/user/getUserForTeacherSavingSearch?keyword=" + e, {headers})
        .then(res => {
          setUserOptions( Array.from(new Map(res?.data?.obj.map(item => [item?.login, item])).values()))
        })
        .catch(err => {
          console.log(err);
        })
    }
  }


  const preForm = (formArr) => {
    const arr = formArr?.lessonDtos?.map(({ value: id, label: name }) => ({
      id,
      name,
    }))

    return {
      id: formArr?.id,
      userId: formArr?.userId?.value,
      kafedraId: section?.id,
      lessonDtos: arr,
      workerStatus: formArr?.workerStatus?.label,
      positionId: formArr?.positionId?.value
    }
  }

  const obj = preForm(form);

  return (
      <SForm >
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
                        onChange={(e) => onChangeHandler2(e,name)}
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
                            isMulti={name==="lessonDtos"}
                            options={name==="lessonDtos" ? subjectOptions : name==="userId" ?
                              userOptions : name==="kafedraId" ?  kafedraOptions : name==="workerStatus"? workerStatuses : positions}
                            onChange={e => onChangeHandler(e,name)}
                            value={form[name]}
                            name={name}
                            isClearable={true}
                            onInputChange={e => handleSearch(e,name)}
                            onFocus={()=>setUserOptions([])}
                            isSearchable={true}
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
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #fff;
  height: 400px;
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


const Button = styled.button`
  padding: 8px 55px;
  margin-top: 25px!important;
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

export default SaveTeacherForm;