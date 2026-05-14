import { useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import API from "../services/api";

const passwordRuleMessage =
  "Password must be more than 6 characters and include one uppercase letter and one symbol.";

const isValidPassword = (password) =>
  password.length > 6 &&
  /[A-Z]/.test(password) &&
  /[^A-Za-z0-9]/.test(password);


function ProfilePage() {

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  const [profileForm, setProfileForm] =
    useState({
      name: userInfo?.name || "",
      email: userInfo?.email || "",
      profileImage: userInfo?.profileImage || "",
    });

  const [passwordForm, setPasswordForm] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const [error, setError] =
    useState("");

  const [toast, setToast] =
    useState("");

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


  const profileChangeHandler = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });
  };


  const passwordChangeHandler = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };


  const imageChangeHandler = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileForm({
        ...profileForm,
        profileImage: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };


  const updateStoredUser = (data) => {
    localStorage.setItem(
      "userInfo",
      JSON.stringify(data)
    );
  };


  const saveProfileHandler = async (e) => {
    e.preventDefault();

    if (
      !profileForm.name.trim() ||
      !profileForm.email.trim()
    ) {
      setError("Name and email are required.");
      return;
    }

    try {
      setError("");

      const { data } = await API.put(
        "/users/profile",
        {
          name: profileForm.name.trim(),
          email: profileForm.email.trim(),
          profileImage: profileForm.profileImage,
        },
        config
      );

      updateStoredUser(data);

      setProfileForm({
        name: data.name,
        email: data.email,
        profileImage: data.profileImage || "",
      });

      showToast("Profile updated successfully.");

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Profile could not be updated."
      );
    }
  };


  const changePasswordHandler = async (e) => {
    e.preventDefault();

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setError("Please fill all password fields.");
      return;
    }

    if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {
      setError("New password and confirmation do not match.");
      return;
    }

    if (!isValidPassword(passwordForm.newPassword)) {
      setError(passwordRuleMessage);
      return;
    }

    try {
      setError("");

      const { data } = await API.put(
        "/users/profile",
        {
          password: passwordForm.newPassword,
          currentPassword:
            passwordForm.currentPassword,
        },
        config
      );

      updateStoredUser(data);

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      showToast("Password changed successfully.");

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Password could not be changed."
      );
    }
  };


  return (
    <DashboardLayout>

      {toast && (
        <div className="toast-message">
          {toast}
        </div>
      )}

      <div className="client-summary-band">
        <div>
          <div className="summary-kicker">
            Account
          </div>

          <h2>
            Manage your profile, photo, and password.
          </h2>
        </div>
      </div>


      {error && (
        <div className="form-error settings-error">
          {error}
        </div>
      )}


      <div className="profile-placeholder">

        <div className="profile-card-header">

          <div className="profile-large-avatar profile-image-avatar">
            {profileForm.profileImage ? (
              <img
                src={profileForm.profileImage}
                alt="Profile"
              />
            ) : (
              profileForm.name?.charAt(0)
            )}
          </div>

          <div>
            <h2>{profileForm.name}</h2>
            <p>{profileForm.email}</p>
            <span className="role-pill">
              {userInfo?.role}
            </span>
          </div>

        </div>


        <div className="settings-grid">

          <div className="panel">
            <div className="panel-title">
              Personal Information
            </div>

            <form
              className="project-form"
              onSubmit={saveProfileHandler}
            >
              <div className="form-group">
                <label htmlFor="profileImage">
                  Profile Image
                </label>

                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={imageChangeHandler}
                />
              </div>

              <div className="form-group">
                <label htmlFor="name">
                  Name
                </label>

                <input
                  id="name"
                  name="name"
                  value={profileForm.name}
                  onChange={profileChangeHandler}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={profileForm.email}
                  onChange={profileChangeHandler}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="submit"
                  className="primary-btn"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>


          <div className="panel">
            <div className="panel-title">
              Change Password
            </div>

            <form
              className="project-form"
              onSubmit={changePasswordHandler}
            >
              <div className="form-group">
                <label htmlFor="currentPassword">
                  Current Password
                </label>

                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={passwordChangeHandler}
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">
                  New Password
                </label>

                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={passwordChangeHandler}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  Confirm New Password
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={passwordChangeHandler}
                />

                <p className="password-hint">
                  More than 6 characters, one uppercase
                  letter, and one symbol.
                </p>
              </div>

              <div className="modal-actions">
                <button
                  type="submit"
                  className="primary-btn"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default ProfilePage;
