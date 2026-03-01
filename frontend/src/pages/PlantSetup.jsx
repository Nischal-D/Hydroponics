import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Badge } from "react-bootstrap";


const PLANTS = {
  Lettuce: {
    ph: [6.2, 6.0],
    tds: [650, 650],
    // temperature: [15, 22],
    humidity: [70, 80],
    ph_pmp_time:[270, 265],
    ec_pmp_time:[250, 245],
    rh_fan_time:[500, 500],
  },
  // Basil: {
  //   ph: [5.5, 6.5],
  //   tds: [700, 1000],
  //   temperature: [20, 28],
  //   humidity: [40, 60],
  // },
  // Arugula: {
  //   ph: [6.0, 6.5],
  //   tds: [800, 1000],
  //   temperature: [16, 24],
  //   humidity: [50, 70],
  // },
  // Microgreens: {
  //   ph: [5.5, 6.5],
  //   tds: [300, 800],
  //   temperature: [18, 24],
  //   humidity: [40, 60],
  // },
};

const FIELD_LABELS = {
  ph: "pH Level",
  tds: "EC / TDS (ppm)",
  // temperature: "Temperature (°C)",
  humidity: "Humidity (%)",
  ph_pmp_time : "pH Pump Time (ms)",
  ec_pmp_time : "TDS Pump Time (ms)",
  rh_fan_time : "RH Fan Time (ms)",
};

const API_BASE = "https://hydroponics-q549.onrender.com";


async function refreshAccessToken() {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) return null;

  const res = await fetch(`${API_BASE}/api/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    localStorage.clear();
    return null;
  }

  const data = await res.json();
  localStorage.setItem("access", data.access);
  return data.access;
}

async function authFetch(url, options = {}) {
  let access = localStorage.getItem("access");

  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${access}`,
    },
  });

  if (res.status === 401) {
    access = await refreshAccessToken();
    if (!access) throw new Error("Session expired");

    res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${access}`,
      },
    });
  }

  return res;
}

const PlantSetup = () => {
  const [plant, setPlant] = useState("");
  const [params, setParams] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePlantChange = (e) => {
    const selected = e.target.value;
    setPlant(selected);
    setParams({ ...PLANTS[selected] });
  };

  const handleChange = (field, index, value) => {
    const num =
      field === "ph"
        ? Number(parseFloat(value).toFixed(1))
        : Number(value);

    setParams({
      ...params,
      [field]:
        index === 0
          ? [num, params[field][1]]
          : [params[field][0], num],
    });
  };



  const handleSave = async () => {
    if (!params) return;

    setLoading(true);

    const payload = {
      pH_threshold: params.ph[0] ,
      ec_threshold: params.tds[0],      
      rh_threshold: params.humidity[0],
      pH_pmp_time: params.ph_pmp_time[0],
      ec_pmp_time: params.ec_pmp_time[0],
      rh_fan_time: params.rh_fan_time[0],
    };

    try {
      const res = await authFetch(`${API_BASE}/control/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      alert("Plant configuration saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save configuration. Please login again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Container fluid className="py-4 px-4">
      <Row className="mb-4 text-center">
        <Col>
          <h3 className="fw-bold">Plant Configuration</h3>
          <p className="text-muted">
            Select a plant and configure ideal growing conditions
          </p>
          {plant && (
            <Badge bg="success" className="px-3 py-2">
              Active Plant: {plant}
            </Badge>
          )}
        </Col>
      </Row>

      <Card className="border-0 shadow-sm mx-auto" style={{ maxWidth: 900 }}>
        <Card.Body className="p-4">
          <Form.Group className="mb-4 text-center">
            <Form.Label className="fw-semibold">Choose Plant</Form.Label>
            <Form.Select
              value={plant}
              onChange={handlePlantChange}
              style={{ maxWidth: 320, margin: "0 auto" }}
            >
              <option value="">Select Plant</option>
              {Object.keys(PLANTS).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {params &&
            Object.keys(FIELD_LABELS).map((field) => (
              <Row key={field} className="align-items-center mb-3">
                <Col md={4} className="fw-semibold text-md-end text-center">
                  {FIELD_LABELS[field]}
                </Col>
                <Col md={3}>
                  <Form.Control
                    type="number"
                    step={field === "ph" ? 0.1 : 1}
                    value={params[field][0]}
                    onChange={(e) =>
                      handleChange(field, 0, e.target.value)
                    }
                  />
                </Col>
                <Col md={3}>
                  <Form.Control
                    type="number"
                    value={params[field][1]}
                    disabled
                    title="Optimal Value"
                  />
                </Col>
              </Row>
            ))}

          {params && (
            <div className="text-center mt-4">
              <Button
                variant="success"
                size="lg"
                disabled={loading}
                onClick={handleSave}
              >
                {loading ? "Saving..." : "Save Configuration"}
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PlantSetup;
