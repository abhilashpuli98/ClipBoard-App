import React from 'react';
import { useClips } from '../context/ClipContext';
import ClipCard from '../components/ClipCard';
import { FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

function Trash() {
    const { trash } = useClips();

    useKeyboardShortcuts({});

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-accent)', borderRadius: 'var(--radius-lg)' }}>
                    <FiTrash2 size={32} color="var(--danger)" />
                </div>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>Trash</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Recover deleted clips or permanently remove them.</p>
                </div>
            </div>

            {trash.length === 0 ? (
                <div className="glass" style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: 'var(--radius-lg)' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Trash is empty</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Deleted clips will appear here.</p>
                </div>
            ) : (
                <>
                    <div style={{
                        padding: '1rem',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid var(--warning)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--warning)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '2rem'
                    }}>
                        <FiAlertTriangle />
                        <span>Items in trash do not expire automatically. They must be permanently deleted.</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {trash.map(clip => (
                            <ClipCard key={clip.id} clip={clip} isTrash={true} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default Trash;
