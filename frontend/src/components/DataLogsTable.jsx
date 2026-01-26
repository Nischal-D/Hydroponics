import React, { useEffect, useState } from "react";
import { Card, Table, Spinner, Alert } from "react-bootstrap";
import API from "../services/api";

const DataLogsTable = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await API.get("sensors/");
        const sensorsArray = Array.isArray(res.data) ? res.data : res.data.data;
        if (sensorsArray && sensorsArray.length > 0) {
          setLogs(sensorsArray.slice(0, 10)); // latest 10 logs
        } else {
          setLogs([]);
        }
        setError(null);
      } catch (err) {
        console.error("Failed to fetch sensor logs", err);
        setError("Failed to load data logs");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-4 mb-4 shadow-sm" style={{ borderRadius: "16px" }}>
      <Card.Body>
        <Card.Title className="mb-4">Data Logs</Card.Title>

        {loading && (
          <div className="text-center">
            <Spinner animation="border" size="sm" /> Loading logs...
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && logs.length === 0 && <p className="text-center">No data logs available</p>}

        {logs.length > 0 && (
          <div className="table-responsive">
            <Table striped bordered hover size="sm">
              <thead className="table-light">
                <tr>
                  <th>Time</th>
                  <th className="text-center">pH</th>
                  <th className="text-center">EC</th>
                  <th className="text-center">Temp</th>
                  <th className="text-center">Humidity</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr key={index}>
                    <td>
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="text-center">{log.ph?.toFixed(1) ?? "N/A"}</td>
                    <td className="text-center">{log.tds?.toFixed(1) ?? "N/A"}</td>
                    <td className="text-center">{log.temperature ?? "N/A"}°C</td>
                    <td className="text-center">{log.humidity ?? "N/A"}%</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default DataLogsTable;
