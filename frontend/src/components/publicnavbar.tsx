import { Link } from 'react-router-dom';

function PublicNavbar() {

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

          <Link to="/login" className="nav-link">
            Login
          </Link>

          <Link to="/signup" className="nav-link signup-link">
            Sign Up
          </Link>         
        </div>
      </div>
    </nav>
  );
}

export default PublicNavbar;