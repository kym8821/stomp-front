import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TestPage = () => {
  const navigate = useNavigate();

  const onLogin = async () => {
    axios.defaults.withCredentials = true;
    try {
      const res = await axios
        .post('http://localhost:8080/signup')
        .then((res) => {
          console.log('login success');
          return res.data;
        })
        .catch((err) => console.log(err));
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  const onGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google?redirect_uri=http://localhost:3000';
  };

  const clickChatBtnHandler = () => {
    navigate('/chat');
  };

  return (
    <>
      <h1>Login</h1>
      <button onClick={onGoogleLogin}>google login</button>
      <button onClick={onLogin}>SignUp</button>
      <button onClick={clickChatBtnHandler}>chat</button>
    </>
  );
};

export default TestPage;
