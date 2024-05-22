import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TestPage = () => {
  const host = '15.165.25.19';
  //const host = 'localhost';
  const navigate = useNavigate();

  const onLogin = async () => {
    axios.defaults.withCredentials = true;
    try {
      const res = await axios
        .post(`http://${host}:8080/signup`)
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
    window.location.href = `http://${host}:8080/oauth2/authorization/google`;
  };

  // const onGoogleLogin = () => {
  //   axios
  //     .get('http://localhost:8080/', { withCredentials: true })
  //     .then((res) => {
  //       alert(JSON.stringify(res.data));
  //     })
  //     .catch((error) => alert(error));
  // };

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
