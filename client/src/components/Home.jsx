import { useState } from "react";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

Home.propTypes = {
  socket: PropTypes.object,
};

function Home({ socket }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem("userName", userName);

    //tells server user has signed in
    socket.emit("newUser", {
      userName,
      socketID: socket.id,
    });
    navigate("/chat");
  };
  return (
    <form className="home__container" onSubmit={handleSubmit}>
      <h2 className="home__header">Sign in to Open Chat</h2>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        minLength={6}
        name="username"
        id="username"
        className="username__input"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <button className="home__cta">SIGN IN</button>
    </form>
  );
}

export default Home;
