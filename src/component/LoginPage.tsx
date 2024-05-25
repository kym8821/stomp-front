import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { randomInt } from 'crypto';
import Login from './Login';
import { profile } from 'console';

const TestPage = () => {
  const host = 'localhost';
  const navigate = useNavigate();

  const signUpHandler = async () => {
    const res = await axios
      .post('http://localhost:8080/signup', {
        name: 'user',
        role: '헨젤',
        profileMessage: '?',
        profileImageUrl: '?',
        interestKeyword: ['요리'],
        concernKeyword: ['소득'],
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
      .get('http://localhost:8080/login-info', { withCredentials: true })
      .then((res) => {
        alert(res.data.body);
      })
      .catch((error) => alert(error));
  };

  const clickChatBtnHandler = () => {
    navigate('/chat');
  };

  return (
    <div>
      <Login />
      <button onClick={clickChatBtnHandler}>chat</button>
      <button onClick={getState}>state</button>
      <button onClick={signUpHandler}>signup</button>
    </div>
  );
};

export default TestPage;
