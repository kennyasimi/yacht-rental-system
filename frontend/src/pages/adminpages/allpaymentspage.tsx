import { useEffect, useState } from 'react';
import { getAllPayments } from '../../services/paymentservice';
import MainLayout from '../../components/publiclayout';
function AllPaymentsPage(){
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token')
    useEffect(() =>{
        const fetchPayments = async () => {
            try {const data = await getAllPayments(token || '');
            setPayments(data);

            } catch (error) {
                setError('Error when loading payments')
                console.error(error)
            } finally { 
                setLoading(false)
            }
        };
        fetchPayments();
    }, []);

    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        return<p>{error}</p>
    }

    return (
        <MainLayout>
            <div>
                <h1>Payments</h1>
                <ul>
                    {payments.map((payment) =>(
                        <li key= {payment.payment_id}>
                            {payment.amount}
                        </li>
                    ))}
                </ul>
            </div>
        </MainLayout>
    )
}

export default AllPaymentsPage;