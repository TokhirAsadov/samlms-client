import React, {useEffect, useRef, useState} from 'react';
import styled from "styled-components";
import './Chat.css'
import {useSelector} from "react-redux";
import {userChats} from "../../api/ChatRequest";
import Conversation from "../../components/chat/Conversation";
import ChatBox from "../../components/chat/chatBox/ChatBox";
import {io} from 'socket.io-client';
import Logo from "./../../utills/images/logo.png"
import {Link} from "react-router-dom";
import Home from "./../../utills/images/home.png"
import Comment from "./../../utills/images/comment.png"
import {FiSearch} from "react-icons/fi";


const Chat = () => {

  const user = useSelector(state => state.user.user);

  const [chats, setChats] = useState([]);
  const [currentChat,setCurrentChat] = useState(null);
  const [onlineUsers,setOnlineUsers] = useState([])
  const [sendMessage,setSendMessage] = useState(null)
  const [receiveMessage,setReceiveMessage] = useState(null)

  const [search,setSearch] = useState("");
  const [searchItems,setSearchItems] = useState([]);


  const socket = useRef();


  useEffect(()=>{
    socket.current = io('http://localhost:8800');
    socket.current.emit("new-user-add",user.id);
    socket.current.on('get-users',(users)=>{
      setOnlineUsers(users);
    })
  },[user])


  useEffect(() => {
    const getChats = async () => {
      try {
        const {data} = await userChats(user.id);
        setChats(data?.obj);
      }catch (error){
        console.log(error);
      }
    }
    getChats()
  },[user]);

  // send message to socket server
  useEffect(()=>{
    if (sendMessage!==null){
      socket.current.emit('send-message',sendMessage)
    }
  },[sendMessage])

  // receive message from socket server
  useEffect(()=>{
    socket.current.on("receive-message",(data) => {
      setReceiveMessage(data)
    })
  },[])

  const checkOnlineStatus = (chat) => {
    const chatMember = chat?.members?.find((member) => member?.id !== user.id);
    const online = onlineUsers.find((user) => user?.userId === chatMember?.id);
    return !!online;
  }

  const sendSearch = () => {
    if (search?.length >= 3){
      console.log(search,"search")
    }
    else {
      alert("Please enter at least 3 characters to search...");
      setSearchItems([]);
    }
  }

  return (
    <Container>
      <div className="Chat">


        <div className="Left-side-chat">
          <div className="LogoSearch">
            <img src={Logo} alt="" style={{width:"40px",height:"42px"}} />
            <div className="Search">
              <input type="text" value={search} placeholder="#Explore" onChange={(e) => setSearch(e.target.value)}/>
              <div className="s-icon" onClick={sendSearch}>
                <FiSearch />
              </div>
            </div>
          </div>
          <div className="Chat-container">
            <h2>Chats</h2>
            <div className="Chat-list">
              {chats?.map((chat) => (
                <div key={chat?.id} onClick={() => setCurrentChat(chat)}>
                  <Conversation data={chat} currentUser={user.id} online={checkOnlineStatus(chat)}/>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/*  Right Side */}
        <div className="Right-side-chat">

          <div style={{width: "20rem",alignSelf: 'flex-end'}}>
            <div className="navIcons">
              <Link to="../">
                <img src={Home} alt="" style={{width:"25px",height:"25px"}}/>
              </Link>
              <Link to="../chat">
                <img src={Comment} alt="" />
              </Link>
            </div>
          </div>
        {/*  chat body */}
          <ChatBox receiveMessage={receiveMessage} chat={currentChat} currentUserId={user.id} setSendMessage={setSendMessage}/>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  background-color: #f3f3f3;
  padding: 1rem!important;
`;

export default Chat;