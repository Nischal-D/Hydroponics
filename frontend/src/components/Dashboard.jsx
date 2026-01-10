import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Droplets, Zap, Thermometer, Wind } from 'lucide-react';
import SensorCard from './SensorCard';

const Dashboard = () => {
    const sensorData = [
        {
            id: 1,
            title: 'PH',
            value: '5.9',
            unit: '',
            status: 'Normal',
            color: '#2ecc71', // Green
            icon: Droplets,
        },
        {
            id: 2,
            title: 'EC/TDS',
            value: '1.5',
            unit: 'mS/cm',
            status: 'Optimal',
            color: '#1abc9c', // Teal
            icon: Zap,
        },
        {
            id: 3,
            title: 'TEMPERATURE',
            value: '26',
            unit: '°C',
            status: 'Stable',
            color: '#f39c12', // Orange
            icon: Thermometer,
        },
        {
            id: 4,
            title: 'HUMIDITY',
            value: '62',
            unit: '%',
            status: 'Good',
            color: '#3498db', // Blue
            icon: Wind,
        },
    ];

    return (
        <Container fluid className="py-4 px-4">
            <Row className="g-4">
                {sensorData.map((sensor) => (
                    <Col key={sensor.id} xs={12} sm={6} lg={3}>
                        <SensorCard
                            title={sensor.title}
                            value={sensor.value}
                            unit={sensor.unit}
                            status={sensor.status}
                            color={sensor.color}
                            icon={sensor.icon}
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Dashboard;
