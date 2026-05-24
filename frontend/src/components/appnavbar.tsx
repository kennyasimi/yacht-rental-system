import { Link, useNavigate } from 'react-router-dom';

function AppNavbar() {
  const navigate = useNavigate();
  const handleLogout = () => {

  localStorage.removeItem('token');

  localStorage.removeItem('user');

  navigate('/login');
  };
  
  return (

    <nav>

      <h2>Yacht Rental</h2>

      <div>

        <Link to="/">
          Home
        </Link>

        <Link to="/boats">
          Browse Boats
        </Link>

        <Link to="/bookings">
          Bookings
        </Link>

        <Link to="/payments">
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

export default AppNavbar;