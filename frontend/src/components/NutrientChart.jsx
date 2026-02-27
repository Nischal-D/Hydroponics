import React from 'react';
import { Spinner } from 'react-bootstrap';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const NutrientChart = ({ title, currentValue, status, color, data = [], dataKey, loading = false }) => {
  const displayValue = currentValue ?? 'N/A';
  const displayStatus = status ?? 'N/A';
  const chartHeight = 120;

  // Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
      const value = payload[0].value;
      return (
        <div className="bg-white p-2 border border-secondary rounded shadow-sm" style={{ fontSize: '0.8rem' }}>
          <p className="mb-0 fw-bold">{new Date(label).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <p className="mb-0" style={{ color: color }}>
            {typeof value === 'number' ? value.toFixed(2) : value}
          </p>
        </div>
      );
    }
    return null;
  };

  // Format X-Axis ticks
  const formatXAxis = (tickItem) => {
    if (!tickItem) return '';
    const date = new Date(tickItem);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>{title}</h6>
        <div className="d-flex align-items-center">
          {loading ? (
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>Loading...</span>
          ) : (
            <>
              <div
                className="me-2 rounded-circle"
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: status === 'Live' ? '#10b981' : '#ccc',
                  boxShadow: status === 'Live' ? '0 0 8px #10b981' : 'none'
                }}
              />
              <span className="text-muted" style={{ fontSize: '0.75rem' }}>{displayStatus}</span>
            </>
          )}
        </div>
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
            <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                fillOpacity={1}
                fill={`url(#gradient-${dataKey})`}
                strokeWidth={3}
                animationDuration={1500}
                connectNulls={true}
              />
              <XAxis
                dataKey="timestamp"
                tick={{ fontSize: '10px', fill: '#999' }}
                tickFormatter={formatXAxis}
                axisLine={false}
                tickLine={false}
                minTickGap={30}
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
