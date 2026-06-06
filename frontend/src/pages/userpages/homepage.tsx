import MainLayout from '../../components/publiclayout';

import { Link } from 'react-router-dom';

function Homepage() {

  return (

<MainLayout>
  {/* Hero Section */}
  <section className="hero-section">
    <div className="hero-container">
      <h1 className="hero-title">
        Boat Rentals
      </h1>

      <p className="hero-subtitle">
        Explore premium boats and book unforgettable experiences.
      </p>

      <Link to="/boats" className="hero-button-link">
        <button className="btn btn-primary btn-lg">
          Browse Boats
        </button>
      </Link>
    </div>
  </section>

  {/* Features Section - Added extra content */}
  <section className="features-section">
    <div className="container">
      <h2 className="section-title">Why Choose Us</h2>
      <div className="features-grid">
        <div className="feature-card">
          <h3 className="feature-title">Premium Fleet</h3>
          <p className="feature-description">Luxury boats from top manufacturers</p>
        </div>
        <div className="feature-card">
          <h3 className="feature-title">Best Price Guarantee</h3>
          <p className="feature-description">Competitive rates with no hidden fees</p>
        </div>
        <div className="feature-card">
          <h3 className="feature-title">Safe & Secure</h3>
          <p className="feature-description">Fully insured and maintained boats</p>
        </div>
        <div className="feature-card">
            <h3 className="feature-title">24/7 Support</h3>
          <p className="feature-description">Round-the-clock customer service</p>
        </div>
      </div>
    </div>
  </section>

  {/* CTA Section */}
  <section className="cta-section">
    <div className="container">
      <h2 className="cta-title">Ready to Set Sail?</h2>
      <p className="cta-subtitle">Book your dream yacht today</p>
      <Link to="/boats" className="cta-button-link">
        <button className="btn btn-secondary btn-lg">
          Get Started
        </button>
      </Link>
    </div>
  </section>
</MainLayout>
  );
}

export default Homepage;