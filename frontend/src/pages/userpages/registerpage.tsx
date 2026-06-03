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
        <div>
            <h1>Register</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>First Name</label>

                    <input
                    type="text"
                    value={firstname}
                    onChange={(e) =>
                    setFirstName(e.target.value)
                    }
                    />
                </div>

                <div>
                    <label>Last Name</label>

                    <input
                        type="text"
                        value={lastname}
                        onChange={(e) =>
                        setLastName(e.target.value)
                        }
                    />
                </div>

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
                Register
                </button>
            </form>
        </div>

        
    );
}

export default RegisterPage;