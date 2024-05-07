import { CompatClient, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface SocketClient {
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
