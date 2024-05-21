import "./styles/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";

import Home from "./components/Home";
import ChatPage from "./components/ChatPage";

const socket = io("http://localhost:4000");

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home socket={socket} />}></Route>
          <Route path="/chat" element={<ChatPage socket={socket} />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
