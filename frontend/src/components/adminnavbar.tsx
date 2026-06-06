import { Link, useNavigate } from 'react-router-dom';

function AdminNavbar () {
    const navigate = useNavigate();
    const handleLogout = () => {

  localStorage.removeItem('token');

  localStorage.removeItem('user');

  navigate('/login');
  };

  return(
    <nav className= "navbar">
      <div className="navbar-container">
      <h2 className='navbar-logo'>Admin Dashboard</h2>
        <div className='nav-links'>
          <Link to="/admin/boats" className="nav-link">
            Boats
          </Link>
          
          <Link to="/admin/bookings" className="nav-link">
            Bookings
          </Link>

          <Link to="/admin/payments" className="nav-link">
            Payments
          </Link>

          <Link to="/admin/users" className="nav-link">
            Users
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

export default AdminNavbar;