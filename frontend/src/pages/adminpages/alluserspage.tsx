import { useEffect, useState } from 'react';
import { getAllUsers } from '../../services/usersservices'


function AllUsersPage() {

  const [users, setUsers] = useState<any[]>([]);

  const [loading, setLoading] =useState(true);

  const [error, setError] =useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {const data = await getAllUsers();

      setUsers(data);
      } catch (error) {
          setError('Ошибка загрузки данных'); 
          console.error(error)
      } finally {
          setLoading(false)
      } 
    };
    fetchUsers();

    }, []);

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (

    <div>

      <h1>Users</h1>

      <ul>

        {users.map((user) => (

          <li key={user.user_id}>
            {user.name}
          </li>

        ))}

      </ul>

    </div>
  );
}

export default AllUsersPage;
