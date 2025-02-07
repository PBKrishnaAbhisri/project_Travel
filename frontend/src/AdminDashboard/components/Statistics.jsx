import React from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import './statistics.css';

const Statistics = () => {
    const stats = [
        { title: 'Total Tours', value: '24', icon: '🗺️' },
        { title: 'Total Bookings', value: '156', icon: '📅' },
        { title: 'Active Users', value: '89', icon: '👥' },
        { title: 'Revenue', value: '$12,456', icon: '💰' }
    ];

    return (
        <div className="statistics">
            <h2 className="mb-4">Dashboard Overview</h2>
            <Row>
                {stats.map((stat, index) => (
                    <Col md="3" sm="6" key={index}>
                        <Card className="stat-card mb-4">
                            <CardBody>
                                <div className="stat-icon">{stat.icon}</div>
                                <h3 className="stat-value">{stat.value}</h3>
                                <p className="stat-title">{stat.title}</p>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default Statistics;
