import React, { useState } from 'react';
import { Container, Card, Form, Button, Modal } from 'react-bootstrap';
import { Leaf, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { login } from '../api/axios';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleErrorClose = () => {
        setShowErrorModal(false);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username.trim()) {
            setError('Please enter your username');
            setShowErrorModal(true);
            return;
        }

        setIsLoading(true);

        try {
            // Call API login
            await login(username, password);
            onLogin(); // Update parent state on success
        } catch (err) {
            console.error("Login Error:", err);
            // Determine error message
            if (err.response) {
                if (err.response.status === 401) {
                    setError('Invalid username or password');
                } else {
                    setError('Server error. Please try again later.');
                }
            } else if (err.request) {
                setError('No response from server. Check your internet connection.');
            } else {
                setError('An unexpected error occurred.');
            }
            setShowErrorModal(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="d-flex align-items-center justify-content-center min-vh-100"
            style={{
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
            }}
        >
            <Container style={{ maxWidth: '450px' }}>
                <Card className="border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                    <div
                        className="p-4 text-center text-white"
                        style={{
                            background: 'linear-gradient(to right, #2ecc71, #1abc9c)'
                        }}
                    >
                        <div className="mb-3 d-inline-block p-3 rounded-circle bg-white bg-opacity-25">
                            <Leaf size={40} className="text-white" />
                        </div>
                        <h2 className="fw-bold mb-1">Welcome Back!</h2>
                        <p className="mb-0 opacity-75">Sign in to your dashboard</p>
                    </div>

                    <Card.Body className="p-5">
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-4">
                                <Form.Label className="text-muted small fw-bold text-uppercase">Username</Form.Label>
                                <div className="input-group">
                                    <span className="input-group-text border-end-0 bg-white ps-3">
                                        <User size={18} className="text-muted" />
                                    </span>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="border-start-0 py-2 shadow-none"
                                        style={{ borderLeft: 'none' }}
                                    />
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-5">
                                <Form.Label className="text-muted small fw-bold text-uppercase">Password</Form.Label>
                                <div className="input-group">
                                    <span className="input-group-text border-end-0 bg-white ps-3">
                                        <Lock size={18} className="text-muted" />
                                    </span>
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="border-start-0 border-end-0 py-2 shadow-none"
                                        style={{ borderLeft: 'none', borderRight: 'none' }}
                                    />
                                    <span
                                        className="input-group-text border-start-0 bg-white pe-3"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} className="text-muted" />
                                        ) : (
                                            <Eye size={18} className="text-muted" />
                                        )}
                                    </span>
                                </div>
                            </Form.Group>

                            <Button
                                variant="success"
                                type="submit"
                                className="w-100 py-3 fw-bold shadow-sm"
                                disabled={isLoading}
                                style={{
                                    background: 'linear-gradient(to right, #2ecc71, #1abc9c)',
                                    border: 'none',
                                    borderRadius: '10px'
                                }}
                            >
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </Form>
                    </Card.Body>
                    <Card.Footer className="text-center py-4 bg-light border-0">
                        <span className="text-muted small">Hydroponics Monitoring System</span>
                    </Card.Footer>
                </Card>
            </Container>

            {/* Error Modal */}
            <Modal show={showErrorModal} onHide={handleErrorClose} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                </Modal.Header>
                <Modal.Body className="text-center pt-0 pb-4">
                    <div className="mb-3 text-danger">
                        <AlertCircle size={48} />
                    </div>
                    <h4 className="fw-bold mb-2">Login Failed</h4>
                    <p className="text-muted mb-4">{error}</p>
                    <Button
                        variant="danger"
                        onClick={handleErrorClose}
                        className="w-50 rounded-pill"
                    >
                        Try Again
                    </Button>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Login;
