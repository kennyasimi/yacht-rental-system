import { useEffect, useState } from 'react';
import { getAllPayments } from '../../services/paymentservice';
import MainLayout from '../../components/publiclayout';

function AllPaymentsPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const data = await getAllPayments(token || '');
                setPayments(data);
            } catch (error) {
                setError('Error when loading payments');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, [token]);

    // Get unique statuses for filter
    const paymentStatuses = ['SUCCESSFUL', 'FAILED', 'PENDING'];

    // Filter and sort payments
    const filteredPayments = payments
        .filter(payment => {
            const matchesSearch = payment.bookings?.user_id?.toString().includes(searchTerm) ||
                                 payment.payment_id?.toString().includes(searchTerm);
            const matchesStatus = statusFilter === '' || payment.payment_status === statusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (sortBy === 'newest') {
                return new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime();
            } else if (sortBy === 'oldest') {
                return new Date(a.payment_date).getTime() - new Date(b.payment_date).getTime();
            } else if (sortBy === 'amount_high') {
                return (b.amount || 0) - (a.amount || 0);
            } else if (sortBy === 'amount_low') {
                return (a.amount || 0) - (b.amount || 0);
            }
            return 0;
        });

    const getPaymentStatusBadge = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'SUCCESSFUL':
                return 'status-badge status-success';
            case 'FAILED':
                return 'status-badge status-failed';
            case 'PENDING':
                return 'status-badge status-pending';
            default:
                return 'status-badge status-default';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount || 0);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTotalAmount = () => {
        return filteredPayments.reduce((sum, payment) => {
            if (payment.payment_status === 'SUCCESSFUL') {
                return sum + (+payment.amount || 0);
            }
            return sum;
        }, 0);
    };

    const getSuccessRate = () => {
        const successful = payments.filter(p => p.payment_status === 'SUCCESSFUL').length;
        const total = payments.length;
        if (total === 0) return 0;
        return ((successful / total) * 100).toFixed(1);
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="loading-container">
                    <div className="spinner"></div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="admin-payments-page">
                <div className="container">
                    {/* Header */}
                    <div className="admin-header">
                        <div className="admin-header-content">
                            <div>
                                <h1 className="admin-title">Payment Management</h1>
                                <p className="admin-subtitle">Track and monitor all payment transactions</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-card-icon stat-icon-total">
                                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="stat-card-content">
                                <p className="stat-card-label">Total Revenue</p>
                                <p className="stat-card-value">{formatCurrency(getTotalAmount())}</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-card-icon stat-icon-success">
                                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="stat-card-content">
                                <p className="stat-card-label">Success Rate</p>
                                <p className="stat-card-value">{getSuccessRate()}%</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-card-icon stat-icon-count">
                                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <div className="stat-card-content">
                                <p className="stat-card-label">Total Transactions</p>
                                <p className="stat-card-value">{payments.length}</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-card-icon stat-icon-avg">
                                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <div className="stat-card-content">
                                <p className="stat-card-label">Average Payment</p>
                                <p className="stat-card-value">
                                    {formatCurrency(getTotalAmount() / payments.filter(p => p.payment_status === 'SUCCESSFUL').length || 0)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Filters Section */}
                    <div className="filters-section">
                        <div className="filters-grid">
                            <div className="filter-group">
                                <label className="filter-label">Search</label>
                                <input
                                    type="text"
                                    placeholder="Search by Payment ID or User ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="filter-input"
                                />
                            </div>
                            <div className="filter-group">
                                <label className="filter-label">Payment Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="">All Statuses</option>
                                    {paymentStatuses.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="filter-group">
                                <label className="filter-label">Sort By</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="amount_high">Highest Amount</option>
                                    <option value="amount_low">Lowest Amount</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {/* Payments Table */}
                    {filteredPayments.length === 0 ? (
                        <div className="empty-state">
                            <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            <h3 className="empty-state-title">No payments found</h3>
                            <p className="empty-state-text">
                                Try adjusting your search or filter criteria
                            </p>
                        </div>
                    ) : (
                        <div className="data-table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Payment ID</th>
                                        <th>Booking ID</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Payment Method</th>
                                        <th>Date</th>
                                        <th>User ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPayments.map((payment) => (
                                        <tr key={payment.payment_id}>
                                            <td className="table-id">#{payment.payment_id}</td>
                                            <td className="table-id">#{payment.booking_id}</td>
                                            <td className="payment-amount">
                                                {formatCurrency(payment.amount)}
                                            </td>
                                            <td>
                                                <span className={getPaymentStatusBadge(payment.payment_status)}>
                                                    {payment.payment_status || 'PENDING'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="payment-method">
                                                    {payment.payment_method?.replace('_', ' ') || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="table-date">
                                                {formatDate(payment.payment_date)}
                                            </td>
                                            <td className="table-id">#{payment.bookings?.user_id || 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}

export default AllPaymentsPage;