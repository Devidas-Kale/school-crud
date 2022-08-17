import { useState, useEffect } from "react";
import axios from "axios";

const SchoolCrud = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [errorMessages, setErrorMessages] = useState("");

  const [schoolName, setSchoolName] = useState("");
  const [schoolAddress, setSchoolAddress] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [schoolListUpdateFlag, setSchoolListUpdateFlag] = useState(false);

  const [schoolList, setSchoolList] = useState([]);
  const [schoolAddError, setschoolAddError] = useState("");

  useEffect(() => {
    getSchoolList();
  }, [userInfo, schoolListUpdateFlag]);

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
      setErrorMessages("");
    } catch (error) {
      setErrorMessages(error.response.data.message);
      setUserName("");
      setPassword("");
      setUserInfo("");
    }
  };

  const signout = () => {
    setUserInfo("");
    setUserName("");
    setPassword("");
  };

  const addUpdateSchoolInfoApi = async () => {
    if (schoolId !== "" && schoolName !== "" && schoolAddress !== "") {
      const schoolDetails = {
        schoolId: schoolId,
        schoolName: schoolName,
        schoolAddress: schoolAddress,
      };
      try {
        await axios.put(`/api/schools/${userInfo.name}`, schoolDetails, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setSchoolListUpdateFlag(schoolListUpdateFlag ? false : true);
        setSchoolId("");
        setSchoolName("");
        setSchoolAddress("");
        setschoolAddError("");
      } catch (error) {
        setschoolAddError(error.response.data.message);
      }
    }
  };

  const deleteSchoolApi = async (e, id) => {
    console.log(id);
    if (userInfo !== "") {
      await axios.delete(`/api/schools/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
        data: {
          name: userInfo.name,
        },
      });
      setSchoolListUpdateFlag(schoolListUpdateFlag ? false : true);
    }
  };

  return (
    <div>
      {userInfo === "" ? (
        <form onSubmit={handleSubmit} className="form">
          <div>
            <h1>User Login</h1>
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
            <div>{schoolAddError !== "" && schoolAddError}</div>
            <div className="addBox">
              <div>
                <label>School Id </label>
                <input
                  type="number"
                  name="schoolId"
                  onChange={(e) => setSchoolId(e.target.value)}
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
                        deleteSchoolApi(e, row.value.schoolId);
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
