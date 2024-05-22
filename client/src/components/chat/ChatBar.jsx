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

Room.propTypes = {
  room: PropTypes.object,
  socket: PropTypes.object,
};

function User({ user, socket }) {
  return (
    <div className={`chat_user_item`}>
      {user.userName}
      {socket.id === user.socketID ? <> (you)</> : <></>}
    </div>
  );
}

function Room({ room, socket }) {
  const { setSelectedId, selectedId } = useContext(ChatContext);
  const [isClick, setIsClick] = useState(false);

  useEffect(() => {
    if (selectedId === room.id) {
      setIsClick(true);
    } else {
      setIsClick(false);
    }
  }, [room, selectedId]);

  const handleClick = () => {
    setSelectedId(room.id);
    socket.emit("join room", { roomid: room.id });
    socket.emit("get rooms");
  };
  return (
    <div
      className={isClick ? `room_item clicked` : `room_item`}
      onClick={handleClick}
    >
      {room.name}
    </div>
  );
}

export default function ChatBar({ socket }) {
  const { users, setUsers, rooms } = useContext(ChatContext);
  useEffect(() => {
    socket.on("newUserResponse", (data) => setUsers(data));
  }, [socket, users, setUsers]);

  return (
    <div className="chat__sidebar">
      <h2>Open Chat</h2>
      <div>
        <h4 className="chat__header">ACTIVE USERS</h4>
        <div className="chat__users">
          {users
            .sort((a, b) => {
              if (a.socketID === socket.id) return -1;
              if (b.socketID === socket.id) return 1;
              if (a.userName < b.userName) return -1;
              return a.userName > b.userName ? 1 : 0;
            })
            .map((user) => (
              <User key={user.socketID} user={user} socket={socket} />
            ))}
        </div>
      </div>
      <div>
        <h4 className="chat__header">ROOMS</h4>
        <div className="chat__users">
          {rooms.map((room) => (
            <Room key={room.id} room={room} socket={socket} />
          ))}
        </div>
      </div>
    </div>
  );
}
