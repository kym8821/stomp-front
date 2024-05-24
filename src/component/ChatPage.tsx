import { ChangeEvent, useEffect, useRef, useState } from "react";
import SimpleLogin from "./SimpleLogin";
import { User } from "../util/Users";
import UserBox from "./UserBox";
import UserListBox from "./UserListBox";
import { send } from "process";
import { CompatClient, Stomp, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { Chat } from "../util/Chat";
import ChatListBox from "./ChatListBox";

interface SocketClient {
  recvId: number;
  roomId: number;
  socket: CompatClient;
}

const ChatPage = () => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const recv = useRef<User>();
  const [userList, setUserList] = useState<User[]>([]);
  const [userListTsx, setUserListTsx] = useState<any[]>([]);
  const [chatList, setChatList] = useState<Chat[]>([]);
  const sender = useRef<SocketClient | undefined>();
  const socketList = useRef<SocketClient[]>([]);
  const [input, setInput] = useState<string>();

  const getCurrentSenderSocket = (receiver: User) => {
    for (let i = 0; i < socketList.current.length; i++) {
      const sock = socketList.current[i];
      if (sock.recvId == receiver.id) return sock;
    }
    return undefined;
  };

  const getChatList = async () => {
    if (!sender.current || !user) return undefined;
    // chatList 요청
    const userChatList: Chat[] | undefined = await fetch(`http://localhost:8080/chat/${sender.current.roomId}`, {
      credentials: "include",
    })
      .then(async (res) => (await res.json()).data)
      .catch((err) => {
        console.log(err);
        return undefined;
      });
    if (!userChatList) return undefined;
    // chatList 읽음표시
    for (let i = 0; i < userChatList.length; i++) {
      const chat = userChatList[i];
      if (chat.unread > 0 && chat.userId != user?.id) {
        sender.current.socket.send(
          `/app/chat/${chat.id}`,
          {},
          JSON.stringify({
            id: chat.id,
            senderId: user.id,
            unread: chat.unread,
          })
        );
      }
    }
    return userChatList;
  };

  const handleRecv = async (_user: User) => {
    if (!user) return;
    sender.current = getCurrentSenderSocket(_user);
    const userChatList: Chat[] | undefined = await getChatList();
    if (!sender.current || !userChatList) return;
    // 상태값 변경
    setChatList(() => userChatList);
    recv.current = _user;
  };

  function updateChatUnread(chatMessage: any) {
    console.log("update chat unread");
    // 함수형 업데이트를 사용하여 chatList 업데이트
    setChatList((currentChatList) => {
      // chatList가 비어있으면 상태 변경 없이 현재 상태 반환
      if (currentChatList.length === 0) {
        return currentChatList;
      }
      // 응답받은 chat의 unread 수정을 위한 새로운 배열 반환
      return currentChatList.map((chat) => (chat.id === chatMessage.id ? { ...chat, unread: chatMessage.unread } : chat));
    });
  }

  useEffect(() => {
    if (!user) return;
    socketList.current.map((socket) => socket.socket.deactivate());
    socketList.current = [];
    const _userList: any[] = [];

    userList.map(async (_user) => {
      _userList.push(
        <div onClick={() => handleRecv(_user)}>
          <UserBox user={_user} />
        </div>
      );
      const room = await fetch(`http://localhost:8080/chatroom?userId=${user?.id}&userId=${_user.id}`, {
        credentials: "include",
      })
        .then(async (res) => (await res.json()).data)
        .catch((err) => console.log(err));
      const roomId = room.id;
      const socket = Stomp.over(() => {
        const sock = new SockJS("http://localhost:8080/ws");
        return sock;
      });
      socket.connect({ user: user.id }, async () => {
        const decoder = new TextDecoder("utf-8");
        console.log(`/queue/chatting/${roomId}`);
        socket.subscribe(`/queue/chatting/${roomId}`, (message) => {
          // ArrayBuffer를 UTF-8 문자열로 변환
          if (!recv.current || !sender.current) return;
          const userMessage = JSON.parse(decoder.decode(message.binaryBody));
          const newChat = {
            id: userMessage.chatId,
            unread: 1,
            userId: userMessage.senderId,
            chatRoomId: roomId,
            content: userMessage.content,
          } as Chat;
          console.log(userMessage);
          if (sender.current.roomId == newChat.chatRoomId) {
            setChatList((prev) => [...prev, newChat]);
            if (newChat.chatRoomId == roomId && newChat.userId != user.id) {
              socket.send(
                `/app/chat/${newChat.id}`,
                {},
                JSON.stringify({
                  id: newChat.id,
                  senderId: user.id,
                  unread: newChat.unread,
                })
              );
            }
          }
        });
        socket.subscribe(`/queue/chat/`, (message) => {
          const chatMessage = JSON.parse(decoder.decode(message.binaryBody));
          console.log(chatMessage);
          updateChatUnread(chatMessage);
        });
        socketList.current.push({
          recvId: _user.id,
          roomId: roomId,
          socket: socket,
        });
      });
    });
    // 상태값 변경
    setUserListTsx(() => _userList);
  }, [userList]);

  const messageSubmitHandler = () => {
    if (!sender.current || !user) {
      console.log("no sender");
      return;
    }
    sender.current.socket.send(
      "/app/chatting",
      {},
      JSON.stringify({
        roomId: sender.current.roomId,
        senderId: user.id,
        content: input,
      })
    );
  };

  return (
    <div>
      {!user && <SimpleLogin setUser={setUser} setUserList={setUserList} />}
      {user && userList && (
        <div>
          <UserListBox userListTsx={userListTsx} />
          <ChatListBox user={user} chatList={chatList} />
          <div>
            <input type="text" onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(() => e.target.value)} />
            <button onClick={messageSubmitHandler}>submit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
