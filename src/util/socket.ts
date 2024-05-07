import { CompatClient, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export interface SocketClient {
  userId: Number;
  client: CompatClient;
}

export const generateSocketClient = (userId: Number) => {
  return {
    userId: userId,
    client: Stomp.over(() => {
      const sock = new SockJS("http://localhost:8080/ws");
      return sock;
    }),
  } as SocketClient;
};

function socketErrorHandler() {
  console.log("connection failed...");
}

function socketColsureHandler() {
  console.log("connection closed");
}

export const connect = (socketClient: SocketClient) => {
  socketClient.client.connect(
    { user: socketClient.userId },
    () => {
      // callback 함수 설정, 대부분 여기에 sub 함수 씀
      console.log("connect success!");
      socketClient.client?.subscribe(`/topic/notice`, (message) => {
        console.log(message);
      });
      socketClient.client?.subscribe(`/user/queue/sendToUser`, (message) => {
        console.log(message);
      });
      socketClient.client?.subscribe(`/user/${socketClient.userId}/queue/sendToUser`, (message) => {
        console.log(message);
      });
    },
    socketErrorHandler,
    socketColsureHandler
  );
  return socketClient;
};
