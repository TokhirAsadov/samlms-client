import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {BASE_URL, color_2, DEKAN, mainColor, TOKEN, TokenType} from "../../../utills/ServiceUrls";
import axios from "axios";
import {FaSearch} from "react-icons/fa";
import {toast} from "react-toastify";
import {extrasmall} from "../../../responsiv";
import Box from "@mui/material/Box";
import ButtonMui from "@mui/material/Button";
import {BiMailSend} from "react-icons/bi";
import {useNavigate} from "react-router-dom";

const DekanMessages = () => {

  const [smsType,setSMSType] = useState("ALL");
  const [course,setCourse] = useState(1);
  const [groupName,setGroupName] = useState("");
  const [groups,setGroups] = useState([]);
  const [search,setSearch] = useState("");
  const [fullName,setFullName] = useState("");

  const [searchUsers,setSearchUsers] = useState([]);

  const [messageBody,setMessageBody] = useState("");
  const [userId,setUserId] = useState("");

  const [sms,setSMS] = useState({
    course,
    messageBody,
    groupName,
    smsType,
    status: "SENDING",
    userId
  });

const navigate=useNavigate()


  const handleGroupFetch = () => {
    setSMSType(() => "GROUP");
    const token=localStorage.getItem(TOKEN)
    const headers={
      'Authorization':TokenType+token,
      'Access-Control-Allow-Origin': '*'
    }
    axios.get(BASE_URL+DEKAN.GET_GROUPS_NAMES_FOR_DEKAN_BY_DEKAN_ID,{ headers })
      .then(res => {
        setGroupName(res.data[0]);
        setGroups(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }

  const handleSearch = () => {
    if (search !== "" && search.length > 2) {
      const token = localStorage.getItem(TOKEN)
      const headers = {
        'Authorization': TokenType + token,
        'Access-Control-Allow-Origin': '*'
      }
      axios.get(BASE_URL+DEKAN.GET_USER_SEARCHING_FOR_DEKAN+search, {headers})
        .then(res => {
          if (res.data?.length!==0) {
            // setFullName(res.data.fullName);
            setSearchUsers(() => res.data)
          }
          else {
            setFullName("");
            alert("⚠️ Not fount user!...😔");
          }
        })
        .catch(err => {
          console.log(err);
        })
    }
    else {
      alert("Enter search param")
    }
  }

  useEffect(() => {
    if ( search.length < 3 ){
      setSearchUsers([]);
    }
    else {
      const token = localStorage.getItem(TOKEN)
      const headers = {
        'Authorization': TokenType + token,
        'Access-Control-Allow-Origin': '*'
      }
      axios.get(BASE_URL+DEKAN.GET_USER_SEARCHING_FOR_DEKAN+search, {headers})
        .then(res => {
          if (res.data?.length!==0) {
            setSearchUsers(() => res.data)
          }
          else {
            setSearchUsers([])

          }
        })
        .catch(err => {
          console.log(err);
        } )
    }
  },[search])



  useEffect(() => {
    setSMS((prev) => ({...prev,messageBody}))
  },[messageBody]);

  useEffect(() => {
    setSMS((prev) => ({...prev,smsType}))
  },[smsType]);

  useEffect(() => {
    setSMS((prev) => ({...prev,groupName}))
  },[groupName]);

  useEffect(() => {
    setSMS((prev) => ({...prev,course}))
  },[course]);

  useEffect(() => {
    setSMS((prev) => ({...prev,userId}))
  },[userId]);

  const onSubmit = (e) => {
    e.preventDefault();

    switch (smsType){
      case "ALL":
        setCourse(null);
        setGroupName(null)
        setUserId(null)
        messageBody === ""
          ?
          alert("Error, empty message of sms...")
          :
          sendSMS()
        break;
      case "COURSE":
        setGroupName("")
        setUserId("")
        course !== null && messageBody !== ""
        ?
        sendSMS()
        :
        alert("Error, empty message of sms or course...")
        break;
      case "GROUP":
        groupName !== "" && messageBody !== ""
        ?
        sendSMS()
        :
        alert("Error, empty message of sms or name of group...")
        break;
      case "STUDENT":
        userId !== "" && messageBody !== ""
        ?
        sendSMS()
        :
        alert("Error, empty message of sms or do not choose student...")
        break;
      default:
        console.log("default")
    }
  }

  const sendSMS = () => {
      const token=localStorage.getItem(TOKEN)
      const headers={
        'Authorization':TokenType+token,
        'Access-Control-Allow-Origin': '*'
      }
    axios.post(BASE_URL+DEKAN.SMS_CREATE,sms,{headers})
      .then(res => {
        if (res.status === 200) {
          toast.success("Sending SMS successfully!")
        }
      })
      .catch(err => {
        toast.warning("Error...")
        console.log(err);
      })
  }

  return (

    <Container>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        gap:"15px",
        alignItems: 'center',
        flexWrap: 'wrap',
      }} >
        <Legend>Message: {smsType === "COURSE" ? smsType + " - " + course : smsType === "GROUP" ? smsType + " " + groupName : smsType === "STUDENT" ? smsType + " " + fullName : smsType}</Legend>
        <ButtonMui component={smStyle} onClick={()=>navigate('smsHistory')} variant={'contained'} endIcon={<BiMailSend size={25}/>} >message history</ButtonMui>
      </Box>
      <Form onSubmit={(e) => onSubmit(e)}>
        <Fieldset>
          <Textarea
            name={messageBody}
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)/*setMessageBody(() => e.target.value)*/}
          />
        </Fieldset>
        <Section>
          <RadioGroup>
            <RadioGroupItem>
              <Radio id="all" name="type" checked={smsType === "ALL"}
                     onChange={() => setSMSType(() => "ALL")}/>
              <Label htmlFor="all">All</Label>
            </RadioGroupItem>
            <RadioItemWrapper>
              <RadioGroupItem>
                <Radio id="course" name="type" onChange={() => setSMSType(() => "COURSE")}/>
                <Label htmlFor="course">Course</Label>
              </RadioGroupItem>
              <Boxradio>
                {
                  smsType === "COURSE" &&
                  <Select value={course} onChange={(e) => setCourse(() => e.target.value)}>
                    <option value={1}>Course - 1</option>
                    <option value={2}>Course - 2</option>
                    <option value={3}>Course - 3</option>
                    <option value={4}>Course - 4</option>
                  </Select>
                }
              </Boxradio>

            </RadioItemWrapper>
            <RadioItemWrapper>
              <RadioGroupItem>
                <Radio id="group" name="type" onChange={handleGroupFetch}/>
                <Label htmlFor="group">Group</Label>
              </RadioGroupItem>
              <Boxradio>
                {
                  smsType === "GROUP" &&
                  <Select value={groupName} onChange={(e) => setGroupName(() => e.target.value)}>
                    {
                      groups?.length > 0 ?
                        groups.map((item, index) => {
                          return <option key={index} value={item}>{item}</option>
                        }) : ""
                    }
                  </Select>
                }
              </Boxradio>

            </RadioItemWrapper>
            <RadioItemWrapper>
              <RadioGroupItem>
                <Radio id="student" name="type" onChange={() => setSMSType(() => "STUDENT")}/>
                <Label htmlFor="student">Student</Label>
              </RadioGroupItem>
              <Boxradio>
                {
                  smsType === "STUDENT" &&
                  <SearchContainer>
                    <SearchWrapper>
                      <SearchInput value={search} onChange={(e) => setSearch(e.target.value)}
                                   placeholder={"StudentID or Passport"}/>
                      <SearchButton onClick={handleSearch}><FaSearch/></SearchButton>
                    </SearchWrapper>
                    <SearchUsers opacity={searchUsers.length > 0 ? 1 : 0}
                                 style={{display: "block", position: "absolute", top: "35px"}}>
                      {
                        searchUsers?.map(item => {
                          return <SearchUser
                            key={item.id}
                            onClick={(e) => {
                              e.preventDefault();
                              setUserId(item.id);
                              setFullName(item.fullName);
                              setSearch("");
                            }}
                          >
                            <SearchUserFullName>{item.fullName}</SearchUserFullName>
                            <SearchUserRole>{item.groupData.name}</SearchUserRole>
                          </SearchUser>
                        })
                      }
                    </SearchUsers>


                  </SearchContainer>
                }
              </Boxradio>
            </RadioItemWrapper>
          </RadioGroup>
          <Btnwraper>
            <Button
              onClick={() => console.log(sms, "sms ❌❌❌❌ishlamayapdi tugirlash kerak isingdan chiqmasin")}>Send</Button>
          </Btnwraper>
        </Section>

      </Form>
    </Container>
  );
};

const smStyle=styled.div`
${extrasmall({
  margin:'0  0 0 auto !important',
  
})}
`
const SearchButton = styled.span`
  width: 100%;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${mainColor};
  border-bottom-right-radius: 10px;
  border-top-right-radius: 10px;
  color: #ffffff;
  border: none;

  &:hover {
    filter: brightness(1.1);
  }

`;

const Boxradio = styled.div`
  position: absolute;
  top: 45px;
  z-index: 5;
${extrasmall({
  top:0,
  left:"160px"
})}
`
const SearchInput = styled.input`
  width: 125px;
  height: 35px;
  background: white;
  padding-left: 5px;
  font-size: 18px;
  padding-right: 10px;
  border-radius: 10px;
  cursor: pointer;
  color: ${mainColor};
  margin-left: 5px !important;
  border: none;

  &::placeholder {
    font-size: 14px;
    color: ${color_2};
  }

  &:focus {
    outline: none;
  }
`;

const SearchUserRole = styled.span`
  font-size: 12px;
  color: lightgray;
`;

const SearchUserFullName = styled.span`
  font-size: 14px;
`;

const SearchUser = styled.div`
  width: 200px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 5px 10px !important;
  border-bottom: 1px solid lightgray;
  cursor: pointer;

  &::before {

  }
`;

const SearchUsers = styled.div`
  max-height: 300px;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 45px;
  left: 20px;
  margin-top: 3px !important;
  border: 1px solid lightgray;
  border-radius: 5px;
  overflow: hidden;
  overflow-y: scroll;
  opacity: ${props => props.opacity};
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const SearchWrapper = styled.div`
  width: 150px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  background-color: #fff;
`;

const Select = styled.select`
  width: 150px;
  height: 35px;
  background: white;
  padding-left: 5px;
  font-size: 18px;
  padding-right: 10px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  color: ${mainColor};

  &:focus {
    outline: none;
  }

  option {
    color: black;
    background: white;
    font-weight: 300;
    display: flex;
    white-space: pre;
    min-height: 20px;
    padding: 0px 2px 1px;
  }
`;


const Modal = styled.div`
  position: absolute;
  background-color: rgba(255, 255, 255, 0.5);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Section = styled.section`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  ${extrasmall({
  flexDirection:"column"
})}

`;
const Btnwraper = styled.div`
  margin-left: 20px;
  margin-top: 20px;
  display: flex;
  justify-content: end;
`
const Button = styled.button`
  margin-right: 25px;
  padding: 4px 35px !important;
  background-color: ${mainColor};
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 20px;

  &:hover {
    filter: brightness(1.1);
  }

`;

const Label = styled.label`
  color: ${mainColor};
  margin-left: 10px !important;
  cursor: pointer;
`;

const Radio = styled.input.attrs({
  type: "radio"
})`
  height: 22px;
  width: 22px;
  vertical-align: middle;
  cursor: pointer;
`

const RadioItemWrapper = styled.div`
  position: relative;
`;

const RadioGroupItem = styled.div`
  width: 150px;
  padding: 4px 15px !important;
  background-color: #fff;
  border-radius: 10px;
  font-size: 20px;
  vertical-align: middle;
`;

const RadioGroup = styled.div`
  margin-left: 20px;
  margin-top: 20px;
  padding-left: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  ${extrasmall({
  flexDirection:"column",
  paddingLeft: "0",
  marginTop: "20px" ,
  marginLeft: "0",
})}

`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 5px 10px !important;
  border: none;

  &:focus {
    outline: none;
  }
`;

const Legend = styled.span`
  border-radius: 5px;
  padding: 0 5px !important;
  color: ${mainColor};
  font-size: 20px;
`;


const Fieldset = styled.div`
  width: 95%;
  height: 50%;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #E6E8EB;
  border-radius: 10px;
  background-color: #fff;
  position: relative;
  margin: 20px auto;
  overflow: hidden;
  box-shadow: 0 3px 20px rgb(0 0 0 / 4%);
`;

const Form = styled.form`
  width: 100%;
`;

const Container = styled.div`
  height: 100%;
  min-height: 500px;
  border-radius: 10px;
  margin-top: 10px !important;
  padding: 5px 10px !important;
`;


export default DekanMessages;