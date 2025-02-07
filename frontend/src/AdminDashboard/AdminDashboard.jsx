import React, { useState } from 'react';
import { Container, Row, Col } from 'reactstrap';
import './admin-dashboard.css';
import Sidebar from './components/Sidebar';
import FeaturedTours from './components/FeaturedTours';
import Packages from './components/Packages';
import Statistics from './components/Statistics';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('statistics');

    const renderContent = () => {
        switch(activeTab) {
            case 'statistics':
                return <Statistics />;
            case 'featured':
                return <FeaturedTours />;
            case 'packages':
                return <Packages />;
            default:
                return <Statistics />;
        }
    };

    return (
        <div className="admin-dashboard">
            <Container fluid>
                <Row>
                    <Col md="2" className="sidebar">
                        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                    </Col>
                    <Col md="10" className="main-content">
                        {renderContent()}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AdminDashboard; 