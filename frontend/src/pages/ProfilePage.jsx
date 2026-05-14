import DashboardLayout from "../layouts/DashboardLayout";


function ProfilePage() {

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );


  return (
    <DashboardLayout>

      <div className="topbar">

        <div>

          <h1 className="page-title">
            Profile
          </h1>

          <p className="table-subtitle">
            Personal details and account settings
          </p>

        </div>

      </div>


      <div className="profile-placeholder">

        <div className="profile-card-header">

          <div className="profile-large-avatar">
            {userInfo?.name?.charAt(0)}
          </div>

          <div>

            <h2>{userInfo?.name}</h2>

            <p>{userInfo?.email}</p>

            <span className="role-pill">
              {userInfo?.role}
            </span>

          </div>

        </div>


        <div className="placeholder-shell compact-placeholder">

          <h2>Profile editing coming soon</h2>

          <p>
            This page will support personal information
            updates and password changes.
          </p>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default ProfilePage;
