import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiShare2, FiMonitor, FiArrowLeft, FiClock } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { useClips } from '../context/ClipContext';
import { isClipExpired, getWordCount, getByteSize, formatBytes } from '../utils/clipUtils';
import { toast } from '../components/Toast';

import ClipViewer from '../components/ClipViewer';
import PasswordGate from '../components/PasswordGate';
import QRModal from '../components/QRModal';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

function ViewClip() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { clips, deleteClip } = useClips();

    const [clip, setClip] = useState(null);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState('');

    useEffect(() => {
        if (!clip || !clip.expiresAt) return;

        const updateTime = () => {
            const remaining = new Date(clip.expiresAt).getTime() - new Date().getTime();
            if (remaining <= 0) {
                setTimeRemaining('Expired');
            } else {
                const minutes = Math.floor(remaining / 60000);
                const seconds = Math.floor((remaining % 60000) / 1000);
                setTimeRemaining(`${minutes}m ${seconds}s`);
            }
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [clip]);

    useEffect(() => {
        const found = clips.find(c => c.id === id);
        if (!found) {
            toast.error('Clip not found');
            navigate('/');
        } else {
            setClip(found);
            if (!found.isProtected) setIsUnlocked(true);
        }
    }, [id, clips, navigate]);

    useKeyboardShortcuts({
        onEscape: () => navigate('/')
    });

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to move this to trash?')) {
            deleteClip(id);
            toast.info('Moved to trash');
            navigate('/');
        }
    };

    const shareUrl = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            toast.success('Share Link copied to clipboard!');
        });
    };

    if (!clip) return null;

    if (clip.isProtected && !isUnlocked) {
        return (
            <div className="animate-fade-in" style={{ marginTop: '10vh' }}>
                <PasswordGate
                    correctPassword={clip.password}
                    onUnlock={() => setIsUnlocked(true)}
                    onCancel={() => navigate('/')}
                />
            </div>
        );
    }

    const isExpired = isClipExpired(clip);
    const stats = {
        words: getWordCount(clip.content),
        chars: clip.content.length,
        size: formatBytes(getByteSize(clip.content))
    };

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '1.5rem' }}>
                <button onClick={() => navigate(-1)} className="btn-icon" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <FiArrowLeft /> Back
                </button>

                <div style={{ display: 'flex', flexDirection: window.innerWidth > 600 ? 'row' : 'column', justifyContent: 'space-between', alignItems: window.innerWidth > 600 ? 'center' : 'stretch', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, opacity: isExpired ? 0.5 : 1 }}>
                            {clip.title || 'Untitled Clip'}
                        </h1>
                        <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                            <span>Created {formatDistanceToNow(new Date(clip.createdAt), { addSuffix: true })}</span>
                            {clip.tags?.map((tag, i) => (
                                <span key={i} className="badge" style={{ backgroundColor: 'var(--bg-accent)' }}>{tag}</span>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button className="btn btn-secondary" onClick={() => setShowQR(true)}>
                            <FiMonitor /> QR
                        </button>
                        <button className="btn btn-secondary" onClick={shareUrl}>
                            <FiShare2 /> Share
                        </button>
                        <Link to={`/clip/${id}/edit`} className="btn btn-primary" style={{ display: isExpired ? 'none' : 'inline-flex' }}>
                            <FiEdit2 /> Edit
                        </Link>
                        <button className="btn btn-danger btn-icon" onClick={handleDelete} title="Delete">
                            <FiTrash2 />
                        </button>
                    </div>
                </div>
            </div>

            {clip.expiresAt && (
                <div className="glass" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1.5rem',
                    borderLeft: `4px solid ${isExpired ? 'var(--danger)' : 'var(--warning)'}`
                }}>
                    <FiClock color={isExpired ? 'var(--danger)' : 'var(--warning)'} />
                    <span style={{ fontWeight: 500 }}>
                        {isExpired ? 'This clip has expired.' : `Expires in: ${timeRemaining}`}
                    </span>
                </div>
            )}

            {isExpired ? (
                <div className="glass" style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: 'var(--radius-lg)' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Clip Expired</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>The content of this clip is no longer available.</p>
                </div>
            ) : (
                <React.Fragment>
                    <ClipViewer clip={clip} />

                    <div style={{
                        marginTop: '1.5rem',
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-accent)',
                        display: 'flex',
                        gap: '2rem',
                        fontSize: '0.875rem',
                        color: 'var(--text-secondary)',
                        flexWrap: 'wrap'
                    }}>
                        <div><strong>Words:</strong> {stats.words}</div>
                        <div><strong>Characters:</strong> {stats.chars}</div>
                        <div><strong>Size:</strong> {stats.size}</div>
                        <div style={{ marginLeft: 'auto' }}><strong>ID:</strong> {clip.id.substring(0, 8)}</div>
                    </div>
                </React.Fragment>
            )}

            <QRModal
                isOpen={showQR}
                onClose={() => setShowQR(false)}
                url={window.location.href}
                title={clip.title || 'Clip'}
            />
        </div>
    );
}

export default ViewClip;
