import { useState } from "react";
import { registerUser } from "../../services/authservice";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
    //states for all the registration fields
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (
  e: React.SubmitEvent
) => {

  e.preventDefault();

  try {

    const data = await registerUser({
      first_name: firstname,
      last_name: lastname,
      email,
      password,
    });

    localStorage.setItem(
      'token',
      data.access_token,
    );

    alert('Registration successful');
    navigate('/')
    
    console.log(data);

  } catch (error) {

    console.error(error);

    alert('Registration failed');
  }
};
    return (
    <div className="auth-page">
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Register</h1>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">First Name</label>
                        <input
                            type="text"
                            value={firstname}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="form-input"
                            placeholder="Enter your first name"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Last Name</label>
                        <input
                            type="text"
                            value={lastname}
                            onChange={(e) => setLastName(e.target.value)}
                            className="form-input"
                            placeholder="Enter your last name"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                            placeholder="Create a password"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block btn-lg">
                        Register
                    </button>
                </form>

                <div className="auth-footer">
                    <p className="auth-footer-text">
                        Already have an account? <a href="/login" className="auth-link">Login here</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
);
}

export default RegisterPage;