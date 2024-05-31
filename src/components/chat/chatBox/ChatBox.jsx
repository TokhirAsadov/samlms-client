import React, {useEffect, useRef, useState} from 'react';
import './ChatBox.css'
import avatar from "../../../utills/images/avatar-rm.png";
import {addMessage, getMessages} from "../../../api/MessageRequest";
import {format} from "timeago.js";
import InputEmoji from 'react-input-emoji'

const ChatBox = ({chat, currentUserId, setSendMessage,receiveMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages,setMessages] = useState([]);
  const [newMessage,setNewMessage] = useState("");
  const scroll = useRef();

  useEffect(()=>{
    if (receiveMessage!==null && receiveMessage?.chatId===chat?.id){
      setMessages([...messages,receiveMessage])
    }
  },[receiveMessage])

  useEffect(() => {
    const userId = chat?.members?.find(user => user.id!==currentUserId);
    console.log(userId);
    setUserData(userId);

  },[chat,currentUserId])

  useEffect(()=>{
    const fetchMessages = async () => {
      try {
        const {data} = await getMessages(chat.id);
        console.log(data?.obj,"message");
        setMessages(data?.obj);
      }catch (error){
        console.log(error)
      }
    }
    if (chat !== null) fetchMessages();
  },[chat])

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  }

  const handleSend = async (e) => {
    e.preventDefault();
    const message = {
      senderId: currentUserId,
      text: newMessage,
      chatId: chat?.id,
    }

    try {
      const {data} = await addMessage(message);
      setMessages([...messages,data?.obj]);
      setNewMessage("");

    }catch (e) {
      console.log(e)
    }

    // send message to socket server
    const receiverUser = chat?.members?.find(user => user?.id!==currentUserId);
    const receiverId = receiverUser?.id;
    setSendMessage({...message,receiverId})
  }

  // Always scroll to lat message
  useEffect(() => {
    scroll.current?.scrollIntoView({behavior: "smooth"})
  },[messages]);

  return (
    <>
      <div className="ChatBox-container">
        {chat ? (
          <>
          <div className="chat-header">
            <div className="follower">
              <div>
                <img src={userData?.profilePicture ? "API URL" : avatar} alt=""
                     className="followerImage"
                     style={{width: "50px",height:"50px"}}
                />
                <div className="name" style={{fontSize: "0.8rem"}}>
                  <span>{userData?.fullName}</span>
                </div>
              </div>
            </div>
            <hr style={{width:"85%",border: '0.1px solid #ececec'}}/>
          </div>

          {/*  chatBox Messages*/}
          <div className="chat-body">
            {messages?.map(message => (
                <div key={message?.id}
                     ref={scroll}
                     className={
                       message?.senderId === currentUserId ? "message own" : "message"
                     }
                >
                  <span>{message?.text}</span>
                  <span>{format(message?.createdAt)}</span>
                </div>
            ))}
          </div>


          {/*  chat-sender */}
          <div className="chat-sender">
            <div>+</div>
            <InputEmoji
              value={newMessage}
              onChange={handleChange}
            />
            <div className="send-button button" onClick={handleSend}>Send</div>
          </div>
        </>
        ) : (
          <span className="chatbox-empty-message">Tap on a Chat to start Conversation...</span>
        )}
      </div>
    </>
  );
};

export default ChatBox;