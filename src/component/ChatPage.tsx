import { CompatClient, Stomp } from "@stomp/stompjs";
import React, { useRef, useState } from "react";
import SockJS from "sockjs-client";

interface SocketClient {
  username: string;
  client: CompatClient;
}

const GenerateClient = (username: string) => {
  return {
    username: username,
    client: Stomp.over(() => {
      const sock = new SockJS("http://localhost:8080/ws");
      return sock;
    }),
  } as SocketClient;
};

const MainPage = () => {
  const inputRef = useRef(null);
  const [message, setMessage]: any = useState(undefined);
  const [messageContent, setMessageContent]: any = useState("hello");
  const [socketClients, setSocketClients]: any = useState([GenerateClient("kym8821"), GenerateClient("louie9798")]);

  const connectSocket = (socketClient: SocketClient) => {
    socketClient.client.connect(
      { user: socketClient.username },
      () => {
        // callback 함수 설정, 대부분 여기에 sub 함수 씀
        console.log("connect success!");
        socketClient.client?.subscribe(`/topic/notice`, (message) => {
          console.log(message);
          setMessage(message.body);
        });
        socketClient.client?.subscribe(`/user/queue/sendToUser`, (message) => {
          console.log(message);
          setMessage(message.body);
        });
        socketClient.client?.subscribe(`/user/${socketClient.username}/queue/sendToUser`, (message) => {
          console.log(message);
          setMessage(message.body);
        });
      },
      () => {
        console.log("connection failed...");
      },
      () => {
        console.log("connection closed");
      }
    );
  };

  const connectHandler = () => {
    socketClients.map(async (socketClient: SocketClient) => {
      console.log("connect " + socketClient.username);
      await connectSocket(socketClient);
    });
  };

  const sendHandler = () => {
    socketClients.map((socketClient: SocketClient) => {
      if (!socketClient.client) return;
      console.log(socketClient.username);
      socketClient.client.send(
        "/app/notice",
        {
          user: socketClient.username,
        },
        JSON.stringify({
          message: "send to everybody",
        })
      );
    });
  };

  const sendToUserHandler = () => {
    const senderClient = socketClients[0].client;
    if (!senderClient) return;
    senderClient.send(
      "/app/sendToUser",
      {},
      JSON.stringify({
        message: "send to user",
        username: "louie9798",
      })
    );
  };

  const disconnectHandler = () => {
    socketClients.map(async (socketClient: SocketClient) => {
      const client = socketClient.client;
      if (!client) return;
      client.disconnect();
    });
  };

  const inputHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.currentTarget.value;
    await setMessageContent(target);
    console.log(messageContent);
  };

  return (
    <div>
      <div>{message}</div>
      <input type="text" ref={inputRef} onChange={inputHandler} />
      <button onClick={connectHandler}>connect</button>
      <button onClick={sendHandler}>submit</button>
      <button onClick={sendToUserHandler}>submitToUser</button>
      <button onClick={disconnectHandler}>disconnect</button>
    </div>
  );
};

export default MainPage;
