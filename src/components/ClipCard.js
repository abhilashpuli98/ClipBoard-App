import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { FiClock, FiLock, FiStar, FiCode, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { useClips } from '../context/ClipContext';
import { isClipExpired, getByteSize, formatBytes } from '../utils/clipUtils';

function ClipCard({ clip, isTrash = false }) {
    const { togglePin, restoreClip, permanentDelete } = useClips();
    const isExpired = isClipExpired(clip);

    const handleRestore = (e) => {
        e.preventDefault();
        restoreClip(clip.id);
    };

    const handlePermanentDelete = (e) => {
        e.preventDefault();
        if (window.confirm('Permanently delete this clip?')) {
            permanentDelete(clip.id);
        }
    };

    const handlePin = (e) => {
        e.preventDefault();
        togglePin(clip.id);
    };

    return (
        <Link
            to={isTrash ? '#' : `/clip/${clip.id}`}
            className="glass"
            style={{
                display: 'block',
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                transition: 'all 0.2s',
                opacity: isExpired ? 0.6 : 1,
                position: 'relative',
                textDecoration: 'none',
                color: 'inherit'
            }}
            onMouseOver={(e) => {
                if (!isTrash) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    e.currentTarget.style.borderColor = 'var(--brand-primary)';
                }
            }}
            onMouseOut={(e) => {
                if (!isTrash) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                }
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    margin: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    paddingRight: '1rem',
                    color: isExpired ? 'var(--text-muted)' : 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    {clip.isProtected && <FiLock size={16} color="var(--warning)" />}
                    {clip.title || 'Untitled Clip'}
                </h3>

                {!isTrash && (
                    <button
                        className="btn-icon"
                        style={{
                            padding: '0.25rem',
                            color: clip.pinned ? 'var(--brand-primary)' : 'var(--text-muted)'
                        }}
                        onClick={handlePin}
                        title={clip.pinned ? "Unpin" : "Pin clip"}
                    >
                        <FiStar fill={clip.pinned ? "currentColor" : "none"} />
                    </button>
                )}
            </div>

            <div style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <FiCode />
                    <span>{clip.language || 'text'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <FiClock />
                    <span>{formatDistanceToNow(new Date(clip.createdAt), { addSuffix: true })}</span>
                </div>

                {isExpired && (
                    <div style={{ color: 'var(--danger)', fontWeight: '500' }}>Expired</div>
                )}
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 'auto'
            }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {clip.tags?.slice(0, 3).map((tag, i) => (
                        <span key={i} className="badge" style={{ backgroundColor: 'var(--bg-accent)', color: 'var(--text-secondary)' }}>
                            {tag}
                        </span>
                    ))}
                    {clip.tags?.length > 3 && (
                        <span className="badge" style={{ backgroundColor: 'var(--bg-accent)' }}>+{clip.tags.length - 3}</span>
                    )}
                </div>

                {isTrash && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-secondary btn-icon" onClick={handleRestore} title="Restore">
                            <FiRefreshCw />
                        </button>
                        <button className="btn btn-danger btn-icon" onClick={handlePermanentDelete} title="Delete permanently">
                            <FiTrash2 />
                        </button>
                    </div>
                )}
            </div>
        </Link>
    );
}

export default ClipCard;
