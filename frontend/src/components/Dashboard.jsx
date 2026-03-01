import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Droplets, Zap, Thermometer, Wind } from "lucide-react";
import SensorCard from "./SensorCard";
import NutrientChart from "./NutrientChart";
import DataLogsTable from "./DataLogsTable";
import API from "../services/api";

const Dashboard = () => {
  const [latestSensor, setLatestSensor] = useState(null);
  const [sensorHistory, setSensorHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        setLoading(true);
        const res = await API.get("sensors/");
        // Robust data extraction
        let sensorsArray = [];
        if (Array.isArray(res.data)) {
          sensorsArray = res.data;
        } else if (res.data && Array.isArray(res.data.data)) {
          sensorsArray = res.data.data;
        } else if (res.data && typeof res.data === 'object') {
          // Sometimes results are paginated or in a results field
          sensorsArray = res.data.results || [];
        }

        if (sensorsArray.length > 0) {
          // Take last entries, oldest first
          const history = [...sensorsArray].reverse();
          setSensorHistory(history);
          setLatestSensor(history[history.length - 1]);
        } else {
          setSensorHistory([]);
          setLatestSensor(null);
        }
        setError(null);
      } catch (err) {
        console.error("Failed to fetch sensor data", err);
        setError("Failed to load sensor data");
        setSensorHistory([]);
        setLatestSensor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSensors();
    const interval = setInterval(fetchSensors, 50000); // refresh every 50s
    return () => clearInterval(interval);
  }, []);

  // Sensor cards
  const sensorData = [
    {
      id: 1,
      title: "PH",
      value: latestSensor?.ph ?? "N/A",
      unit: "",
      status:
        latestSensor && (latestSensor.ph < 5.5 || latestSensor.ph > 6.5)
          ? "Unstable"
          : "Normal",
      color: "#2ecc71",
      icon: Droplets,
    },
    {
      id: 2,
      title: "EC/TDS",
      value: latestSensor?.tds ?? "N/A",
      unit: "ppm",
      status: latestSensor ? (latestSensor.tds > 2.0 ? "High" : "Optimal") : "N/A",
      color: "#1abc9c",
      icon: Zap,
    },
    {
      id: 3,
      title: "TEMPERATURE",
      value: latestSensor?.temperature ?? "N/A",
      unit: "°C",
      status: latestSensor ? (latestSensor.temperature > 30 ? "High" : "Stable") : "N/A",
      color: "#f39c12",
      icon: Thermometer,
    },
    {
      id: 4,
      title: "HUMIDITY",
      value: latestSensor?.humidity ?? "N/A",
      unit: "%",
      status: latestSensor ? (latestSensor.humidity < 40 ? "Low" : "Good") : "N/A",
      color: "#3498db",
      icon: Wind,
    },
  ];

  const filterData = (data) => {
    if (!data || data.length === 0) return [];

    const now = new Date();
    const cutoff = new Date(now.getTime() - 5 * 60 * 60 * 1000); // Past 5 hours

    const filtered = data.filter(item => new Date(item.timestamp) >= cutoff);

    // Fallback: If no data in period, return the last 50 items
    return filtered.length > 0 ? filtered : data.slice(-50);
  };

  const sampleData = (data) => {
    if (!data || data.length === 0) return [];

    // Use a smaller bucket (1 minute) for a more "continuous" look
    const intervalMs = 1 * 60 * 1000;

    const groups = {};
    data.forEach(item => {
      const time = new Date(item.timestamp).getTime();
      if (isNaN(time)) return; // Skip invalid dates
      const bucket = Math.floor(time / intervalMs) * intervalMs;
      if (!groups[bucket]) groups[bucket] = [];
      groups[bucket].push(item);
    });

    return Object.keys(groups)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map(bucket => {
        const group = groups[bucket];
        const avgPh = group.reduce((acc, i) => acc + (parseFloat(i.ph) || 0), 0) / group.length;
        const avgTds = group.reduce((acc, i) => acc + (parseFloat(i.tds) || 0), 0) / group.length;
        return {
          timestamp: new Date(parseInt(bucket)).toISOString(),
          ph: Number(avgPh.toFixed(2)),
          tds: Number(avgTds.toFixed(2)),
        };
      });
  };

  const filteredHistory = filterData(sensorHistory);
  const sampledHistory = sampleData(filteredHistory);

  return (
    <Container fluid className="py-4 px-4">
      {error && <p className="text-center text-danger">{error}</p>}

      {/* Sensor Cards */}
      <Row className="g-4 mb-4">
        {sensorData.map((sensor) => (
          <Col key={sensor.id} xs={12} sm={6} lg={3}>
            <SensorCard {...sensor} loading={loading} />
          </Col>
        ))}
      </Row>

      {/* Nutrient Levels */}
      <Row className="g-4 mb-4">
        <Col xs={12}>
          <Card className="border-0 shadow-sm" style={{ borderRadius: "16px" }}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">Nutrient Levels Overview </h5>
              </div>

              {/* Charts */}
              <Row className="justify-content-evenly">
                <Col md={5}>
                  <NutrientChart
                    title="pH Levels"
                    currentValue={latestSensor?.ph}
                    data={sampledHistory}
                    dataKey="ph"
                    status={latestSensor ? "Live" : "N/A"}
                    color="#10b981"
                    loading={loading}
                  />
                </Col>

                <Col md={5}>
                  <NutrientChart
                    title="EC Levels"
                    currentValue={latestSensor?.tds}
                    data={sampledHistory}
                    dataKey="tds"
                    status={latestSensor ? "Live" : "N/A"}
                    color="#10b981"
                    loading={loading}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Data Logs Table */}
      <Row className="g-4 mb-4">
        <Col xs={12}>
          <DataLogsTable />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
