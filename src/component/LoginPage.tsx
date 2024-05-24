import axios from "axios";
import { useNavigate } from "react-router-dom";
import Login from "./Login";

const TestPage = () => {
  const host = "localhost";
  const navigate = useNavigate();

  const onLogin = async () => {
    axios.defaults.withCredentials = true;
    try {
      const res = await axios
        .post(`http://${host}:8080/signup`)
        .then((res) => {
          console.log("login success");
          return res.data;
        })
        .catch((err) => console.log(err));
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  const onGoogleLogin = () => {
    window.location.href = `http://${host}:8080/oauth2/authorization/google`;
  };

  const getState = () => {
    axios
      .get("http://localhost:8080/login-info", { withCredentials: true })
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
      <Login />
      <button onClick={clickChatBtnHandler}>chat</button>
      <button onClick={getState}>state</button>
    </div>
  );
};

export default TestPage;
