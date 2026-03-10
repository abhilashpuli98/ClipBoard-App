import React, { useState, useMemo } from 'react';
import { useClips } from '../context/ClipContext';
import ClipCard from '../components/ClipCard';
import SearchBar from '../components/SearchBar';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

function Dashboard() {
    const { clips } = useClips();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState({ language: '' });

    useKeyboardShortcuts({});

    const filteredClips = useMemo(() => {
        return clips.filter(clip => {
            const matchesSearch =
                clip.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                clip.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                clip.tags?.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesLang = filter.language ? clip.language === filter.language : true;

            return matchesSearch && matchesLang;
        });
    }, [clips, searchTerm, filter]);

    const pinnedClips = filteredClips.filter(c => c.pinned);
    const regularClips = filteredClips.filter(c => !c.pinned);

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Your Clips</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage, search, and share your snippets.</p>
                </div>
            </div>

            <SearchBar
                onSearch={setSearchTerm}
                onFilterChange={setFilter}
            />

            {clips.length === 0 ? (
                <div className="glass" style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: 'var(--radius-lg)' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>No clips found</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Create your first clip or use Ctrl+N</p>
                    <a href="/clip/new" className="btn btn-primary">Create Clip</a>
                </div>
            ) : (
                <>
                    {pinnedClips.length > 0 && (
                        <div style={{ marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span className="badge" style={{ backgroundColor: 'var(--brand-primary)', color: 'white' }}>{pinnedClips.length}</span>
                                Pinned Clips
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                {pinnedClips.map(clip => (
                                    <ClipCard key={clip.id} clip={clip} />
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Recent Clips</h2>
                        {regularClips.length === 0 && searchTerm ? (
                            <p style={{ color: 'var(--text-muted)' }}>No clips match your search.</p>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                {regularClips.map(clip => (
                                    <ClipCard key={clip.id} clip={clip} />
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default Dashboard;
