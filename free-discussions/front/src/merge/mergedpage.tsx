// Dashboard.tsx
import React, { useState } from 'react';
import GroupsPage from '../Groups/GroupsPage';
import Profile from '../Profile/Profile';
import './merge.css'; // We'll create this CSS file next
import Header from '../Header/Header';

const Dashboard: React.FC = () => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <div className={`groups-section ${showProfile ? "shrink" : ""}`}>
          <GroupsPage />
        </div>

        {showProfile && (
          <div className="profile-section">
            <Profile />
            <button
              className="close-profile-btn"
              onClick={() => setShowProfile(false)}
            >
              Close Profile
            </button>
          </div>
        )}

        {!showProfile && (
          <button
            className="toggle-profile-btn"
            onClick={() => setShowProfile(true)}
          >
            Show Profile
          </button>
        )}
      </div>
    </>
  );
};



export default Dashboard;