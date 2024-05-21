import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { ChatContext } from "../../utils/contextProvider";

ChatBar.propTypes = {
  socket: PropTypes.object,
};

User.propTypes = {
  user: PropTypes.object,
  socket: PropTypes.object,
};

function User({ user, socket }) {
  const [isClick, setIsClick] = useState(false);
  const handleClick = () => {
    //TODO
  };
  return (
    <div
      className={isClick ? `chat_user_item clicked` : `chat_user_item`}
      onClick={handleClick}
    >
      {user.userName}
      {socket.id === user.socketID ? <> (you)</> : <></>}
      {user.hasNewMsgs === true ? <>(new)</> : <></>}
    </div>
  );
}

export default function ChatBar({ socket }) {
  const { users, setUsers } = useContext(ChatContext);
  useEffect(() => {
    socket.on("newUserResponse", (data) => setUsers(data));
  }, [socket, users, setUsers]);

  return (
    <div className="chat__sidebar">
      <h2>Open Chat</h2>
      <div>
        <h4 className="chat__header">ACTIVE USERS</h4>
        <div className="chat__users">
          {users.map((user) => (
            <User key={user.socketID} user={user} socket={socket} />
          ))}
        </div>
      </div>
    </div>
  );
}
