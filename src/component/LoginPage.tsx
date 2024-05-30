import axios from "axios";
import { useNavigate } from "react-router-dom";
import { randomInt } from "crypto";
import Login from "./Login";
import { profile } from "console";
import { useEffect, useRef, useState } from "react";

const TestPage = () => {
  const host = "localhost";
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    async function getUserInfo() {
      const token = await axios
        .get("http://15.165.25.19:8080/test-user")
        .then((res) => res.data.body)
        .catch((err) => console.log(err));
      const userInfo = await axios
        .get("http://15.165.25.19:8080/user", {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          const _user = res.data.body;
          setUser(() => _user);
          console.log(_user);
          return _user;
        })
        .catch((err) => console.log(err));
      return userInfo;
    }
    getUserInfo();
  }, []);

  const getTestUser = async () => {
    const host = "15.165.25.19";
    const token = await axios
      .get("http://15.165.25.19:8080/test-user")
      .then((res) => res.data.body)
      .catch((err) => console.log(err));
    console.log(token);
    const result = await axios
      .get("http://15.165.25.19:8080/user", {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        console.log(res);
        return res.data;
      })
      .catch((err) => console.log(err));
    console.log(result);
  };

  const signUpHandler = async () => {
    const res = await axios
      .post("http://localhost:8080/signup", {
        name: "user",
        role: "헨젤",
        profileMessage: "?",
        profileImageUrl: "?",
        interestKeyword: ["요리"],
        concernKeyword: ["소득"],
      })
      .then((res) => res.data)
      .catch((err) => console.log(err));
    console.log(res);
  };

  const onGoogleLogin = () => {
    window.location.href = `http://${host}:8080/oauth2/authorization/google`;
  };

  const getState = () => {
    axios
      .get("http://localhost:8080/login-info", {
        withCredentials: true,
        headers: {
          Authorization: window.localStorage.getItem("Authorization"),
        },
      })
      .then((res) => {
        alert(res.data.body);
      })
      .catch((error) => alert(error));
  };

  const clickChatBtnHandler = () => {
    navigate("/chat");
  };

  return (
    <div>
      {user && <div>{user.name}</div>}
      <Login signInSuccessUrl={"/"} signInFailureUrl={"/"} signupUrl={"/chat"} />
      <button onClick={clickChatBtnHandler}>chat</button>
      <button onClick={getState}>state</button>
      <button onClick={signUpHandler}>signup</button>
      <button onClick={getTestUser}>testUser</button>
    </div>
  );
};

export default TestPage;
