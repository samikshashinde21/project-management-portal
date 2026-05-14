import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import API from "../services/api";


function UserManagement() {

  const [users, setUsers] = useState([]);

  const [loading, setLoading] =
    useState(true);


  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );


  const config = {
    headers: {
      Authorization:
        `Bearer ${userInfo.token}`,
    },
  };


  const fetchUsers = async () => {

    try {

      const { data } = await API.get(
        "/users",
        config
      );

      setUsers(data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };


  useEffect(() => {

    fetchUsers();

  }, []);


  const roleChangeHandler = async (
    userId,
    role
  ) => {

    try {

      await API.put(
        `/users/${userId}/role`,
        { role },
        config
      );

      fetchUsers();

    } catch (error) {

      console.log(error);
    }
  };


  const deleteHandler = async (id) => {

    try {

      await API.delete(
        `/users/${id}`,
        config
      );

      fetchUsers();

    } catch (error) {

      console.log(error);
    }
  };


  if (loading) {
    return <h2>Loading...</h2>;
  }


  return (
    <DashboardLayout>

      <div className="topbar">

        <div>

          <h1 className="page-title">
            User Management
          </h1>

          <p className="table-subtitle">
            Manage users and roles
          </p>

        </div>

      </div>


      <div className="table-wrapper">

        <table className="custom-table">

          <thead>

            <tr>

              <th>Name</th>

              <th>Email</th>

              <th>Role</th>

              <th>Actions</th>

            </tr>

          </thead>


          <tbody>

            {users.map((user) => (

              <tr key={user._id}>

                <td>{user.name}</td>

                <td>{user.email}</td>

                <td>

                  <select
                    value={user.role}
                    onChange={(e) =>
                      roleChangeHandler(
                        user._id,
                        e.target.value
                      )
                    }
                    className="role-select"
                  >

                    <option value="user">
                      User
                    </option>

                    <option value="client">
                      Client
                    </option>

                    <option value="admin">
                      Admin
                    </option>

                  </select>

                </td>

                <td>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteHandler(user._id)
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </DashboardLayout>
  );
}

export default UserManagement;