import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function BoatsPage() {

  const [boats, setBoats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/boats')
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }

        return response.json();
      })

      .then((data) => {

        setBoats(data);

        setLoading(false);
      })

      .catch(() => {

        setError('Ошибка загрузки данных');

        setLoading(false);
      });

  }, []);

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (

    <div>

      <h1>Boats</h1>

      <ul>

        {boats.map((boat) => (

          <li key={boat.boat_id}>

            <Link to={`/boats/${boat.boat_id}`}>

              {boat.name}

            </Link>

          </li>

        ))}

      </ul>

    </div>
  );
}

export default BoatsPage; 

// This page is only used for demonstrating APIs for practical 8