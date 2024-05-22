import "../styles/ChatPage.css";
import { useEffect, useState, useRef } from "react";

import ChatBar from "./chat/ChatBar";
import ChatBody from "./chat/ChatBody";
import ChatFooter from "./chat/ChatFooter";
import PropTypes from "prop-types";

import { ChatContext } from "../utils/contextProvider";

ChatPage.propTypes = {
  socket: PropTypes.object,
};

export default function ChatPage({ socket }) {
  const [typingStatus, setTypingStatus] = useState("");
  const lastMessageRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    //request for initial room data
    socket.emit("get rooms");
  }, [socket]);

  useEffect(() => {
    //populate initial room data
    socket.on("roomsResponse", (data) => {
      setRooms(data);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("typingResponse", (data) => setTypingStatus(data));
  }, [socket]);

  useEffect(() => {
    socket.on("messageResponse", (rooms) => {
      setRooms(rooms);
    });
  }, [selectedId, socket, rooms]);

  useEffect(() => {
    //scrolls to bottom when messages change
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const getMessages = () => {
    const selectedRoom = rooms.find((room) => room.id === selectedId);
    if (selectedRoom) {
      return selectedRoom.messages;
    } else {
      return [];
    }
  };

  return (
    <ChatContext.Provider
      value={{ users, setUsers, selectedId, setSelectedId, rooms, setRooms }}
    >
      <div className="chat">
        <ChatBar socket={socket} />
        <div className="chat__main">
          {selectedId.trim() ? (
            <ChatBody
              messages={getMessages()}
              typingStatus={typingStatus}
              lastMessageRef={lastMessageRef}
            />
          ) : (
            <></>
          )}
          {selectedId.trim() ? <ChatFooter socket={socket} /> : <></>}
        </div>
      </div>
    </ChatContext.Provider>
  );
}
