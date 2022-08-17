import { useState, useEffect } from "react";
import axios from "axios";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [errorMessages, setErrorMessages] = useState("");

  const [schoolName, setSchoolName] = useState("");
  const [schoolAddress, setSchoolAddress] = useState("");
  const [schoolUpdate, setSchoolUpdate] = useState(false);

  const [schoolList, setSchoolList] = useState([]);
  const [addSchoolError, setAddSchoolError] = useState("");

  useEffect(() => {
    getSchoolList();
  }, [userInfo, schoolUpdate]);

  const getSchoolList = async () => {
    if (userInfo !== "") {
      const { data } = await axios.get(`/api/schools/${userInfo.name}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setSchoolList(data.arr);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.post("/api/login", {
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
    setUserInfo("");
    setUserName("");
    setPassword("");
  };

  const addNewSchoolInfoApi = async () => {
    if (schoolName !== "" && schoolAddress !== "") {
      const schoolDetails = {
        id: Math.floor(Math.random() * 1000),
        schoolName: schoolName,
        schoolAddress: schoolAddress,
      };
      try {
        await axios.put(`/api/schools/${userInfo.name}`, schoolDetails, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setSchoolUpdate(schoolUpdate ? false : true);
        setSchoolName("");
        setSchoolAddress("");
        setAddSchoolError("");
      } catch (error) {
        setAddSchoolError(error.response.data.message);
      }
    }
  };

  const deleteSchoolApi = async (e, id) => {
    if (userInfo !== "") {
      await axios.delete(`/api/schools/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
        data: {
          name: userInfo.name,
        },
      });
      setSchoolUpdate(schoolUpdate ? false : true);
    }
  };

  return (
    <div>
      {userInfo === "" ? (
        <form onSubmit={handleSubmit} className="form">
          <div>
            <h1>Admin Login</h1>
            {errorMessages !== "" && errorMessages}
            <div>
              <div>
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
              </div>
              <div>
                <input type="submit" />
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div>
          <div>
            <div className="head">
              <h1>{userInfo.name}'s Dashboard - School List</h1>
            </div>
            <div className="signout">
              <button onClick={signout}>Sign out</button>
            </div>
          </div>

          <div>
            <hr></hr>
            <div>{addSchoolError !== "" && addSchoolError}</div>
            <div className="addBox">
              <div>
                <label>School Name </label>
                <input
                  type="text"
                  name="schoolName"
                  onChange={(e) => setSchoolName(e.target.value)}
                  value={schoolName}
                  required
                  placeholder="Enter school name"
                />
              </div>
              <div>
                <label>School Address </label>
                <input
                  type="text"
                  name="schoolAddress"
                  onChange={(e) => setSchoolAddress(e.target.value)}
                  value={schoolAddress}
                  required
                  placeholder="Enter school address"
                />
              </div>
              <div>
                <button onClick={addNewSchoolInfoApi}>Add</button>
              </div>
            </div>
          </div>

          <hr></hr>
          {schoolList !== [] ? (
            <table>
              <tr>
                <th>School</th>
                <th>Address</th>
                <th>Delete</th>
              </tr>
              {schoolList.map((row) => (
                <tr key={row.value.id}>
                  <td>{row.value.schoolName}</td>
                  <td>{row.value.schoolAddress}</td>
                  <td>
                    <button
                      onClick={(e) => {
                        deleteSchoolApi(e, row.value.id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </table>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Login;
