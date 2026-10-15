import { useEffect } from "react";

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => {
      connection.disconnect();
    }
  }, [])

  return <h1>Welcome to the chat!</h1>;
}

function createConnection() {
  return {
    connect() {
      console.log("Connecting to the chat server");
    },
    disconnect() {
      console.log("Disconnected from the chat server");
    },
  }
}
