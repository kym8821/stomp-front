import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { User } from "./Users";
import { Chat } from "./Chat";

export function generateSocket(roomId: number, user: User) {
  const socket = Stomp.over(() => {
    const sock = new SockJS("http://localhost:8080/ws");
    return sock;
  });
  socket.connect({ user: user.id }, () => {
    const decoder = new TextDecoder("utf-8");
    const chatting = socket.subscribe(`/queue/chatting/${roomId}`, (message) => {
      // ArrayBuffer를 UTF-8 문자열로 변환
      const userMessage = JSON.parse(decoder.decode(message.binaryBody));
      console.log(`received msg : ${userMessage.content}`);
      console.log(userMessage);
      const newChat = {
        id: userMessage.chatId,
        unread: 1,
        userId: userMessage.senderId,
        chatRoomId: roomId,
        content: userMessage.content,
      } as Chat;
    });
    const chat = socket.subscribe(`/queue/chat/`, (message) => {
      const chatMessage = JSON.parse(decoder.decode(message.binaryBody));
      console.log(chatMessage);
    });
  });
}
