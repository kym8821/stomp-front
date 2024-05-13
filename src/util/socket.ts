import { CompatClient, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface SocketClient {
  userId: Number;
  client: CompatClient;
}

export const generateSocketClient = (userId: Number) => {
  const socketClient = {
    userId: userId,
    client: Stomp.over(() => {
      const sock = new SockJS('http://localhost:8080/ws');
      return sock;
    }),
  } as SocketClient;
<<<<<<< HEAD

  socketClient.client.connect(
    { user: socketClient.userId },
    () => {
      // callback 함수 설정, 대부분 여기에 sub 함수 씀
      socketClient.client?.subscribe(`/topic`, (message) => {
        console.log(message);
      });
      socketClient.client?.subscribe(`/queue`, (message) => {
        console.log(message);
      });
    },
    socketErrorHandler,
    socketColsureHandler
  );
  return socketClient;
};

function socketErrorHandler() {
  console.log("connection failed...");
}

function socketColsureHandler() {
  console.log("connection closed");
=======

  socketClient.client.connect(
    { user: socketClient.userId },
    () => {
      // callback 함수 설정, 대부분 여기에 sub 함수 씀
      socketClient.client?.subscribe(`/topic`, (message) => {
        console.log(message);
      });
      socketClient.client?.subscribe(`/queue`, (message) => {
        console.log(message);
      });
    },
    socketErrorHandler,
    socketColsureHandler
  );
  return socketClient;
};

function socketErrorHandler() {
  console.log('connection failed...');
}

function socketColsureHandler() {
  console.log('connection closed');
>>>>>>> 3fe4e87e06b0fe23b86ec05c33ab319f2e3b51a9
}
