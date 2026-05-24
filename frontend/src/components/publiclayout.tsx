import PublicNavbar from './publicnavbar';
import AppNavbar from './appnavbar';
import { Outlet } from 'react-router-dom';
type Props = {
  children: React.ReactNode;
};

function MainLayout({ children }: Props) {
  const token = localStorage.getItem('token');
  return (

    <div>

      {
        token
          ? <AppNavbar />
          : <PublicNavbar />
      }

      <main>

        {children || <Outlet />}

      </main>

    </div>
  );
}

export default MainLayout;