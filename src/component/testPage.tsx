import axios from "axios";

const decodedServiceKey = decodeURIComponent(
  "7ep1HIodLpMKtYDoLYtumjQZPI8GXTac57Qnu4AH6qEfKuCor7QCjFeMNeaE0rvsa4aJxPE8p88oyt9iuffceg%3D%3D"
);

const TestPage = () => {
  const axiosCheck = async () => {
    const res = await axios
      .get(`http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst`, {
        params: {
          serviceKey: decodedServiceKey,
          // numOfRows: 10,
          // pageNo: 1,
          // base_date: "20240428",
          // base_time: "0600",
          // nx: 55,
          // ny: 127,
          dataType: "JSON",
        },
      })
      .then(async (res) => res.data)
      .catch((err) => console.log(err));
    console.log(res);
  };

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

  return (
    <>
      <h1>Login</h1>
      <button onClick={onGoogleLogin}>google login</button>
      <button onClick={isLoginSuccess}>check login</button>
      <button onClick={axiosCheck}>axios</button>
    </>
  );
};

export default TestPage;
