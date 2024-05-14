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
  id: number;
  roomId: number;
  socket: CompatClient;
}

const ChatPage = () => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [recv, setRecv] = useState<User | undefined>(undefined);
  const [userList, setUserList] = useState<User[]>([]);
  const [userListTsx, setUserListTsx] = useState<any[]>([]);
  const [chatList, setChatList] = useState<Chat[]>([]);
  const [sender, setSender] = useState<SocketClient | undefined>(undefined);
  const [socketList, setSocketList] = useState<SocketClient[]>([]);
  const [input, setInput] = useState<string>();

  const handleRecv = async (_user: User) => {
    if (!user) return;
    // 소켓 객체 가져오기
    console.log(socketList);
    const socketArr = socketList?.map((sc) => {
      if (sc.id == _user.id) {
        return sc;
      }
    });
    if (!socketArr || socketArr.length == 0 || !socketArr[0]) return;
    const socket = socketArr[0];
    console.log(socket);
    // chatList 가져오기
    const lastChatList: Chat[] = await fetch(`http://localhost:8080/chat/${socket.roomId}`)
      .then(async (res) => (await res.json()).data)
      .catch((err) => console.log(err));
    // 상태값 변경
    setSender(() => socket);
    setChatList(() => lastChatList);
    setRecv(() => _user);
  };

  useEffect(() => {
    if (!user) return;
    const _userList: any[] = [];
    const _socketList: any[] = [];

    userList.map(async (_user) => {
      _userList.push(
        <div onClick={() => handleRecv(_user)}>
          <UserBox user={_user} />
        </div>
      );
      const room = await fetch(`http://localhost:8080/chatroom?userId=${user?.id}&userId=${_user.id}`)
        .then(async (res) => (await res.json()).data)
        .catch((err) => console.log(err));
      const roomId = room.id;
      const socket = Stomp.over(() => {
        const sock = new SockJS("http://localhost:8080/ws");
        return sock;
      });
      socket.connect({ user: user.id }, async () => {
        const decoder = new TextDecoder("utf-8");
        socket.subscribe(`/queue/chatting/${roomId}`, (message) => {
          // ArrayBuffer를 UTF-8 문자열로 변환
          const userMessage = JSON.parse(decoder.decode(message.binaryBody));
          console.log(userMessage);
          const newChat = {
            id: userMessage.chatId,
            unread: 1,
            userId: userMessage.senderId,
            chatRoomId: roomId,
            content: userMessage.content,
          } as Chat;
          if ((recv && recv.id == userMessage.id) || user.id == userMessage.id) {
            setChatList((prev) => [...prev, newChat]);
          }
        });
        socket.subscribe(`/queue/chat/`, (message) => {
          const chatMessage = JSON.parse(decoder.decode(message.binaryBody));
          console.log(chatMessage);
        });
        setSocketList((prev) => [
          ...prev,
          {
            id: _user.id,
            roomId: roomId,
            socket: socket,
          },
        ]);
      });
      console.log("socket connected!");
      _socketList.push({
        id: _user.id,
        roomId: roomId,
        socket: socket,
      });
    });
    // 상태값 변경
    setUserListTsx(() => _userList);
    setSocketList(() => _socketList);
  }, [userList]);

  const messageSubmitHandler = () => {
    if (!sender) {
      console.log("no sender");
      return;
    }
    sender.socket.send(
      "/app/chatting",
      {},
      JSON.stringify({
        roomId: sender.roomId,
        senderId: sender.id,
        content: input,
      })
    );
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(() => e.target.value);
  };

  return (
    <div>
      {!user && <SimpleLogin setUser={setUser} setUserList={setUserList} />}
      {user && userList && (
        <div>
          <UserListBox userListTsx={userListTsx} />
          <ChatListBox user={user} chatList={chatList} />
          <div>
            <input type="text" onChange={handleInput} />
            <button onClick={messageSubmitHandler}>submit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
