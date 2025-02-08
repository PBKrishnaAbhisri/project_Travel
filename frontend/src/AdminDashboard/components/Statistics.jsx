import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Table } from 'reactstrap';
import { BASE_URL } from '../../utils/config';
import './statistics.css';

const Statistics = () => {
    const [stats, setStats] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        recentBookings: [],
        allBookings: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStatistics = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                throw new Error('No admin token found');
            }

            const res = await fetch(`${BASE_URL}/booking`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!res.ok) {
                if (res.status === 401) {
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('isAdmin');
                    window.location.href = '/admin/login';
                    throw new Error('Session expired. Please login again.');
                }
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to fetch statistics');
            }

            const data = await res.json();
            if (data.success) {
                setStats({
                    totalBookings: data.data.totalBookings || 0,
                    totalRevenue: data.data.totalRevenue || 0,
                    recentBookings: data.data.recentBookings || [],
                    allBookings: data.data.allBookings || []
                });
            } else {
                throw new Error(data.message || 'Failed to fetch statistics');
            }
        } catch (err) {
            console.error('Statistics error:', err);
            setError(err.message);
            if (err.message.includes('login')) {
                setTimeout(() => {
                    window.location.href = '/admin/login';
                }, 2000);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatistics();
        const interval = setInterval(fetchStatistics, 300000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="statistics-loading">
                <h4>Loading statistics...</h4>
            </div>
        );
    }

    if (error) {
        return (
            <div className="statistics-error">
                <h4>Error: {error}</h4>
                <button 
                    className="btn btn-primary mt-3" 
                    onClick={fetchStatistics}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="statistics">
            <h2 className="mb-4">Dashboard Overview</h2>
            <Row>
                <Col md="6">
                    <Card className="stat-card">
                        <CardBody>
                            <div className="stat-icon">📊</div>
                            <h3 className="stat-value">{stats.totalBookings}</h3>
                            <p className="stat-title">Total Bookings</p>
                        </CardBody>
                    </Card>
                </Col>
                <Col md="6">
                    <Card className="stat-card">
                        <CardBody>
                            <div className="stat-icon">💰</div>
                            <h3 className="stat-value">${stats.totalRevenue.toFixed(2)}</h3>
                            <p className="stat-title">Total Revenue</p>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <h3 className="mt-5 mb-4">Recent Bookings</h3>
            {stats.recentBookings.length > 0 ? (
                <Table responsive className="recent-bookings-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Tour</th>
                            <th>Price</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.recentBookings.map((booking, index) => (
                            <tr key={booking._id || index}>
                                <td>
                                    <div className="user-info">
                                        <span className="username">
                                            {booking.userId?.username || 'N/A'}
                                        </span>
                                        <span className="email">
                                            {booking.userId?.email || 'N/A'}
                                        </span>
                                    </div>
                                </td>
                                <td>{booking.tourId?.title || 'N/A'}</td>
                                <td>${booking.price?.toFixed(2) || '0.00'}</td>
                                <td>
                                    {new Date(booking.createdAt).toLocaleDateString()}
                                </td>
                                <td>
                                    <span className={`status-badge ${booking.status?.toLowerCase() || 'pending'}`}>
                                        {booking.status || 'Pending'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p className="text-center">No recent bookings found</p>
            )}
        </div>
    );
};

export default Statistics;
