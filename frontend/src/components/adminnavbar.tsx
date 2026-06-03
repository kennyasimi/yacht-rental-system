import { Link, useNavigate } from 'react-router-dom';

function AdminNavbar () {
    const navigate = useNavigate();
    const handleLogout = () => {

  localStorage.removeItem('token');

  localStorage.removeItem('user');

  navigate('/login');
  };

  return(
    <nav>
      <h2>Admin Dashboard</h2>
      <div>
        <Link to="/admin/boats">
          Boats
        </Link>
        
        <Link to="/admin/bookings">
          Bookings
        </Link>

        <Link to="/admin/payments">
          Payments
        </Link>
        
        <Link to="/profile">
          Profile
        </Link>

        <button onClick={handleLogout}>
          Logout
        </button>

      </div>

    </nav>

  );
  
}

export default AdminNavbar;