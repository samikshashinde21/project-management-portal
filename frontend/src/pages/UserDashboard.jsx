import DashboardLayout from "../layouts/DashboardLayout";


function UserDashboard() {

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  const profileItems = [
    userInfo?.name,
    userInfo?.email,
    userInfo?.profileImage,
  ];

  const completedItems = profileItems.filter(Boolean).length;

  const profileCompletion = Math.round(
    (completedItems / profileItems.length) * 100
  );


  return (
    <DashboardLayout>

      <div className="client-summary-band">

        <div>

          <div className="summary-kicker">
            User Portal
          </div>

          <h2>
            Welcome, {userInfo?.name}. View your account
            summary and manage your personal information.
          </h2>

        </div>

        <div className="summary-score">
          <span>{profileCompletion}%</span>
          <p>profile</p>
        </div>

      </div>


      <div className="dashboard-cards">

        <div className="stat-card accent-teal">
          <div className="stat-title">
            Account Role
          </div>

          <div className="stat-value user-stat-text">
            User
          </div>
        </div>

        <div className="stat-card accent-blue">
          <div className="stat-title">
            Account Status
          </div>

          <div className="stat-value user-stat-text">
            Active
          </div>
        </div>

        <div className="stat-card accent-gold">
          <div className="stat-title">
            Profile Completion
          </div>

          <div className="stat-value">
            {profileCompletion}%
          </div>
        </div>

      </div>


      <div className="content-grid">

        <div className="panel">
          <div className="panel-title">
            Personal Summary
          </div>

          <div className="user-summary-list">
            <div>
              <span>Name</span>
              <strong>{userInfo?.name}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{userInfo?.email}</strong>
            </div>

            <div>
              <span>Access Level</span>
              <strong>{userInfo?.role}</strong>
            </div>
          </div>
        </div>


        <div className="panel">
          <div className="panel-title">
            Quick Info
          </div>

          <div className="notification-item">
            <div className="notification-dot"></div>

            <div>
              <strong>Limited dashboard access</strong>

              <p>
                Users can view summary data and update
                their own profile details.
              </p>
            </div>
          </div>

          <div className="progress-item">
            <div className="progress-header">
              <span>Profile Completion</span>
              <span>{profileCompletion}%</span>
            </div>

            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${profileCompletion}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

      </div>

    </DashboardLayout>
  );
}

export default UserDashboard;
