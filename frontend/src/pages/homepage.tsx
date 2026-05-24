import MainLayout from '../components/publiclayout';

import { Link } from 'react-router-dom';

function Homepage() {

  return (

    <MainLayout>

      <section>

        <h1>
          Luxury Yacht Rentals
        </h1>

        <p>
          Explore premium boats and
          book unforgettable experiences.
        </p>

        <Link to="/boats">

          <button>
            Browse Boats
          </button>

        </Link>

      </section>

    </MainLayout>
  );
}

export default Homepage;