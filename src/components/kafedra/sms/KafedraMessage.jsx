import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {
    BASE_URL,
    color_2,
    DEKAN,
    KAFEDRA,
    mainColor,
    navbarHeight,
    TOKEN,
    TokenType
} from "../../../utills/ServiceUrls";
import axios from "axios";
import {toast} from "react-toastify";
import {FaSearch} from "react-icons/fa";
import {useSelector} from "react-redux";
import {extrasmall} from "../../../responsiv";
import ButtonMui from "@mui/material/Button";
import {BiMailSend} from "react-icons/bi";
import {useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";

const KafedraMessage = () => {
    const kafedra = useSelector(state => state?.section?.section);
    const [smsType, setSMSType] = useState("ALL_TEACHER");
    const [search, setSearch] = useState("");
    const [fullName, setFullName] = useState("");
    const navigate=useNavigate()
    const [searchUsers, setSearchUsers] = useState([]);

    const [messageBody, setMessageBody] = useState("");
    const [userId, setUserId] = useState("");

    const [sms, setSMS] = useState({
        messageBody,
        smsType,
        status: "SENDING",
        userId
    });


    const handleSearch = () => {
        console.log(search, " search  ================================  handleSearch")
        if (search !== "" && search.length > 2) {
            const token = localStorage.getItem(TOKEN)
            const headers = {
                'Authorization': TokenType + token,
                'Access-Control-Allow-Origin': '*'
            }
            axios.get(BASE_URL + KAFEDRA.GET_TEACHERS_FOR_SEND_SMS + "?search=" + search + "&kafedraId=" + kafedra?.id, {headers})
                .then(res => {

                    if (res.data?.length !== 0) {

                        setSearchUsers(() => res.data)
                    } else {
                        setFullName("");
                        alert("⚠️ Not fount user!...😔");
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        } else {
            alert("Enter search param")
        }
    }

    useEffect(() => {

        if (search.length < 3) {
            setSearchUsers([]);
        } else {
            const token = localStorage.getItem(TOKEN)
            const headers = {
                'Authorization': TokenType + token,
                'Access-Control-Allow-Origin': '*'
            }
            axios.get(BASE_URL + DEKAN.GET_USER_SEARCHING_FOR_DEKAN + search, {headers})
                .then(res => {
                    if (res.data?.length !== 0) {

                        setSearchUsers(() => res.data)
                    } else {
                        setSearchUsers([])

                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [search])

    useEffect(() => {
        setSMS((prev) => ({...prev, messageBody}))
    }, [messageBody]);

    useEffect(() => {
        setSMS((prev) => ({...prev, smsType}))
    }, [smsType]);

    useEffect(() => {
        setSMS((prev) => ({...prev, userId}))
    }, [userId]);

    const onSubmit = (e) => {
        e.preventDefault();

        switch (smsType) {
            case "ALL_TEACHER":
                setUserId(null)
                messageBody === ""
                    ?
                    alert("Error, empty message of sms...")
                    :
                    sendSMS()
                break;
            case "TEACHER":
                userId !== "" && messageBody !== ""
                    ?
                    sendSMS()
                    :
                    alert("Error, empty message of sms or do not choose teacher...")
                break;
            default:
                console.log("default")
        }
    }

    const sendSMS = () => {
        const token = localStorage.getItem(TOKEN)
        const headers = {
            'Authorization': TokenType + token,
            'Access-Control-Allow-Origin': '*'
        }
        axios.post(BASE_URL + DEKAN.SMS_CREATE, sms, {headers})
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
                gap: "15px",
                alignItems: 'center',
                flexWrap: 'wrap',
            }}>
                <Legend>Message: {smsType === "TEACHER" ? smsType + " " + fullName : smsType}</Legend>
                <ButtonMui
                    component={smStyle}
                    onClick={() => navigate('smsHistory')}
                    variant={'contained'}
                    endIcon={<BiMailSend size={25}/>}>message history</ButtonMui>
            </Box>

            <Form onSubmit={(e) => onSubmit(e)}>
                <Fieldset>
                    <Textarea
                        name={messageBody}
                        value={messageBody}
                        onChange={(e) => setMessageBody(e.target.value)}
                    />
                </Fieldset>

                <Section>
                    <RadioGroup>
                        <RadioGroupItem>
                            <Radio id="all" name="type" checked={smsType === "ALL_TEACHER"}
                                   onChange={() => setSMSType(() => "ALL_TEACHER")}/>
                            <Label htmlFor="all">All</Label>
                        </RadioGroupItem>
                        <RadioItemWrapper>
                            <RadioGroupItem>
                                <Radio id="teacher" name="type" onChange={() => setSMSType(() => "TEACHER")}/>
                                <Label htmlFor="teacher">Teacher</Label>
                            </RadioGroupItem>
                            <Boxradio>
                                {
                                    smsType === "TEACHER" &&
                                    <SearchContainer>
                                        <SearchWrapper>
                                            <SearchInput value={search} onChange={(e) => setSearch(e.target.value)}
                                                         placeholder={"UserID or Passport"}/>
                                            <SearchButton onClick={handleSearch}><FaSearch/></SearchButton>
                                        </SearchWrapper>

                                        <SearchUsers opacity={searchUsers.length > 0 ? 1 : 0}
                                                     style={{display: "block", position: "absolute", top: "35px"}}>
                                            {
                                                searchUsers?.map(item => {
                                                    return <SearchUser
                                                        key={item?.id}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setUserId(item?.id);
                                                            setFullName(item?.fullName);
                                                            setSearch("");
                                                        }}
                                                    >
                                                        <SearchUserFullName>{item?.fullName}</SearchUserFullName>
                                                        {/*<SearchUserRole>{item.groupData.name}</SearchUserRole>*/}
                                                    </SearchUser>
                                                })
                                            }
                                        </SearchUsers>
                                    </SearchContainer>
                                }
                            </Boxradio>
                        </RadioItemWrapper>
                    </RadioGroup>
                    <Button onClick={() => console.log(sms, "sms")}>Send</Button>
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
  position: relative;
  display: flex;
  flex-direction: column;
`;

const SearchWrapper = styled.div`
  width: 150px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  background-color: #fff;
`;



const Section = styled.section`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  ${extrasmall({
    flexDirection: "column"
  })}
`;

const Boxradio = styled.div`
  position: absolute;
  top: 45px;
  z-index: 5;
`
const Button = styled.button`
  padding: 4px 35px;
  background-color: ${mainColor};
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 20px;
  box-shadow: rgba(99, 99, 99, 0.2) 0 2px 8px 0;

  ${extrasmall({
    padding: "6px 45px",
    margin: "35px auto",
  })}
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
  display: flex;
  position: relative;
`;

const RadioGroupItem = styled.div`
  width: 150px;
  padding: 4px 15px !important;
  background-color: #fff;
  border-radius: 10px;
  font-size: 20px;
  vertical-align: middle;
  box-shadow: rgba(99, 99, 99, 0.2) 0 2px 8px 0;
`;

const RadioGroup = styled.div`
  margin-left: 20px;
  margin-right: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  ${extrasmall({

    margin: 0,
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
  padding: 1rem !important;
`;

export default KafedraMessage;