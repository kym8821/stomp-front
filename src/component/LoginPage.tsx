import { useNavigate } from "react-router-dom";

const TestPage = () => {
  const navigate = useNavigate();

  const isLoginSuccess = async () => {
    try {
      await fetch("http://localhost:8080/test", {
        credentials: "include",
      })
        .then(async (res) => await res.json())
        .then(function (data) {
          alert(data);
          console.log(data);
        })
        .catch(function (err) {
          alert(err);
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const onGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google?redirect_uri=http://localhost:3000";
  };

  const clickChatBtnHandler = () => {
    navigate("/chat");
  };

  return (
    <>
      <h1>Login</h1>
      <button onClick={onGoogleLogin}>google login</button>
      <button onClick={isLoginSuccess}>check login</button>
      <button onClick={clickChatBtnHandler}>chat</button>
    </>
  );
};

export default TestPage;
