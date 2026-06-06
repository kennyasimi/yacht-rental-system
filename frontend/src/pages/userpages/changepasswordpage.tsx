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
    <div className="auth-page">
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Change Password</h1>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Old Password</label>
                        <input
                            type="password"
                            value={oldpassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="form-input"
                            placeholder="Enter your current password"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">New Password</label>
                        <input
                            type="password"
                            value={newpassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="form-input"
                            placeholder="Enter your new password"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            value={passwordconfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            className="form-input"
                            placeholder="Confirm your new password"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">
                            Change Password
                        </button>
                        
                        <button 
                            type="button"
                            onClick={() => {navigate('/profile')}}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
);
    
}

export default ChangePasswordPage