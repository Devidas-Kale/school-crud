import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [errorMessages, setErrorMessages] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.post("/api/signin", {
        name: userName,
        password: password,
      });
      setUserInfo(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setErrorMessages("");
    } catch (error) {
      setErrorMessages(error.response.data.message);
      setUserName("");
      setPassword("");
      setUserInfo("");
    }
  };

  const signout = () => {
    localStorage.removeItem("userInfo");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Admin Login</h1>
        {errorMessages !== "" && errorMessages}
        <div>
          <label>Username </label>
          <input
            type="text"
            name="uname"
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            required
            placeholder="Enter name"
          />
        </div>
        <div>
          <label>Password </label>
          <input
            type="Password"
            name="pass"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
            placeholder="Enter password"
          />
        </div>
        <div>
          <input type="submit" />
        </div>
      </form>
    </div>
  );
};

export default Login;
