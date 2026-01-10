import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

const AlertItem = ({ type, title, time, onClick }) => {
    // Determine icon and color based on alert type
    const getAlertStyle = () => {
        switch (type) {
            case 'warning':
                return {
                    icon: AlertTriangle,
                    bgColor: '#fff3cd',
                    iconColor: '#ffc107',
                    borderColor: '#ffc107'
                };
            case 'error':
                return {
                    icon: AlertCircle,
                    bgColor: '#f8d7da',
                    iconColor: '#dc3545',
                    borderColor: '#dc3545'
                };
            case 'info':
                return {
                    icon: Info,
                    bgColor: '#d1ecf1',
                    iconColor: '#0dcaf0',
                    borderColor: '#0dcaf0'
                };
            default:
                return {
                    icon: Info,
                    bgColor: '#e7f3ff',
                    iconColor: '#0d6efd',
                    borderColor: '#0d6efd'
                };
        }
    };

    const style = getAlertStyle();
    const Icon = style.icon;

    return (
        <div
            className="p-3 mb-2"
            style={{
                backgroundColor: style.bgColor,
                borderRadius: '8px',
                borderLeft: `4px solid ${style.borderColor}`
            }}
        >
            <div className="d-flex align-items-start gap-2">
                <div style={{ color: style.iconColor, flexShrink: 0 }}>
                    <Icon size={20} />
                </div>
                <div className="flex-grow-1">
                    <div className="fw-semibold" style={{ fontSize: '0.9rem', color: '#333' }}>
                        {title}
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                        {time}
                    </div>
                    <a
                        href="#"
                        className="text-decoration-none"
                        style={{ fontSize: '0.8rem', color: style.iconColor }}
                        onClick={(e) => {
                            e.preventDefault();
                            if (onClick) onClick();
                        }}
                    >
                        View Details →
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AlertItem;
