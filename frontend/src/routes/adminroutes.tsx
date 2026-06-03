import { Navigate } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
};

function AdminRoute({ children }: Props) {

  const token =localStorage.getItem('token');
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null;
  const role = user?.role;

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (role !== 'ADMIN') {
    return <Navigate to="/" />;
  }

  return children;
}

export default AdminRoute;