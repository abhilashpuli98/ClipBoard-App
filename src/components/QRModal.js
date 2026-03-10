import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FiX, FiDownload } from 'react-icons/fi';

function QRModal({ isOpen, onClose, url, title }) {
    if (!isOpen) return null;

    const handleDownload = () => {
        const svg = document.getElementById('qr-code-svg');
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            const a = document.createElement('a');
            a.download = `QR-${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
            a.href = canvas.toDataURL('image/png');
            a.click();
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            backdropFilter: 'blur(4px)'
        }}>
            <div className="glass animate-fade-in" style={{
                padding: '2rem',
                borderRadius: '16px',
                maxWidth: '400px',
                width: '90%',
                textAlign: 'center',
                position: 'relative'
            }}>
                <button
                    onClick={onClose}
                    className="btn-icon"
                    style={{ position: 'absolute', top: '10px', right: '10px' }}
                >
                    <FiX size={24} />
                </button>

                <h3 style={{ marginBottom: '1.5rem', fontWeight: 'bold' }}>Scan to View</h3>

                <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', display: 'inline-block', marginBottom: '1.5rem' }}>
                    <QRCodeSVG
                        id="qr-code-svg"
                        value={url}
                        size={200}
                        level="H"
                        includeMargin={true}
                    />
                </div>

                <button className="btn btn-primary" onClick={handleDownload} style={{ width: '100%' }}>
                    <FiDownload /> Download QR Code
                </button>
            </div>
        </div>
    );
}

export default QRModal;
