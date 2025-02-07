import React, { useState, useEffect } from 'react';
import { Table, Button, Badge } from 'reactstrap';
import { BASE_URL } from '../../utils/config';
import './featured-tours.css';

const FeaturedTours = () => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTours();
    }, []);

    const fetchTours = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/tours`);
            const data = await res.json();
            setTours(data.data);
        } catch (error) {
            console.error('Error fetching tours:', error);
        }
        setLoading(false);
    };

    const toggleFeatured = async (tourId, currentStatus) => {
        try {
            const res = await fetch(`${BASE_URL}/tours/${tourId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ featured: !currentStatus }),
            });
            if (res.ok) {
                fetchTours();
            }
        } catch (error) {
            console.error('Error updating tour:', error);
        }
    };

    return (
        <div className="featured-tours">
            <h2>Manage Featured Tours</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Price</th>
                            <th>City</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tours.map(tour => (
                            <tr key={tour._id}>
                                <td>{tour.title}</td>
                                <td>${tour.price}</td>
                                <td>{tour.city}</td>
                                <td>
                                    <Badge color={tour.featured ? 'success' : 'secondary'}>
                                        {tour.featured ? 'Featured' : 'Not Featured'}
                                    </Badge>
                                </td>
                                <td>
                                    <Button
                                        color={tour.featured ? 'danger' : 'success'}
                                        size="sm"
                                        onClick={() => toggleFeatured(tour._id, tour.featured)}
                                    >
                                        {tour.featured ? 'Remove' : 'Add'} Featured
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default FeaturedTours; 