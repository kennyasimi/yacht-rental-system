import { Link, useNavigate } from 'react-router-dom';

function AppNavbar() {
  const navigate = useNavigate();
  const handleLogout = () => {

  localStorage.removeItem('token');

  localStorage.removeItem('user');

  navigate('/login');
  };
  
  return (

    <nav className="navbar">

      <div className="navbar-container">
        <h2 className="navbar-logo">Yacht Rental</h2>
          <div className="nav-links">
            <Link to="/" className="nav-link">
              Home
            </Link>

            <Link to="/boats" className="nav-link">
              Browse Boats
            </Link>

            <Link to="/bookings/me" className="nav-link">
              My Bookings
            </Link>

            <Link to="/profile" className="nav-link">
              Profile
            </Link>

            <button onClick={handleLogout} className="nav-link signup-link">
              Logout
            </button>
          </div>

      </div>

    </nav>
  );
}

export default AppNavbar;