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
        onClick={() =>
          socket.emit("message_send", {
            sender: "000000000000000000000001",
            receiver: "000000000000000000000002",
            text: "hii dear",
          })
        }
      >
        Send Test Message
      </button>

      <div>
        {messages.map((msg) => (
          <p key={msg._id}>{msg.text}</p>
        ))}
      </div>
    </>
  );
}

export default Dashboard;
