import { useEffect, useState } from 'react';
import { getAllUsers } from '../../services/usersservices';
import MainLayout from '../../components/publiclayout';

function AllUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsers();
                setUsers(data);
            } catch (error) {
                setError('Failed to load users');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Get unique roles for filter
    const userRoles = [...new Set(users.map(user => user.role).filter(Boolean))];

    // Filter users based on search and role
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = selectedRole === '' || user.role === selectedRole;
        return matchesSearch && matchesRole;
    });

    const getRoleBadgeClass = (role: string) => {
        switch (role?.toUpperCase()) {
            case 'ADMIN':
                return 'status-badge status-admin';
            case 'USER':
                return 'status-badge status-user';
            default:
                return 'status-badge status-default';
        }
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
            <div className="admin-users-page">
                <div className="container">
                    {/* Header */}
                    <div className="admin-header">
                        <div className="admin-header-content">
                            <div>
                                <h1 className="admin-title">User Management</h1>
                                <p className="admin-subtitle">Manage and monitor all registered users</p>
                            </div>
                            <div className="admin-stats">
                                <div className="stat-badge">
                                    Total Users: {filteredUsers.length}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters Section */}
                    <div className="filters-section">
                        <div className="filters-grid">
                            <div className="filter-group">
                                <label className="filter-label">Search Users</label>
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="filter-input"
                                />
                            </div>
                            <div className="filter-group">
                                <label className="filter-label">Filter by Role</label>
                                <select
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="">All Roles</option>
                                    {userRoles.map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
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

                    {/* Users Table */}
                    {filteredUsers.length === 0 ? (
                        <div className="empty-state">
                            <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <h3 className="empty-state-title">No users found</h3>
                            <p className="empty-state-text">
                                Try adjusting your search or filter criteria
                            </p>
                        </div>
                    ) : (
                        <div className="data-table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Joined Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.user_id}>
                                            <td className="table-id">#{user.user_id}</td>
                                            <td>
                                                <div className="user-name">
                                                    <div className="user-avatar">
                                                        {user.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <span>{user.name || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="user-email">{user.email || 'N/A'}</td>
                                            <td>
                                                <span className={getRoleBadgeClass(user.role)}>
                                                    {user.role || 'USER'}
                                                </span>
                                            </td>
                                            <td className="table-date">
                                                {user.created_at 
                                                    ? new Date(user.created_at).toLocaleDateString() 
                                                    : 'N/A'}
                                            </td>
                                            <td>
                                                <button className="btn-icon" title="View Details">
                                                    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                            </td>
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

export default AllUsersPage;