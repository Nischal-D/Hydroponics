import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, ButtonGroup } from "react-bootstrap";
import { Droplets, Zap, Thermometer, Wind } from "lucide-react";
import SensorCard from "./SensorCard";
import NutrientChart from "./NutrientChart";
import DataLogsTable from "./DataLogsTable";
import API from "../services/api";

const Dashboard = () => {
  const [latestSensor, setLatestSensor] = useState(null);
  const [sensorHistory, setSensorHistory] = useState([]); // last 10 entries
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("1hour");

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        setLoading(true);
        const res = await API.get("sensors/");
        const sensorsArray = Array.isArray(res.data) ? res.data : res.data.data;

        if (sensorsArray && sensorsArray.length > 0) {
          // Take last 10 entries, oldest first
          const lastTen = sensorsArray.slice(0, 10).reverse();
          setSensorHistory(lastTen);
          setLatestSensor(lastTen[lastTen.length - 1]);
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

      {/* Nutrient Levels */}
      <Row className="g-4 mb-4">
        <Col xs={12} lg={12}>
          <Card className="border-0 shadow-sm" style={{ borderRadius: "16px" }}>
            <Card.Body className="p-4">
              <h5 className="mb-4">Nutrient Levels Overview</h5>

              {/* Time range buttons */}
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

              {/* Charts */}
              <Row>
                <Col md={6}>
                  <NutrientChart
                    title="pH Levels"
                    currentValue={latestSensor?.ph}
                    status={latestSensor ? "Live" : "N/A"}
                    color="#3b82f6"
                    timeRange={timeRange}
                    data={sensorHistory.map((s) => Number(s.ph))}
                  />
                </Col>

                <Col md={6}>
                  <NutrientChart
                    title="EC Levels"
                    currentValue={latestSensor?.tds}
                    status={latestSensor ? "Live" : "N/A"}
                    color="#10b981"
                    timeRange={timeRange}
                    data={sensorHistory.map((s) => Number(s.tds))}
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
