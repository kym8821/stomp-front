import { useState } from 'react';
import SimpleLogin from './SimpleLogin';
import { User } from '../util/Users';
import UserBox from './UserBox';

const ChatPage = () => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [userList, setUserList] = useState<any[] | undefined>(undefined);

  return (
    <div>
      {!user && <SimpleLogin setUser={setUser} setUserList={setUserList} />}
      {user && userList && (
        <div>
          <div>
            <UserBox user={user} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
