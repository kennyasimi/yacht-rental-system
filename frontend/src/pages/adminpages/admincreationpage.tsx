import { useState } from "react";
import { registerAdmin } from "../../services/authservice";

function AdminRegistrationPage() {
    //states for all the registration fields
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const token = localStorage.getItem('token')
    const handleSubmit = async (
  e: React.SubmitEvent
) => {

  e.preventDefault();

  try {

    const data = await registerAdmin({
      first_name: firstname,
      last_name: lastname,
      email,
      password,
    }, token || '');

    alert('Registration successful');

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
                <h1 className="auth-title">Admin Registration</h1>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">First Name</label>
                        <input
                            type="text"
                            value={firstname}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="form-input"
                            placeholder="Enter first name"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Last Name</label>
                        <input
                            type="text"
                            value={lastname}
                            onChange={(e) => setLastName(e.target.value)}
                            className="form-input"
                            placeholder="Enter last name"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input"
                            placeholder="Enter email address"
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

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary btn-block">
                            Register Admin
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
);
}

export default AdminRegistrationPage;