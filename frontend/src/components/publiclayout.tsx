import PublicNavbar from './publicnavbar';
import AppNavbar from './appnavbar';
import AdminNavbar from './adminnavbar';
import { Outlet } from 'react-router-dom';
type Props = {
  children: React.ReactNode;
};

function MainLayout({ children }: Props) {
  const token = localStorage.getItem('token');

  const getUserRole = () => {
    if (!token) return null;
    
    try {
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role; 
    } catch (error) {
      console.error('Invalid token', error);
      return null;
    }
  };
  
  const userRole = getUserRole();
  
  const renderNavbar = () => {
    if (!token) return <PublicNavbar />;
    if (userRole === 'ADMIN') return <AdminNavbar />;
    return <AppNavbar />;
  };


  return (

    <div>

      {renderNavbar()}

      <main>

        {children || <Outlet />}

      </main>

    </div>
  );
}

export default MainLayout;