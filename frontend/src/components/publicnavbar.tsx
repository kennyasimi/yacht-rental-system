import { Link } from 'react-router-dom';

function PublicNavbar() {

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

        <Link to="/login">
          Login
        </Link>

        <Link to="/signup">
          Sign Up
        </Link>

      </div>

    </nav>
  );
}

export default PublicNavbar;