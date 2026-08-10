import { useEffect, useState } from "react";
import socket from "../socket";
import api from "../api/axios";

function Dashboard() {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [typingUser, setTypingUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("user-connected", user.id);
    });
    socket.on("reply", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    socket.on("user-online", (userId) => {
      setOnlineUsers((prev) => [...new Set([...prev, userId])]);
    });
    socket.on("user-offline", (userId) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
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
      socket.off("user-typing");
    };
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await api.get("/messages");
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
    };
    fetchUsers();
  }, []);

  const conversationUserIds = new Set();
  messages.forEach((msg) => {
    if (msg.sender === user.id) conversationUserIds.add(msg.receiver);
    if (msg.receiver === user.id) conversationUserIds.add(msg.sender);
  });
  const conversationUsers = users.filter((u) => conversationUserIds.has(u._id));

  const getLastMessage = (userId) => {
    const relevant = messages.filter(
      (m) =>
        (m.sender === user.id && m.receiver === userId) ||
        (m.sender === userId && m.receiver === user.id)
    );
    return relevant[relevant.length - 1];
  };

  const searchResults = users.filter(
    (u) =>
      u._id !== user.id &&
      u.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const avatarUrl = (name) =>
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      name
    )}&backgroundColor=6c5ce7,8b7cf6&textColor=ffffff`;

  const renderUserRow = (u) => {
    const isOnline = onlineUsers.includes(u._id);
    const lastMsg = getLastMessage(u._id);
    return (
      <div
        key={u._id}
        onClick={() => {
          setSelectedUser(u);
          setShowNewChat(false);
          setSearchText("");
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 8px",
          borderRadius: "10px",
          cursor: "pointer",
          background: selectedUser?._id === u._id ? "#1c1c24" : "transparent",
          marginBottom: "4px",
        }}
      >
        <div style={{ position: "relative", flexShrink: 0 }}>
          <img
            src={avatarUrl(u.name)}
            alt={u.name}
            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
          />
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: isOnline ? "#23a55a" : "#5a5a66",
              position: "absolute",
              bottom: 0,
              right: 0,
              border: "2px solid #111116",
            }}
          />
        </div>
        <div style={{ overflow: "hidden", flex: 1 }}>
          <div
            style={{
              color: "#fff",
              fontWeight: "600",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {u.name}
          </div>
          {lastMsg && (
            <div
              style={{
                color: "#9a9aa5",
                fontSize: "13px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {lastMsg.text}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#0a0a0f",
        backgroundImage:
          "radial-gradient(circle 600px at 15% 0%, rgba(108, 92, 231, 0.15), transparent)",
        fontFamily: "sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "300px",
          flexShrink: 0,
          background: "#111116",
          borderRight: "1px solid #2a2a35",
          padding: "16px",
          color: "#dcddde",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h3 style={{ color: "#fff", margin: 0 }}>Chats</h3>
          <button
            onClick={() => setShowNewChat(!showNewChat)}
            style={{
              background: "#6c5ce7",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            {showNewChat ? "×" : "+"}
          </button>
        </div>

        {showNewChat && (
          <input
            type="text"
            placeholder="Search users..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            autoFocus
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              border: "1px solid #2a2a35",
              outline: "none",
              background: "#1a1a22",
              color: "#fff",
              marginBottom: "12px",
            }}
          />
        )}

        <div style={{ overflowY: "auto", flex: 1 }}>
          {showNewChat
            ? searchResults.map(renderUserRow)
            : conversationUsers.length > 0
            ? conversationUsers.map(renderUserRow)
            : (
              <p style={{ color: "#72767d", fontSize: "14px" }}>
                No chats yet. Tap + to start one.
              </p>
            )}
        </div>
      </div>

      {/* Chat area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#0d0d12",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid #2a2a35",
            color: "#fff",
            fontWeight: "bold",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {selectedUser && (
            <img
              src={avatarUrl(selectedUser.name)}
              alt={selectedUser.name}
              style={{ width: "30px", height: "30px", borderRadius: "50%" }}
            />
          )}
          {selectedUser ? selectedUser.name : "Select a contact"}
        </div>

        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "20px" }}>
          {messages
            .filter(
              (msg) =>
                selectedUser &&
                ((msg.sender === user.id && msg.receiver === selectedUser._id) ||
                  (msg.sender === selectedUser._id && msg.receiver === user.id))
            )
            .map((msg) => (
              <div
                key={msg._id}
                style={{
                  display: "flex",
                  justifyContent: msg.sender === user.id ? "flex-end" : "flex-start",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: msg.sender === user.id ? "flex-end" : "flex-start",
                    maxWidth: "60%",
                  }}
                >
                  <p
                    style={{
                      background: msg.sender === user.id ? "#6c5ce7" : "#1c1c24",
                      color: "white",
                      padding: "10px 14px",
                      borderRadius: "16px",
                      width: "fit-content",
                      wordBreak: "break-word",
                      margin: 0,
                      border: msg.sender === user.id ? "none" : "1px solid #2a2a35",
                    }}
                  >
                    {msg.text}
                  </p>
                  <span style={{ fontSize: "11px", color: "#72767d", marginTop: "3px" }}>
                    {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
          {typingUser && (
            <p style={{ color: "#8b7cf6", paddingLeft: "8px", fontSize: "13px" }}>
              Typing...
            </p>
          )}
        </div>

        <div style={{ display: "flex", padding: "16px 20px", gap: "10px", flexShrink: 0 }}>
          <input
            type="text"
            value={messageText}
            onChange={(e) => {
              setMessageText(e.target.value);
              if (selectedUser) {
                socket.emit("typing", {
                  senderId: user.id,
                  receiverId: selectedUser._id,
                });
              }
            }}
            placeholder="Type a message"
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "20px",
              border: "1px solid #2a2a35",
              outline: "none",
              background: "#1a1a22",
              color: "#fff",
            }}
          />
          <button
            onClick={() => {
              if (messageText.trim() === "") return;
              if (!selectedUser) return;
              const newMsg = {
                _id: Date.now().toString(),
                sender: user.id,
                receiver: selectedUser._id,
                text: messageText,
              };
              setMessages((prev) => [...prev, newMsg]);
              socket.emit("message_send", newMsg);
              setMessageText("");
            }}
            style={{
              padding: "12px 24px",
              borderRadius: "20px",
              border: "none",
              background: "#6c5ce7",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;