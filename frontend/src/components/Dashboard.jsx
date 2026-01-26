import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, ButtonGroup } from "react-bootstrap";
import { Droplets, Zap, Thermometer, Wind } from "lucide-react";
import SensorCard from "./SensorCard";
import NutrientChart from "./NutrientChart";
import AlertItem from "./AlertItem";
import AlertDetails from "./AlertDetails";
import DataLogsTable from "./DataLogsTable";
import API from "../services/api";

const Dashboard = () => {
  const [latestSensor, setLatestSensor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [timeRange, setTimeRange] = useState("1hour");
  const [selectedAlert, setSelectedAlert] = useState(null);

  const alerts = [
    { id: 1, type: "warning", title: "High EC Level Detected", time: "11:30 AM" },
    { id: 2, type: "warning", title: "Low pH Warning", time: "10:15 AM" },
    { id: 3, type: "info", title: "Temperature Fluctuation", time: "09:45 AM" },
  ];

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        setLoading(true);
        const res = await API.get("sensors/");
        const sensorsArray = Array.isArray(res.data) ? res.data : res.data.data;
        if (sensorsArray && sensorsArray.length > 0) {
          setLatestSensor(sensorsArray[0]);
        } else {
          setLatestSensor(null);
        }
        setError(null);
      } catch (err) {
        console.error("Failed to fetch sensor data", err);
        setError("Failed to load sensor data");
        setLatestSensor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSensors();
    const interval = setInterval(fetchSensors, 50000); // auto refresh
    return () => clearInterval(interval);
  }, []);

  const sensorData = [
    {
      id: 1,
      title: "PH",
      value: latestSensor?.ph ?? "N/A",
      unit: "",
      status: latestSensor ? (latestSensor.ph < 5.5 || latestSensor.ph > 6.5 ? "Unstable" : "Normal") : "N/A",
      color: "#2ecc71",
      icon: Droplets,
    },
    {
      id: 2,
      title: "EC/TDS",
      value: latestSensor?.tds ?? "N/A",
      unit: "mS/cm",
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

      {/* Nutrient Levels + Alerts */}
      <Row className="g-4 mb-4">
        <Col xs={12} lg={8}>
          <Card className="border-0 shadow-sm" style={{ borderRadius: "16px" }}>
            <Card.Body className="p-4">
              <h5 className="mb-4">Nutrient Levels Overview</h5>

              <ButtonGroup size="sm" className="mb-4">
                <Button
                  variant={timeRange === "1hour" ? "success" : "outline-secondary"}
                  onClick={() => setTimeRange("1hour")}
                >
                  1 Hour
                </Button>
                <Button
                  variant={timeRange === "24hours" ? "success" : "outline-secondary"}
                  onClick={() => setTimeRange("24hours")}
                >
                  24 Hours
                </Button>
                <Button
                  variant={timeRange === "1week" ? "success" : "outline-secondary"}
                  onClick={() => setTimeRange("1week")}
                >
                  1 Week
                </Button>
              </ButtonGroup>

              <Row>
                <Col md={6}>
                  <NutrientChart
                    title="pH Levels"
                    currentValue={latestSensor?.ph}
                    status={latestSensor ? "Live" : "N/A"}
                    color="#3b82f6"
                    timeRange={timeRange}
                  />
                </Col>
                <Col md={6}>
                  <NutrientChart
                    title="EC Levels"
                    currentValue={latestSensor?.tds}
                    status={latestSensor ? "Live" : "N/A"}
                    color="#10b981"
                    timeRange={timeRange}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Alerts */}
        <Col xs={12} lg={4}>
          {selectedAlert ? (
            <AlertDetails alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
          ) : (
            <Card className="border-0 shadow-sm" style={{ borderRadius: "16px" }}>
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between mb-3">
                  <h5>Alerts</h5>
                  <span className="badge bg-danger">{alerts.length} Active</span>
                </div>

                {alerts.map((alert) => (
                  <AlertItem key={alert.id} {...alert} onClick={() => setSelectedAlert(alert)} />
                ))}
              </Card.Body>
            </Card>
          )}
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
