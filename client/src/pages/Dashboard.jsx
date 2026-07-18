import { useEffect } from "react";
import socket from "../socket";

function Dashboard() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });
    socket.on("reply", (data) => {
      console.log("Message received:", data);
    });
    return () => {
      socket.off("connect");
    };
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
    </>
  );
}

export default Dashboard;
