import React, {useEffect, useState} from 'react';
import avatar from "./../../utills/images/avatar-rm.png"

const Conversation = ({data, currentUser, online}) => {
  const [userData,setUserData] = useState(null);

  useEffect(() => {

      const userId = data?.members?.find(user => user.id!==currentUser);
      console.log(userId);
      setUserData(userId);

  },[])

  return (
    <>
      <div className="follower conversation">
        <div>
          {online && <div className="online-dot"></div>}
          <img src={userData?.profilePicture ? "API URL" : avatar} alt=""
            className="followerImage"
               style={{width: "50px",height:"50px"}}
          />
          <div className="name" style={{fontSize: "0.8rem"}}>
            <span>{userData?.fullName}</span>
            <span>{online?"Online":"Offline"}</span>
          </div>
        </div>
      </div>
      <hr style={{width:"85%",border: '0.1px solid #ececec'}}/>
    </>
  );
};

export default Conversation;