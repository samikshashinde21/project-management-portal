import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import API from "../services/api";

const passwordRuleMessage =
  "Password must be more than 6 characters and include one uppercase letter and one symbol.";

const isValidPassword = (password) =>
  password.length > 6 &&
  /[A-Z]/.test(password) &&
  /[^A-Za-z0-9]/.test(password);


const emptyForm = {
  name: "",
  email: "",
  password: "",
  role: "user",
};


function UserManagement() {

  const [users, setUsers] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [showForm, setShowForm] =
    useState(false);

  const [editingUser, setEditingUser] =
    useState(null);

  const [formData, setFormData] =
    useState(emptyForm);

  const [formError, setFormError] =
    useState("");

  const [toast, setToast] =
    useState("");

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  const config = {
    headers: {
      Authorization:
        `Bearer ${userInfo?.token}`,
    },
  };


  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2400);
  };


  const fetchUsers = async () => {

    try {

      const { data } = await API.get(
        "/users",
        config
      );

      setUsers(
        data.filter((user) => user.role !== "client")
      );

    } catch (error) {

      setFormError(
        error.response?.data?.message ||
          "Unable to load users."
      );

    } finally {

      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, []);


  const openAddForm = (role = "user") => {
    setEditingUser(null);
    setFormData({
      ...emptyForm,
      role,
    });
    setFormError("");
    setShowForm(true);
  };


  const openEditForm = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
    setFormError("");
    setShowForm(true);
  };


  const inputChangeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const submitHandler = async (e) => {
    e.preventDefault();

    setFormError("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      (!editingUser && !formData.password.trim())
    ) {
      setFormError("Please fill all required fields.");
      return;
    }

    if (
      formData.password.trim() &&
      !isValidPassword(formData.password)
    ) {
      setFormError(passwordRuleMessage);
      return;
    }

    try {
      if (editingUser) {
        await API.put(
          `/users/${editingUser._id}`,
          {
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password.trim(),
            role: formData.role,
          },
          config
        );

        showToast(
          formData.role === "client"
            ? "Role updated. User moved to Clients."
            : "User updated successfully."
        );
      } else {
        await API.post(
          "/users/admin",
          {
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password.trim(),
            role: formData.role,
          },
          config
        );

        showToast(
          formData.role === "admin"
            ? "Admin created successfully."
            : "User created successfully."
        );
      }

      setShowForm(false);
      await fetchUsers();

    } catch (error) {
      setFormError(
        error.response?.data?.message ||
          "User could not be saved."
      );
    }
  };


  const deleteHandler = async (id) => {

    try {
      await API.delete(
        `/users/${id}`,
        config
      );

      await fetchUsers();
      showToast("User deleted successfully.");

    } catch (error) {
      showToast(
        error.response?.data?.message ||
          "Delete failed."
      );
    }
  };


  if (loading) {
    return <h2>Loading...</h2>;
  }

  const standardUsers = users.filter(
    (user) => user.role === "user"
  );

  const adminUsers = users.filter(
    (user) => user.role === "admin"
  );


  return (
    <DashboardLayout>

      {toast && (
        <div className="toast-message">
          {toast}
        </div>
      )}

      <div className="admin-hero">

        <div>
          <span className="admin-eyebrow">
            Account Control
          </span>

          <h1>User Management</h1>

          <p>
            Create users, edit account details, and keep
            admin accounts separated clearly.
          </p>
        </div>

        <div className="admin-hero-action">
          <button
            className="primary-btn"
            onClick={() => openAddForm("user")}
          >
            + Add User
          </button>

          <button
            className="hero-secondary-btn"
            onClick={() => openAddForm("admin")}
          >
            + Add Admin
          </button>
        </div>

      </div>


      <div className="admin-quick-stats">
        <div className="quick-stat">
          <span>Shown Accounts</span>
          <strong>{users.length}</strong>
        </div>

        <div className="quick-stat">
          <span>Standard Users</span>
          <strong>
            {standardUsers.length}
          </strong>
        </div>

        <div className="quick-stat">
          <span>Admins</span>
          <strong>
            {adminUsers.length}
          </strong>
        </div>
      </div>


      {showForm && (
        <div className="modal-overlay">
          <div className="project-modal">
            <div className="modal-header">
              <div>
                <h2 className="modal-title">
                  {editingUser
                    ? "Edit User"
                    : formData.role === "admin"
                      ? "Add Admin"
                      : "Add User"}
                </h2>
                <p className="modal-subtitle">
                  {editingUser
                    ? "Manage account details and role"
                    : `This account will be created as ${formData.role}`}
                </p>
              </div>

              <button
                className="modal-close-btn"
                onClick={() => setShowForm(false)}
                type="button"
              >
                x
              </button>
            </div>

            <form
              className="project-form"
              onSubmit={submitHandler}
            >
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={inputChangeHandler}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={inputChangeHandler}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={inputChangeHandler}
                  placeholder={
                    editingUser
                      ? "Leave blank to keep current password"
                      : "Enter password"
                  }
                />
                <p className="password-hint">
                  More than 6 characters, one uppercase
                  letter, and one symbol.
                </p>
              </div>

              {editingUser && (
                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={inputChangeHandler}
                  >
                    <option value="user">User</option>
                    <option value="client">Client</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              )}

              {formError && (
                <div className="form-error">
                  {formError}
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      <div className="section-heading">
        <h2>Users</h2>
        <p>Registered accounts with standard user access.</p>
      </div>

      <div className="table-wrapper management-table">
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
            {standardUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className="role-pill">
                    {user.role}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      className="secondary-btn table-btn"
                      onClick={() => openEditForm(user)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteHandler(user._id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      <div className="section-heading">
        <h2>Admins</h2>
        <p>Accounts with administration permissions.</p>
      </div>

      <div className="table-wrapper management-table">
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
            {adminUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className="role-pill admin-pill">
                    {user.role}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      className="secondary-btn table-btn"
                      onClick={() => openEditForm(user)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteHandler(user._id)
                      }
                    >
                      Delete
                    </button>
                  </div>
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
