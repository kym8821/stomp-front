import { ChangeEvent, InputHTMLAttributes, useState } from "react";
import { User } from "../util/Users";

type loginProps = {
  setUser: Function;
  setUserList: Function;
};

const SimpleLogin = (props: loginProps) => {
  const [username, setUsername] = useState<String | undefined>(undefined);
  const host = "15.165.25.19";
  const handleUsernameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value as String);
  };

  const loginhandler = async () => {
    const users: User[] | undefined = await fetch(`http://${host}:8080/users`, {
      credentials: "include",
    })
      .then(async (res) => (await res.json()).body)
      .catch((err) => console.log(err));
    console.log(users);
    if (!users) return;
    const lst: User[] = [];
    users.map((user) => {
      console.log(user.email, username);
      if (username == user.username) {
        console.log("same");
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
