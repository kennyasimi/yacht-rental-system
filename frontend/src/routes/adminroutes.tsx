import { Navigate } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
};

function AdminRoute({ children }: Props) {

  const token =
    localStorage.getItem('token');

  const role =
    localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (role !== 'ADMIN') {
    return <Navigate to="/" />;
  }

  return children;
}

export default AdminRoute;