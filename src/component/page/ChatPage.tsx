import { CompatClient, Stomp } from "@stomp/stompjs";
import React, { useRef, useState } from "react";
import SockJS from "sockjs-client";
import { SocketClient, generateSocketClient } from "../../util/socket";
import { request } from "http";

const ChatPage = () => {
  const [socketClient, setSocketClient] = useState<SocketClient>();
  const [input, setInput] = useState<string>();
  const [userId, setUserId] = useState<number>(-1);
  const [recvId, setRecvId] = useState<number>(-1);
  const [chatList, setChatList] = useState<any[]>([]);
  const [roomId, setRoomId] = useState<number>(-1);

  const senderHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.currentTarget.value;
    if (isNaN(parseInt(target))) return;
    await setUserId(parseInt(target));
  };

  const receiverHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.currentTarget.value;
    if (isNaN(parseInt(target))) return;
    await setRecvId(parseInt(target));
  };

  const chatInputHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.currentTarget.value;
    await setInput(target);
  };

  const connectHandler = async () => {
    console.log(userId);
    if (isNaN(userId) || userId < 0) {
      alert("userId is not number");
      return;
    }
    const client = generateSocketClient(userId);
    await setSocketClient(client);
    const requestPath = `http://localhost:8080/chatroom?userId=${userId}&userId=${recvId}`;
    console.log(requestPath);
    const chatRoom = await fetch(requestPath)
      .then(async (res) => await res.json())
      .catch((err) => console.log(err));
    const chatRoomId = chatRoom.data.id;
    console.log("chat room : " + chatRoomId);
    await setRoomId(chatRoomId);
    await socketClient?.client.subscribe("/queue/chat/" + chatRoomId, (message) => {
      const binaryBodyArray = Object.values(message.binaryBody);
      // 배열의 각 원소를 ASCII 코드로 간주하고 이를 문자열로 디코딩
      const decodedMessage = String.fromCharCode(...binaryBodyArray);
      setChatList((prev) => [...prev, decodedMessage]);
    });
  };

  const sendToUser = async () => {
    if (roomId < 0) return;
    console.log(roomId);
    await socketClient?.client.send(
      "/app/chat",
      {},
      JSON.stringify({
        roomId: roomId,
        senderId: userId,
        content: input,
      })
    );
  };

  return (
    <div>
      <div>
        <div>sender id</div>
        <input type="text" onChange={senderHandler} />
      </div>
      <div>
        <div>receiver id</div>
        <input type="text" onChange={receiverHandler} />
      </div>
      <button onClick={connectHandler}>connect</button>
      <div>
        <input type="text" onChange={chatInputHandler} />
        <button onClick={sendToUser}>send</button>
        <button onClick={() => setChatList([])}>reset</button>
      </div>
      <div>{chatList}</div>
    </div>
  );
};

export default ChatPage;
