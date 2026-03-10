import React, { useState } from 'react';
import { FiLock, FiUnlock } from 'react-icons/fi';

function PasswordGate({ correctPassword, onUnlock, onCancel }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === correctPassword) {
            onUnlock();
        } else {
            setError('Incorrect password');
            setPassword('');
            setTimeout(() => setError(''), 3000);
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem 2rem',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            maxWidth: '500px',
            margin: '0 auto',
            textAlign: 'center'
        }}>
            <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: 'var(--danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
            }}>
                <FiLock size={32} />
            </div>

            <h2 style={{ marginBottom: '1rem' }}>Protected Clip</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                This clip is password protected. Please enter the password to view its contents.
            </p>

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <div className="input-group">
                    <input
                        type="password"
                        className="input-field"
                        placeholder="Enter password..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoFocus
                    />
                    {error && <span style={{ color: 'var(--danger)', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</span>}
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    {onCancel && (
                        <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onCancel}>
                            Cancel
                        </button>
                    )}
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                        <FiUnlock /> Unlock
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PasswordGate;
