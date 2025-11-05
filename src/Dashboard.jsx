import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h2>Dashboard</h2>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        <div className="welcome-section">
          <h3>Welcome, {user.fullName}!</h3>
          <p>You are successfully logged in.</p>
        </div>

        <div className="user-info">
          <h4>Profile Information</h4>
          <div className="info-item">
            <span className="info-label">Full Name:</span>
            <span className="info-value">{user.fullName}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Username:</span>
            <span className="info-value">{user.username}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{user.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
