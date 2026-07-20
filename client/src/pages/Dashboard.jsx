import { useEffect } from "react";
import { useState } from "react";
import socket from "../socket";
import api from "../api/axios";

function Dashboard() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });
    socket.on("reply", (data) => {
      console.log("Message received:", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    return () => {
      socket.off("connect");
    };
  }, []);

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await api.get("/messages");
      console.log("Fetched:", res.data);
      setMessages(res.data);
    };
    fetchMessages();
  }, []);

  return (
    <>
      <h2>Dashboard - Coming soon!</h2>

      <button
        onClick={() => {
          if (messageText.trim() === "") return;
          socket.emit("message_send", {
            sender: user.id,
            receiver: "000000000000000000000002",
            text: messageText,
          });
          setMessageText("");
        }}
      >
        Send
      </button>
      <div>
        {messages.map((msg) => (
          <p key={msg._id}>{msg.text}</p>
        ))}

        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message"
        />
      </div>
    </>
  );
}

export default Dashboard;
