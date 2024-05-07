import { CompatClient, Stomp } from '@stomp/stompjs';
import React, { useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { SocketClient, connect, generateSocketClient } from '../util/socket';

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
      alert('userId is not number');
      return;
    }
    const client = connect(generateSocketClient(userId));
    await setSocketClient(client);
  };

  const sendToUser = async () => {
    const chatRoom = await fetch('http://localhost:8080/chat/room?userIdList=1&userIdList=2')
      .then(async (res) => await res.json())
      .catch((err) => console.log(err));
    const chatRoomId = chatRoom.data.id;
    console.log(chatRoom.data.id);
    await socketClient?.client.subscribe('/queue/chat/' + chatRoomId, (message) => {
      const binaryBodyArray = Object.values(message.binaryBody);
      // 배열의 각 원소를 ASCII 코드로 간주하고 이를 문자열로 디코딩
      const decodedMessage = String.fromCharCode(...binaryBodyArray);
      console.log(decodedMessage);
    });
    await socketClient?.client.send(
      '/app/chat',
      {},
      JSON.stringify({
        roomId: chatRoomId,
        content: 'Hello World',
      })
    );
  };

  return (
    <div>
      <input type="text" onChange={inputHandler} ref={inputRef} />
      <button onClick={connectHandler}>connect</button>
      <button onClick={sendToUser}>getRoomId</button>
    </div>
  );
};

export default ChatPage;
