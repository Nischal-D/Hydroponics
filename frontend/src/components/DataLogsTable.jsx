import React, { useEffect, useState } from "react";
import { Card, Table, Spinner, Alert, Badge } from "react-bootstrap";
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
        setLogs(sensorsArray?.slice(0, 10) || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch sensor logs", err);
        setError("Failed to load data logs");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 600000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card
      className="mb-4 shadow-sm border-0"
      style={{ borderRadius: 16 }}
    >
      <Card.Body className="p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="mb-1 fw-semibold">Sensor Data Logs</h5>
            <small className="text-muted">
              Latest sensor readings (last 10 entries)
            </small>
          </div>
          <Badge bg="success" pill>
            Live
          </Badge>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-5 text-muted">
            <Spinner animation="border" size="sm" className="me-2" />
            Loading sensor logs…
          </div>
        )}

        {/* Error */}
        {error && (
          <Alert variant="danger" className="mt-3 mb-0">
            {error}
          </Alert>
        )}

        {/* Empty */}
        {!loading && logs.length === 0 && !error && (
          <div className="text-center py-5 text-muted">
            No sensor data available
          </div>
        )}

        {/* Table */}
        {logs.length > 0 && !loading && (
          <div className="table-responsive mt-3">
            <Table
              hover
              size="xs"
              className="align-middle mb-0 table-bordered"
              style={{ borderColor: "#e5e7eb" }}
            >

              <thead className="text-muted small">
                <tr>
                  <th className="text-center">Time</th>
                  <th className="text-center">pH</th>
                  <th className="text-center">EC / TDS (ppm)</th>
                  <th className="text-center">Temp</th>
                  <th className="text-center">Humidity</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr key={index}>
                    <td className="fw-medium text-center">
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    <td className="text-center">
                      {log.ph != null ? log.ph.toFixed(1) : "—"}
                    </td>

                    <td className="text-center">
                      {log.tds != null ? log.tds.toFixed(1) : "—"}
                    </td>

                    <td className="text-center">
                      {log.temperature != null ? (
                        <>
                          {log.temperature}
                          <span className="text-muted small"> °C</span>
                        </>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="text-center">
                      {log.humidity != null ? (
                        <>
                          {log.humidity}
                          <span className="text-muted small"> %</span>
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
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
