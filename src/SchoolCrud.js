import { useState, useEffect } from "react";
import axios from "axios";

const SchoolCrud = () => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });
  const [userInfo, setUserInfo] = useState("");
  const [errorMessages, setErrorMessages] = useState("");

  const [schoolData, setSchoolData] = useState({
    schoolId: "",
    schoolName: "",
    schoolAddress: "",
  });

  const [schoolList, setSchoolList] = useState([]);
  const [schoolAddError, setschoolAddError] = useState("");

  const { username, password } = userData;
  const { schoolId, schoolName, schoolAddress } = schoolData;

  useEffect(() => {
    getSchoolList();
  }, [userInfo, schoolList]);

  const changeHandler = (e) => {
    setUserData({ ...userData, [e.target.name]: [e.target.value] });
  };

  const changeSchoolDataHandler = (e) => {
    setSchoolData({ ...schoolData, [e.target.name]: [e.target.value] });
  };

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
        name: username,
        password: password,
      });
      setUserInfo(data);
      setErrorMessages("");
    } catch (error) {
      setErrorMessages(error.response.data.message);
      setUserData({
        username: "",
        password: "",
      });
      setUserInfo("");
    }
  };

  const signout = () => {
    setUserInfo("");
    setUserData({
      username: "",
      password: "",
    });
  };

  const addUpdateSchoolInfoApi = async () => {
    if (schoolId !== "" && schoolName !== "" && schoolAddress !== "") {
      const schoolDetails = {
        schoolId: schoolId,
        schoolName: schoolName,
        schoolAddress: schoolAddress,
      };
      await axios.put(`/api/schools/${userInfo.name}`, schoolDetails, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setSchoolData({
        schoolId: "",
        schoolName: "",
        schoolAddress: "",
      });
      setschoolAddError("");
    }
  };

  const deleteSchoolApi = async (id) => {
    if (userInfo !== "") {
      await axios.delete(`/api/schools/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
        data: {
          name: userInfo.name,
        },
      });
    }
  };

  return (
    <div>
      {userInfo === "" ? (
        <form onSubmit={handleSubmit} className="form">
          <div>
            <h1>User Login</h1>
            <div className="error">{errorMessages !== "" && errorMessages}</div>
            <div>
              <div>
                <div>
                  <label className="loginLabel">Username </label>
                  <input
                    className="loginInput"
                    type="text"
                    name="username"
                    value={username}
                    onChange={changeHandler}
                    required
                    placeholder="Enter name"
                  />
                  <br />
                </div>
                <div>
                  <label className="loginLabel">Password </label>
                  <input
                    className="loginInput"
                    type="password"
                    name="password"
                    value={password}
                    onChange={changeHandler}
                    required
                    placeholder="Enter password"
                  />
                  <br />
                </div>
              </div>
              <div>
                <input className="loginButton" type="submit" />
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
            <div className="error">
              {schoolAddError !== "" && schoolAddError}
            </div>
            <div className="addBox">
              <div>
                <label>School Id </label>
                <input
                  type="number"
                  name="schoolId"
                  onChange={changeSchoolDataHandler}
                  value={schoolId}
                  required
                  placeholder="Enter school Id"
                />
              </div>
              <div>
                <label>School Name </label>
                <input
                  type="text"
                  name="schoolName"
                  onChange={changeSchoolDataHandler}
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
                  onChange={changeSchoolDataHandler}
                  value={schoolAddress}
                  required
                  placeholder="Enter school address"
                />
              </div>
              <div>
                <button onClick={addUpdateSchoolInfoApi}>Add/Update</button>
              </div>
            </div>
          </div>

          <hr></hr>
          {schoolList !== [] ? (
            <table>
              <tr>
                <th>Id</th>
                <th>School</th>
                <th>Address</th>
                <th>Delete</th>
              </tr>
              {schoolList.map((row) => (
                <tr key={row.value.schoolId}>
                  <td>{row.value.schoolId}</td>
                  <td>{row.value.schoolName}</td>
                  <td>{row.value.schoolAddress}</td>
                  <td>
                    <button
                      onClick={(e) => {
                        deleteSchoolApi(row.value.schoolId);
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

export default SchoolCrud;
