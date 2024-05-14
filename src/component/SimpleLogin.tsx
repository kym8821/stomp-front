import { ChangeEvent, InputHTMLAttributes, useState } from "react";
import { User } from "../util/Users";

type loginProps = {
  setUser: Function;
  setUserList: Function;
};

const SimpleLogin = (props: loginProps) => {
  const [username, setUsername] = useState<String | undefined>(undefined);

  const handleUsernameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value as String);
  };

  const loginhandler = async () => {
    const users: User[] = await fetch("http://localhost:8080/users")
      .then(async (res) => (await res.json()).data)
      .catch((err) => console.log(err));
    console.log(users);
    const lst: User[] = [];
    users.map((user) => {
      if (username == user.username) {
        props.setUser(() => user);
        return;
      }
      lst.push(user);
    });
    props.setUserList(() => lst);
  };

  return (
    <div>
      <input type="text" onChange={handleUsernameInput} />
      <button onClick={loginhandler}>Login</button>
    </div>
  );
};

export default SimpleLogin;
