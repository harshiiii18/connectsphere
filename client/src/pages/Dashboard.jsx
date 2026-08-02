import { useEffect } from "react";
import { useState } from "react";
import socket from "../socket";
import api from "../api/axios";

function Dashboard() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("user-connected", user.id);
    });

    socket.on("reply", (data) => {
      console.log("Message received:", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on("user-online", (userId) => {
      console.log("User online:", userId);
    });

    socket.on("user-offline", (userId) => {
      console.log("User offline:", userId);
    });

    socket.on("user-typing", (senderId) => {
      setTypingUser(senderId);
      setTimeout(() => setTypingUser(null), 2000);
    });

    return () => {
      socket.off("connect");
      socket.off("reply");
      socket.off("user-online");
      socket.off("user-offline");
    };
  }, []);

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [typingUser, setTypingUser] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await api.get("/messages");
      console.log("Fetched:", res.data);
      setMessages(res.data);
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await api.get("/auth/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(res.data);
      console.log(users);
    };
    fetchUsers();
  }, []);

  return (
    <>
      <h2>Dashboard - Coming soon!</h2>

      <div>
        <h3>Contacts</h3>
        <p>Selected: {selectedUser ? selectedUser.name : "None"}</p>
        {users.map((u) => (
          <p key={u._id} onClick={() => setSelectedUser(u)}>
            {u.name}
          </p>
        ))}
      </div>

      <button
        onClick={() => {
          if (messageText.trim() === "") return;
          if (!selectedUser) return;
          socket.emit("message_send", {
            sender: user.id,
            receiver: selectedUser._id,
            text: messageText,
          });
          setMessageText("");
        }}
      >
        Send
      </button>
      {typingUser && <p>Typing...</p>}
      <div>
        {messages
          .filter(
            (msg) =>
              selectedUser &&
              ((msg.sender === user.id && msg.receiver === selectedUser._id) ||
                (msg.sender === selectedUser._id && msg.receiver === user.id)),
          )
          .map((msg) => (
            <p key={msg._id}>{msg.text}</p>
          ))}

        <input
          type="text"
          value={messageText}
          onChange={(e) => {
            setMessageText(e.target.value);
            socket.emit("typing", {
              senderId: user.id,
              receiverId: selectedUser._id,
            });
          }}
          placeholder="Type a message"
        />
      </div>
    </>
  );
}

export default Dashboard;
