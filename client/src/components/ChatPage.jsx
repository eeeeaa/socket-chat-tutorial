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
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("typingResponse", (data) => setTypingStatus(data));
  }, [socket]);

  useEffect(() => {
    socket.on("messageResponse", ({ data, from }) => {
      setMessages([...messages, data]);
    });
  }, [messages, socket]);

  useEffect(() => {
    //scrolls to bottom when messages change
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <ChatContext.Provider value={{ users, setUsers }}>
      <div className="chat">
        <ChatBar socket={socket} />
        <div className="chat__main">
          <ChatBody
            messages={messages}
            typingStatus={typingStatus}
            lastMessageRef={lastMessageRef}
          />
          <ChatFooter socket={socket} />
        </div>
      </div>
    </ChatContext.Provider>
  );
}
