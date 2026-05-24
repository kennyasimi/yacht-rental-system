import { useEffect, useState } from 'react';
import { getAllUsers } from '../services/usersservices'


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



/* 
function AllUsersPage() {

 
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {

    fetch('http://localhost:3000/users', {
      headers: {
        Authorization:
          `Bearer ${localStorage.getItem('token')}`,
      },
    })

      .then((response) => {

        if (!response.ok) {
          throw new Error();
        }

        return response.json();
      })

      .then((data) => {

        setUsers(data);

        setLoading(false);
      })

      .catch(() => {

        setError('Ошибка загрузки данных');

        setLoading(false);
      });

  }, []);

  // Conditional rendering
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

            {user.first_name}
            {' '}
            {user.last_name}

          </li>

        ))}

      </ul>

    </div>
  );
} 

export default AllUsersPage;*/


