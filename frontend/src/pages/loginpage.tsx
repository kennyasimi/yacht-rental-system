import { useState } from 'react';
import { loginUser } from '../services/authservice';
import { useNavigate } from 'react-router-dom';

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
        

      //alert('Login successful');
      if (data) {navigate("/", { replace: true})}


        console.log(data);

    } catch (error) {

    console.error(error);
    alert('login failed')
    }
  };

  return (
    <div>

      <h1>Login</h1>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
        </div>

        <div>
          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
        </div>

        <button type="submit">
          Login
        </button>

      </form>

    </div>
  );
}

export default LoginPage;