import { useEffect, useState } from 'react';
import { Chat } from '../util/Chat';
import { User } from '../util/Users';
import '../css/ChatListBoxCss.css';

type ChatListBoxType = {
  user: User;
  chatList: Chat[];
};

const ChatListBox = (props: ChatListBoxType) => {
  const [chatListTsx, setChatListTsx] = useState<any[]>([]);

  useEffect(() => {
    const lst: any[] = [];
    console.log('chatlist changed');
    props.chatList.map((chat) => {
      const classname = props.user.id == chat.userId ? 'sendChat' : 'recvChat';
      if (classname === 'sendChat') {
        lst.push(
          <div className={classname} key={`${chat.id}-${chat.userId}-${chat.unread}`}>
            <div>{chat.unread}</div>
            <div>{chat.content}</div>
          </div>
        );
      } else {
        lst.push(
          <div className={classname} key={`${chat.id}-${chat.unread}`}>
            <div>{chat.content}</div>
            <div>{chat.unread}</div>
          </div>
        );
      }
    });
    setChatListTsx(() => lst);
  }, [props.chatList]);

  return <div className="chatListBoxContainer">{chatListTsx}</div>;
};

export default ChatListBox;
