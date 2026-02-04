import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Badge } from "react-bootstrap";

const PLANTS = {
  Lettuce: {
    ph: [5.5, 6.5],
    tds: [560, 840], 
    temperature: [15, 22],
    humidity: [50, 70],
  },
  Basil: {
    ph: [5.5, 6.5],
    tds: [700, 1000], 
    temperature: [20, 28],
    humidity: [40, 60],
  },
  Arugula: {
    ph: [6.0, 6.5],
    tds: [800, 1000], 
    temperature: [16, 24],
    humidity: [50, 70],
  },
  Microgreens: {
    ph: [5.5, 6.5],
    tds: [300, 800], 
    temperature: [18, 24],
    humidity: [40, 60],
  }
};


const FIELD_LABELS = {
  ph: "pH Level",
  tds: "EC / TDS",
  temperature: "Temperature (°C)",
  humidity: "Humidity (%)",
};

const PlantSetup = () => {
  const [plant, setPlant] = useState("");
  const [params, setParams] = useState(null);

  const handlePlantChange = (e) => {
    const selected = e.target.value;
    setPlant(selected);
    setParams({ ...PLANTS[selected] });
  };

  const handleChange = (field, index, value) => {
    let num =
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

  const handleSave = () => {
    console.log("Plant:", plant);
    console.log("Thresholds:", params);
    alert("Plant configuration saved successfully!");
    // later → POST to backend
  };

  return (
    <Container fluid className="py-4 px-4">
      {/* Header */}
      <Row className="mb-4 text-center">
        <Col>
          <h3 className="fw-bold">Plant Configuration</h3>
          <p className="text-muted mb-2">
            Select a plant and configure ideal growing conditions
          </p>
          {plant && (
            <Badge bg="success" className="px-3 py-2">
              Active Plant: {plant}
            </Badge>
          )}
        </Col>
      </Row>

      {/* Card */}
      <Card
        className="border-0 shadow-sm mx-auto"
        style={{ borderRadius: "16px", maxWidth: "900px" }}
      >
        <Card.Body className="p-4">
          {/* Plant Select */}
          <Form.Group className="mb-4 text-center">
            <Form.Label className="fw-semibold mb-2">
              Choose Plant
            </Form.Label>
            <Form.Select
              value={plant}
              onChange={handlePlantChange}
              className="mx-auto"
              style={{ maxWidth: 320 }}
            >
              <option value="">Select Plant</option>
              {Object.keys(PLANTS).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Parameters */}
          {params && (
            <>
              <Row className="mb-3 text-center">
                <Col className="text-muted fw-semibold">
                  Set Acceptable Parameter Ranges
                </Col>
              </Row>

              {Object.keys(FIELD_LABELS).map((field) => (
                <Row
                  key={field}
                  className="align-items-center mb-3 px-md-3"
                >
                  <Col
                    md={4}
                    className="fw-semibold text-md-end text-center mb-2 mb-md-0"
                  >
                    {FIELD_LABELS[field]}
                  </Col>

                  <Col md={3}>
                    <Form.Control
                      type="number"
                      step={field === "ph" ? 0.1 : 1}
                      min={field === "temperature" ? undefined : 0}
                      max={field === "ph" ? 14 : undefined}
                      value={params[field][0]}
                      onChange={(e) =>
                        handleChange(field, 0, e.target.value)
                      }
                      placeholder="Min"
                    />
                  </Col>

                  <Col md={3}>
                    <Form.Control
                      type="number"
                      step={field === "ph" ? 0.1 : 1}
                      min={field === "ph" ? 0 : undefined}
                      max={field === "ph" ? 14 : field === "humidity" ? 100 : undefined}
                      value={params[field][1]}
                      onChange={(e) =>
                        handleChange(field, 1, e.target.value)
                      }
                      placeholder="Max"
                    />
                  </Col>
                </Row>
              ))}

              {/* Save */}
              <div className="text-center mt-4">
                <Button
                  variant="success"
                  size="lg"
                  className="px-5"
                  style={{ borderRadius: "30px" }}
                  onClick={handleSave}
                >
                  Save Configuration
                </Button>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PlantSetup;
