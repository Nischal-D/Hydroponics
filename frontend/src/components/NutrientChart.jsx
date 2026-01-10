import React from 'react';
import { Card } from 'react-bootstrap';

const NutrientChart = ({ title, currentValue, status, color, timeRange = '1hour' }) => {
    // Simple chart visualization
    const chartHeight = 120;

    // Generate different time labels based on time range
    const getTimeLabels = () => {
        switch (timeRange) {
            case '1hour':
                return ['11:00', '11:10', '11:20', '11:30', '11:40', '11:45'];
            case '24hours':
                return ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
            case '1week':
                return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            default:
                return ['11:00', '11:10', '11:20', '11:30', '11:40', '11:45'];
        }
    };

    // Generate different chart paths based on time range
    const getChartPath = () => {
        switch (timeRange) {
            case '1hour':
                return `M 0,${chartHeight - 20} 
                Q 25,${chartHeight - 30} 50,${chartHeight - 25} 
                T 100,${chartHeight - 35} 
                Q 150,${chartHeight - 32} 200,${chartHeight - 40}
                T 300,${chartHeight - 38}
                Q 350,${chartHeight - 42} 400,${chartHeight - 35}
                T 500,${chartHeight - 30}
                Q 550,${chartHeight - 35} 600,${chartHeight - 32}`;
            case '24hours':
                return `M 0,${chartHeight - 25} 
                Q 50,${chartHeight - 35} 100,${chartHeight - 30} 
                T 200,${chartHeight - 40} 
                Q 250,${chartHeight - 38} 300,${chartHeight - 35}
                T 400,${chartHeight - 32}
                Q 500,${chartHeight - 28} 600,${chartHeight - 30}`;
            case '1week':
                return `M 0,${chartHeight - 30} 
                Q 50,${chartHeight - 40} 100,${chartHeight - 35} 
                T 200,${chartHeight - 45} 
                Q 300,${chartHeight - 42} 400,${chartHeight - 38}
                T 600,${chartHeight - 35}`;
            default:
                return `M 0,${chartHeight - 20} 
                Q 25,${chartHeight - 30} 50,${chartHeight - 25} 
                T 100,${chartHeight - 35} 
                Q 150,${chartHeight - 32} 200,${chartHeight - 40}
                T 300,${chartHeight - 38}
                Q 350,${chartHeight - 42} 400,${chartHeight - 35}
                T 500,${chartHeight - 30}
                Q 550,${chartHeight - 35} 600,${chartHeight - 32}`;
        }
    };

    const timeLabels = getTimeLabels();
    const chartPath = getChartPath();

    return (
        <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>{title}</h6>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>{status}</span>
            </div>

            {/* Current Value */}
            <div className="mb-2">
                <span className="fw-bold" style={{ fontSize: '1.5rem', color: color }}>
                    {currentValue}
                </span>
            </div>

            {/* Simple SVG Chart */}
            <div style={{ position: 'relative', height: `${chartHeight}px`, marginBottom: '10px' }}>
                <svg width="100%" height={chartHeight} style={{ display: 'block' }}>
                    {/* Grid lines */}
                    <line x1="0" y1={chartHeight / 2} x2="100%" y2={chartHeight / 2} stroke="#f0f0f0" strokeWidth="1" />
                    <line x1="0" y1={chartHeight} x2="100%" y2={chartHeight} stroke="#f0f0f0" strokeWidth="1" />

                    {/* Chart area fill */}
                    <path
                        d={`${chartPath} L 600,${chartHeight} L 0,${chartHeight} Z`}
                        fill={`${color}20`}
                        stroke="none"
                    />

                    {/* Chart line */}
                    <path
                        d={chartPath}
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                    />
                </svg>
            </div>

            {/* Time labels */}
            <div className="d-flex justify-content-between" style={{ fontSize: '0.7rem', color: '#999' }}>
                {timeLabels.map((label, index) => (
                    <span key={index}>{label}</span>
                ))}
            </div>

            {/* Low/High indicators */}
            <div className="d-flex justify-content-between mt-2" style={{ fontSize: '0.7rem', color: '#999' }}>
                <span>Low</span>
                <span>Time →</span>
                <span>{status}</span>
            </div>
        </div>
    );
};

export default NutrientChart;
