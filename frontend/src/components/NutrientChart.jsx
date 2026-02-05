import React, { useState } from "react";
import { Spinner } from "react-bootstrap";

const NutrientChart = ({
  title,
  currentValue,
  status,
  color,
  timeRange = "1hour",
  loading = false,
  data = [],
}) => {
  const [tooltip, setTooltip] = useState(null); // {x, y, label} or null

  const displayValue = currentValue ?? "N/A";
  const displayStatus = status ?? "N/A";
  const chartHeight = 120;
  const chartWidth = 600;

  const chartData = data.slice(-6);

  const minValue = Math.min(...chartData);
  const maxValue = Math.max(...chartData);
  const range = maxValue - minValue || 1;

  // Chart path
  const getChartPath = () => {
    if (loading || chartData.length < 2) return `M0,${chartHeight} L${chartWidth},${chartHeight}`;
    const stepX = chartWidth / (chartData.length - 1);

    return chartData
      .map((value, index) => {
        const x = index * stepX;
        const y = chartHeight - ((value - minValue) / range) * (chartHeight - 20) - 10;
        return `${index === 0 ? "M" : "L"} ${x},${y}`;
      })
      .join(" ");
  };

  const chartPath = getChartPath();

  // Y-axis labels step 10
  const min = Math.floor(minValue / 10) * 10;
  const max = Math.ceil(maxValue / 10) * 10;
  const yLabels = [];
  for (let val = min; val <= max; val += 10) yLabels.push(val);

  const stepX = chartWidth / (chartData.length - 1);

  return (
    <div className="mb-3" style={{ position: "relative" }}>
      {/* Title and Value */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>{title}</h6>
        <span className="text-muted" style={{ fontSize: "0.75rem" }}>{loading ? "Loading..." : displayStatus}</span>
      </div>
      <div className="mb-2">
        <span className="fw-bold" style={{ fontSize: "1.5rem", color }}>
          {loading ? <Spinner animation="border" size="sm" /> : displayValue}
        </span>
      </div>

      {/* Chart */}
      <div style={{ position: "relative", height: `${chartHeight}px`, marginBottom: "10px" }}>
        <svg width="100%" height={chartHeight + 20} style={{ display: "block" }}>
          {/* Horizontal grid lines */}
          {yLabels.map((val, i) => {
            const y = chartHeight - ((val - minValue) / range) * (chartHeight - 20) - 10;
            return (
              <line key={i} x1={0} y1={y} x2={chartWidth} y2={y} stroke="#f0f0f0" strokeWidth="1" />
            );
          })}

          {/* Chart fill */}
          <path d={`${chartPath} L${chartWidth},${chartHeight} L0,${chartHeight} Z`} fill={`${color}20`} stroke="none" />
          {/* Chart line */}
          <path d={chartPath} fill="none" stroke={color} strokeWidth="2" />

          {/* Y-axis labels */}
          {yLabels.map((val, i) => {
            const y = chartHeight - ((val - minValue) / range) * (chartHeight - 20) - 10 + 4;
            return <text key={i} x={0} y={y} fontSize="10" fill="#999">{val}</text>;
          })}

          {/* X-axis label */}
          <text x={chartWidth / 2} y={chartHeight + 15} fontSize="10" fill="#999" textAnchor="middle">
            Past hour
          </text>

          {/* Hover points */}
          {chartData.map((val, i) => {
            const x = i * stepX;
            const y = chartHeight - ((val - minValue) / range) * (chartHeight - 20) - 10;

            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={4}
                fill={color}
                stroke="#fff"
                strokeWidth={1}
                onMouseEnter={() => setTooltip({ x, y, value: val, label: "Past hour" })}
                onMouseLeave={() => setTooltip(null)}
              />
            );
          })}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            style={{
              position: "absolute",
              left: tooltip.x + 10,
              top: tooltip.y - 30,
              background: "#333",
              color: "#fff",
              padding: "4px 6px",
              borderRadius: "4px",
              fontSize: "0.75rem",
              pointerEvents: "none",
            }}
          >
            {tooltip.label}: {tooltip.value}
          </div>
        )}
      </div>

      {/* Bottom Info */}
      <div className="d-flex justify-content-between mt-2" style={{ fontSize: "0.7rem", color: "#999" }}>
        <span>Low</span>
        <span>Time →</span>
        <span>{loading ? "N/A" : displayStatus}</span>
      </div>
    </div>
  );
};

export default NutrientChart;
