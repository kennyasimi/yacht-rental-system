import { useState } from 'react';
import { changePassword } from '../../services/usersservices';
import { useNavigate } from 'react-router-dom';

function ChangePasswordPage () {
    const [oldpassword, setOldPassword] = useState('');
    const [newpassword, setNewPassword] = useState('');
    const [passwordconfirm, setPasswordConfirm] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (
        e: React.SubmitEvent
        ) => {
            e.preventDefault
            const token = localStorage.getItem('token')
            try{
                 await changePassword({
                  old_password: oldpassword,
                  new_password: newpassword,
                  password_confirm: passwordconfirm
                },
                token! 
            );
                
                
                alert ('Password changed successfully');

            } catch (error){
                console.error(error);
                alert('Password change failed')
            }
        };
        return (
        <div>
            <h1>Change Password</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Old Password</label>

                    <input
                    type="password"
                    value={oldpassword}
                    onChange={(e) =>
                    setOldPassword(e.target.value)
                    }
                    />
                </div>

                <div>
                    <label>New Password</label>

                    <input
                        type="password"
                        value={newpassword}
                        onChange={(e) =>
                        setNewPassword(e.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Confirm Password</label>

                    <input
                        type="password"
                        value={passwordconfirm}
                        onChange={(e) =>
                        setPasswordConfirm(e.target.value)
                        }
                    />
                </div>


                <button type="submit">
                    Change Password
                </button>
                
                <button 
                    type= "button"
                    onClick={() =>{navigate('/profile')}}
                >Cancel</button>
            
            </form>
        </div>
    )
    
}

export default ChangePasswordPage