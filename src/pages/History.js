import React from 'react';
import { useClips } from '../context/ClipContext';
import { formatDistanceToNow, format } from 'date-fns';
import { FiClock, FiPlusCircle, FiEdit, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

function History() {
    const { history } = useClips();

    useKeyboardShortcuts({});

    const getActionIcon = (action) => {
        switch (action) {
            case 'CREATED': return <FiPlusCircle color="var(--success)" />;
            case 'UPDATED': return <FiEdit color="var(--brand-primary)" />;
            case 'DELETED': return <FiTrash2 color="var(--danger)" />;
            case 'RESTORED': return <FiRefreshCw color="var(--info)" />;
            default: return <FiClock />;
        }
    };

    return (
        <div className="animate-fade-in container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-accent)', borderRadius: 'var(--radius-lg)' }}>
                    <FiClock size={32} color="var(--brand-primary)" />
                </div>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>Activity Timeline</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Log of your recent clipboard actions.</p>
                </div>
            </div>

            {history.length === 0 ? (
                <div className="glass" style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: 'var(--radius-lg)' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>No History</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>You haven't made any actions yet.</p>
                </div>
            ) : (
                <div style={{ position: 'relative', marginTop: '2rem' }}>
                    {/* Vertical line */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: '23px',
                        width: '2px',
                        backgroundColor: 'var(--border-color)',
                        zIndex: 0
                    }}></div>

                    {history.map((event, index) => (
                        <div key={event.id} className="glass" style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '1.5rem',
                            padding: '1.5rem',
                            borderRadius: 'var(--radius-lg)',
                            marginBottom: '1rem',
                            position: 'relative',
                            zIndex: 1,
                            marginLeft: '2rem' // Give room for the dot
                        }}>
                            {/* Timeline Dot */}
                            <div style={{
                                position: 'absolute',
                                left: '-2rem',
                                top: '1.5rem',
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: 'var(--shadow-sm)'
                            }}>
                                {getActionIcon(event.action)}
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                        {event.action}: {event.clipTitle || 'Untitled Clip'}
                                    </span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                        {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                                    </span>
                                </div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>
                                    {format(new Date(event.timestamp), 'PPpp')} • ID: {event.clipId.substring(0, 8)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default History;
