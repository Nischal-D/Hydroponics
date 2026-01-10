import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, ButtonGroup } from 'react-bootstrap';
import { Droplets, Zap, Thermometer, Wind } from 'lucide-react';
import SensorCard from './SensorCard';
import NutrientChart from './NutrientChart';
import AlertItem from './AlertItem';
import AlertDetails from './AlertDetails';

const Dashboard = () => {
    // Sensor data for the top cards
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

    // Alert data
    const alerts = [
        { id: 1, type: 'warning', title: 'High EC Level Detected', time: '11:30 AM' },
        { id: 2, type: 'warning', title: 'Low pH Warning', time: '10:15 AM' },
        { id: 3, type: 'info', title: 'Temperature Fluctuation', time: '09:45 AM' },
    ];

    // Time range state for charts
    const [timeRange, setTimeRange] = useState('1hour');

    // Selected alert for details view
    const [selectedAlert, setSelectedAlert] = useState(null);

    return (
        <Container fluid className="py-4 px-4">
            {/* Sensor Cards Row */}
            <Row className="g-4 mb-4">
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

            {/* Nutrient Levels and Alerts Row */}
            <Row className="g-4 mb-4">
                {/* Nutrient Levels Overview */}
                <Col xs={12} lg={8}>
                    <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                        <Card.Body className="p-4">
                            <h5 className="mb-4">Nutrient Levels Overview</h5>

                            {/* Time range buttons */}
                            <div className="mb-4">
                                <ButtonGroup size="sm">
                                    <Button
                                        variant={timeRange === '1hour' ? 'success' : 'outline-secondary'}
                                        onClick={() => setTimeRange('1hour')}
                                        style={{ borderRadius: '20px 0 0 20px' }}
                                    >
                                        1 Hour
                                    </Button>
                                    <Button
                                        variant={timeRange === '24hours' ? 'success' : 'outline-secondary'}
                                        onClick={() => setTimeRange('24hours')}
                                    >
                                        24 Hours
                                    </Button>
                                    <Button
                                        variant={timeRange === '1week' ? 'success' : 'outline-secondary'}
                                        onClick={() => setTimeRange('1week')}
                                        style={{ borderRadius: '0 20px 20px 0' }}
                                    >
                                        1 Week
                                    </Button>
                                </ButtonGroup>
                            </div>

                            {/* Charts */}
                            <Row>
                                <Col md={6}>
                                    <NutrientChart
                                        title="pH Levels"
                                        currentValue="6.5"
                                        status="High"
                                        color="#3b82f6"
                                        timeRange={timeRange}
                                    />
                                </Col>
                                <Col md={6}>
                                    <NutrientChart
                                        title="EC Levels"
                                        currentValue="1.8"
                                        status="High"
                                        color="#10b981"
                                        timeRange={timeRange}
                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Alerts Panel */}
                <Col xs={12} lg={4}>
                    {selectedAlert ? (
                        <AlertDetails
                            alert={selectedAlert}
                            onClose={() => setSelectedAlert(null)}
                        />
                    ) : (
                        <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                            <Card.Body className="p-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="mb-0">Alerts</h5>
                                    <span className="badge bg-danger rounded-pill">{alerts.length} Active</span>
                                </div>

                                {/* Alert items */}
                                <div>
                                    {alerts.map((alert) => (
                                        <AlertItem
                                            key={alert.id}
                                            type={alert.type}
                                            title={alert.title}
                                            time={alert.time}
                                            onClick={() => setSelectedAlert(alert)}
                                        />
                                    ))}
                                </div>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
