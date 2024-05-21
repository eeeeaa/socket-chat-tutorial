import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

ChatBody.propTypes = {
  messages: PropTypes.array,
  typingStatus: PropTypes.string,
  lastMessageRef: PropTypes.object,
};

export default function ChatBody({ messages, typingStatus, lastMessageRef }) {
  const navigate = useNavigate();

  const handleLeaveChat = () => {
    //log out
    sessionStorage.removeItem("userName");
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <header className="chat__mainHeader">
        <p>Hangout with Colleagues</p>
        <button className="leaveChat__btn" onClick={handleLeaveChat}>
          LEAVE CHAT
        </button>
      </header>

      <div className="message__container">
        {messages.map((message) =>
          message.name === sessionStorage.getItem("userName") ? (
            <div className="message__chats" key={message.id}>
              <p className="sender__name">You</p>
              <div className="message__sender">
                <p>{message.text}</p>
              </div>
            </div>
          ) : (
            <div className="message__chats" key={message.id}>
              <p>{message.name}</p>
              <div className="message__recipient">
                <p>{message.text}</p>
              </div>
            </div>
          )
        )}

        <div className="message__status">
          <p>{typingStatus}</p>
        </div>
        <div ref={lastMessageRef}></div>
      </div>
    </>
  );
}
