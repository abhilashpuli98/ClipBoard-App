import React from 'react';
import { FiDownload, FiUpload, FiMoon, FiSun, FiMonitor } from 'react-icons/fi';
import { useTheme } from '../hooks/useTheme';
import { useClips } from '../context/ClipContext';
import { THEMES } from '../utils/constants';
import { toast } from '../components/Toast';

function Settings() {
    const [theme, setTheme] = useTheme();
    const { clips, collections, history, setClips } = useClips();

    const handleExport = () => {
        const data = {
            version: 1,
            exportDate: new Date().toISOString(),
            clips,
            collections,
            history
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `clipsync-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Backup exported successfully');
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (data.clips && Array.isArray(data.clips)) {
                    setClips(prev => {
                        const merged = [...prev];
                        data.clips.forEach(importedClip => {
                            if (!merged.find(c => c.id === importedClip.id)) {
                                merged.push(importedClip);
                            }
                        });
                        return merged;
                    });
                    toast.success(`Imported ${data.clips.length} clips successfully!`);
                } else {
                    toast.error('Invalid backup file format');
                }
            } catch (err) {
                toast.error('Failed to parse backup file');
            }
        };
        reader.readAsText(file);
        e.target.value = null;
    };

    return (
        <div className="animate-fade-in container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Settings</h1>

            <section className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Appearance</h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                    <button
                        className={`btn ${theme === THEMES.LIGHT ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setTheme(THEMES.LIGHT)}
                        style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', gap: '0.5rem' }}
                    >
                        <FiSun size={24} />
                        <span>Light</span>
                    </button>

                    <button
                        className={`btn ${theme === THEMES.DARK ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setTheme(THEMES.DARK)}
                        style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', gap: '0.5rem' }}
                    >
                        <FiMoon size={24} />
                        <span>Dark</span>
                    </button>

                    <button
                        className={`btn ${theme === THEMES.SYSTEM ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setTheme(THEMES.SYSTEM)}
                        style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', gap: '0.5rem' }}
                    >
                        <FiMonitor size={24} />
                        <span>System</span>
                    </button>
                </div>
            </section>

            <section className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Data Management</h2>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button className="btn btn-secondary" onClick={handleExport} style={{ flex: 1, padding: '1rem' }}>
                        <FiDownload /> Export Backup (JSON)
                    </button>

                    <label className="btn btn-secondary" style={{ flex: 1, padding: '1rem', cursor: 'pointer', textAlign: 'center' }}>
                        <FiUpload /> Import Backup
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleImport}
                            style={{ display: 'none' }}
                        />
                    </label>
                </div>
                <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    All data is stored locally in your browser. Export it to back it up or transfer to another device.
                </p>
            </section>

            <section className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Keyboard Shortcuts</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>New Clip</span>
                        <span style={{ fontFamily: 'var(--font-mono)', backgroundColor: 'var(--bg-primary)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>Ctrl + N</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Search Clips</span>
                        <span style={{ fontFamily: 'var(--font-mono)', backgroundColor: 'var(--bg-primary)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>Ctrl + F</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Go Back / Cancel</span>
                        <span style={{ fontFamily: 'var(--font-mono)', backgroundColor: 'var(--bg-primary)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>Escape</span>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Settings;
