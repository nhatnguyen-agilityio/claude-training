import { useEffect, useState } from "react";

const DelayMessage = () => {
  const [message, setMessage] = useState("Waiting...")

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage("Hello, this is a delayed message!");
    }, 3000); // 3 seconds delay
    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  return (
    <div>
      <h1>Delayed Message</h1>
      <p>This message will be displayed after a delay.</p>
      <p>{message}</p>
    </div>
  );
}

export default DelayMessage;
