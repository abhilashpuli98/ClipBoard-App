import React, { useState } from 'react';
import { useClips } from '../context/ClipContext';
import ClipCard from '../components/ClipCard';
import { FiFolderPlus, FiFolder } from 'react-icons/fi';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { toast } from '../components/Toast';

function Collections() {
    const { collections, clips, addCollection } = useClips();
    const [activeCollection, setActiveCollection] = useState(collections[0]?.id);
    const [newColName, setNewColName] = useState('');

    useKeyboardShortcuts({});

    const handleAddCol = (e) => {
        e.preventDefault();
        if (newColName.trim()) {
            const col = addCollection(newColName.trim(), '#8b5cf6');
            setNewColName('');
            setActiveCollection(col.id);
            toast.success(`Collection "${col.name}" created`);
        }
    };

    const activeClips = clips.filter(c => c.collectionId === activeCollection);

    return (
        <div className="animate-fade-in" style={{ display: 'flex', gap: '2rem', flexDirection: window.innerWidth > 768 ? 'row' : 'column' }}>

            <div style={{ width: window.innerWidth > 768 ? '250px' : '100%', flexShrink: 0 }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiFolder /> Collections
                </h2>

                <form onSubmit={handleAddCol} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="New folder..."
                        value={newColName}
                        onChange={e => setNewColName(e.target.value)}
                        style={{ padding: '0.5rem' }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem' }}>
                        <FiFolderPlus />
                    </button>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {collections.map(col => (
                        <button
                            key={col.id}
                            onClick={() => setActiveCollection(col.id)}
                            className="glass"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: activeCollection === col.id ? 'var(--bg-accent)' : 'var(--bg-secondary)',
                                borderLeft: `4px solid ${col.color}`,
                                textAlign: 'left',
                                width: '100%'
                            }}
                        >
                            <div style={{ flex: 1, fontWeight: activeCollection === col.id ? '600' : '400' }}>{col.name}</div>
                            <span className="badge" style={{ backgroundColor: 'var(--bg-primary)' }}>
                                {clips.filter(c => c.collectionId === col.id).length}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>
                        {collections.find(c => c.id === activeCollection)?.name || 'Collection'}
                    </h1>
                    <a href={`/clip/new?collection=${activeCollection}`} className="btn btn-primary btn-sm">
                        Add Clip Here
                    </a>
                </div>

                {activeClips.length === 0 ? (
                    <div className="glass" style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: 'var(--radius-lg)' }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Folder is empty</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>This collection has no clips yet.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {activeClips.map(clip => (
                            <ClipCard key={clip.id} clip={clip} />
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}

export default Collections;
