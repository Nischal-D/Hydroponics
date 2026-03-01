import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { X } from 'lucide-react';

const AlertDetails = ({ alert, onClose }) => {
    if (!alert) return null;

    const getAlertDetails = () => {
        switch (alert.id) {
            case 1:
                return {
                    description: 'EC levels exceeded the optimal range of 1.4-1.6 mS/cm, reaching 1.7 mS/cm.',
                    recommendation: 'Consider diluting the nutrient solution or checking for evaporation issues. Monitor levels closely for the next hour.',
                    severity: 'Warning'
                };
            case 2:
                return {
                    description: 'pH levels dropped below the recommended range of 5.5-6.5, currently at 5.2.',
                    recommendation: 'Add pH up solution gradually to bring levels back to optimal range. Check after 15 minutes.',
                    severity: 'Warning'
                };
            case 3:
                return {
                    description: 'Temperature has fluctuated by 3°C in the last hour, which may stress plants.',
                    recommendation: 'Check cooling/heating system. Ensure proper ventilation and monitor for next 2 hours.',
                    severity: 'Info'
                };
            default:
                return {
                    description: 'No additional details available.',
                    recommendation: 'Monitor the situation.',
                    severity: 'Info'
                };
        }
    };

    const details = getAlertDetails();

    return (
        <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
            <Card.Body className="p-4">
                {/* Header with close button */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <h5 className="mb-1">{alert.title}</h5>
                        <small className="text-muted">{alert.time}</small>
                    </div>
                    <Button
                        variant="link"
                        className="text-muted p-0"
                        onClick={onClose}
                        style={{ textDecoration: 'none' }}
                    >
                        <X size={24} />
                    </Button>
                </div>

                {/* Details Section */}
                <div className="mb-4">
                    <h6 className="fw-semibold mb-2">Details</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                        {details.description}
                    </p>
                </div>

                {/* Recommended Action Section */}
                <div
                    className="p-3 mb-3"
                    style={{
                        backgroundColor: '#d1f4dd',
                        borderRadius: '8px',
                        border: '1px solid #b8ecc9'
                    }}
                >
                    <h6 className="fw-semibold mb-2" style={{ color: '#0f7535' }}>
                        Recommended Action
                    </h6>
                    <p className="mb-0" style={{ fontSize: '0.9rem', color: '#2d5f3d' }}>
                        {details.recommendation}
                    </p>
                </div>

                {/* Severity Badge */}
                <div className="d-flex gap-2">
                    <span
                        className="badge px-3 py-2"
                        style={{
                            backgroundColor: '#ffc107',
                            color: '#000',
                            fontSize: '0.85rem',
                            fontWeight: '500'
                        }}
                    >
                        {details.severity}
                    </span>
                    <span className="text-muted align-self-center" style={{ fontSize: '0.85rem' }}>
                        Severity Level
                    </span>
                </div>
            </Card.Body>
        </Card>
    );
};

export default AlertDetails;
