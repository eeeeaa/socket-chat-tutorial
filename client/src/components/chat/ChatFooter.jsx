import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { ChatContext } from "../../utils/contextProvider";

ChatFooter.propTypes = {
  socket: PropTypes.object,
};

export default function ChatFooter({ socket }) {
  const [message, setMessage] = useState("");

  const handleTyping = () => {
    socket.emit("typing", `${sessionStorage.getItem("userName")} is typing`);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    //check if message is not empty and user logged in
    if (message.trim() && sessionStorage.getItem("userName")) {
      const data = {
        text: message,
        name: sessionStorage.getItem("userName"),
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
      };
      socket.emit("message", data);
    }
    setMessage("");
  };
  return (
    <div className="chat__footer">
      <form className="form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Write message"
          className="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleTyping}
        />
        <button className="sendBtn">SEND</button>
      </form>
    </div>
  );
}
