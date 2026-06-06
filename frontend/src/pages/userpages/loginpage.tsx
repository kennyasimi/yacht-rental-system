import { useState } from 'react';
import { loginUser } from '../../services/authservice';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (
  e: React.SubmitEvent
  ) => {

    e.preventDefault();

    try {

        const data = await loginUser(
        email,
        password,
        );

        localStorage.setItem(
        'token',
        data.access_token,);

        localStorage.setItem('user', JSON.stringify(data.user));
        
      const userStr = localStorage.getItem('user')
      const user = userStr ? JSON.parse(userStr) : null;
      const role = user?.role;
      //alert('Login successful');
      if (data && role == "ADMIN"){
          navigate("/admin/boats", { replace: true})}
        else{
          navigate("/", {replace: true})
        }


        console.log(data);

    } catch (error) {

    console.error(error);
    alert('login failed')
    }
  };

  return (
    <div className="auth-page">
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Login</h1>

                <form onSubmit={handleSubmit} className="auth-form">
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
                            placeholder="Enter your password"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block btn-lg">
                        Login
                    </button>

                    <div className="auth-link-container">
                        <Link to="/signup" className="auth-link">
                            Create account
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
}

export default LoginPage;