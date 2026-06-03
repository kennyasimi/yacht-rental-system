import { useState, useEffect } from "react";
import { getAllBookings } from "../../services/bookingservice";
import MainLayout from "../../components/publiclayout";

function AllBookingsPage () {

const [bookings, setBookings] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('')
const token = localStorage.getItem('token')
useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getAllBookings(token || '');

        setBookings(data);
      } catch (error) {
          setError('Ошибка загрузки данных'); 
          console.error(error)
      } finally {
          setLoading(false)
      } 
    };
    fetchBookings();

    }, []);

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
return(
    <MainLayout>
        <div>

      <h1>Bookings</h1>

      <ul>

        {bookings.map((booking) => (

          <li key={booking.booking_id}>
            {booking.date}
          </li>

        ))}

      </ul>

    </div>
    </MainLayout>
);

}
export default AllBookingsPage;
