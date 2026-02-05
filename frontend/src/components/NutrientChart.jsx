import React from 'react';
import { Spinner } from 'react-bootstrap';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const NutrientChart = ({ title, currentValue, status, color, data = [], dataKey, loading = false }) => {
  const displayValue = currentValue ?? 'N/A';
  const displayStatus = status ?? 'N/A';
  const chartHeight = 120;

  // Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-secondary rounded shadow-sm" style={{ fontSize: '0.8rem' }}>
          <p className="mb-0 fw-bold">{new Date(label).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <p className="mb-0" style={{ color: color }}>
            {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>{title}</h6>
        <span className="text-muted" style={{ fontSize: '0.75rem' }}>{loading ? 'Loading...' : displayStatus}</span>
      </div>

      <div className="mb-2">
        <span className="fw-bold" style={{ fontSize: '1.5rem', color: color }}>
          {loading ? <Spinner animation="border" size="sm" /> : displayValue}
        </span>
      </div>

      <div style={{ position: 'relative', height: `${chartHeight}px`, marginBottom: '10px' }}>
        {loading || !data || data.length === 0 ? (
          <div className="d-flex justify-content-center align-items-center h-100 text-muted" style={{ fontSize: '0.8rem' }}>
            {loading ? 'Loading Chart...' : 'No Data Available'}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[...data].reverse()}>
              <defs>
                <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                fillOpacity={1}
                fill={`url(#gradient-${dataKey})`}
                strokeWidth={2}
              />
              <XAxis
                dataKey="timestamp"
                hide
              />
              <YAxis hide domain={['auto', 'auto']} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="d-flex justify-content-between mt-2" style={{ fontSize: '0.7rem', color: '#999' }}>
        <span>Low</span>
        <span>Time →</span>
        <span>{loading ? 'N/A' : displayStatus}</span>
      </div>
    </div>
  );
};

export default NutrientChart;
