import { CompatClient, Stomp } from "@stomp/stompjs";
import React, { useRef, useState } from "react";
import SockJS from "sockjs-client";
import { SocketClient, connect, generateSocketClient } from "../util/socket";

const ChatPage = () => {
  const [socketClient, setSocketClient] = useState<SocketClient>();
  const [userId, setUserId] = useState<number>(-1);
  const inputRef = useRef(null);

  const inputHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.currentTarget.value;
    if (isNaN(parseInt(target))) return;
    await setUserId(parseInt(target));
  };

  const connectHandler = async () => {
    console.log(userId);
    if (isNaN(userId) || userId < 0) {
      alert("userId is not number");
      return;
    }
    const client = connect(generateSocketClient(userId));
    await setSocketClient(client);
  };

  return (
    <div>
      <input type="text" onChange={inputHandler} ref={inputRef} />
      <button onClick={connectHandler}>connect</button>
    </div>
  );
};

export default ChatPage;
