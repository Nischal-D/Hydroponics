import React from 'react';
import { Card, Spinner } from 'react-bootstrap';

const SensorCard = ({ title, value, unit, status, color, icon: Icon, loading = false }) => {
  const displayValue = value ?? 'N/A';
  const displayStatus = status ?? 'N/A';

  return (
    <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
      <Card.Body className="p-4 d-flex flex-column">
        {/* Header with icon and title */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: `${color}15`,
              color: color
            }}
          >
            <Icon size={20} />
          </div>
          <span
            className="text-muted text-uppercase fw-semibold"
            style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}
          >
            {title}
          </span>
        </div>

        {/* Value and Status */}
        <div className="mt-auto">
          <div className="d-flex align-items-baseline mb-1">
            <h2 className="fw-bold mb-0 text-dark" style={{ fontSize: '2.5rem' }}>
              {loading ? <Spinner animation="border" size="sm" /> : displayValue}
            </h2>
            {unit && <span className="text-secondary ms-1" style={{ fontSize: '1rem' }}>{unit}</span>}
          </div>
          <div className="fw-medium" style={{ color: color, fontSize: '0.9rem' }}>
            {loading ? 'Loading...' : displayStatus}
          </div>
        </div>

        {/* Progress bar at bottom */}
        <div className="mt-3">
          <div
            style={{
              height: '5px',
              backgroundColor: `${color}20`,
              borderRadius: '10px',
              width: '100%',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                height: '100%',
                width: '100%',
                backgroundColor: color,
                borderRadius: '10px'
              }}
            />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SensorCard;
