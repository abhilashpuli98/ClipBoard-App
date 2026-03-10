import React, { useState, useEffect } from 'react';
import { FiSearch, FiCode, FiX } from 'react-icons/fi';
import { LANGUAGES } from '../utils/constants';

function SearchBar({ onSearch, onFilterChange }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [language, setLanguage] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(searchTerm);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, onSearch]);

    const handleLangChange = (e) => {
        const val = e.target.value;
        setLanguage(val);
        if (onFilterChange) onFilterChange({ language: val });
    };

    return (
        <div className="glass" style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            padding: '1rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '2rem'
        }}>
            <div style={{ flex: '1 1 300px', position: 'relative' }}>
                <FiSearch style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                    id="global-search"
                    type="text"
                    className="input-field"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="Search clips... (Ctrl+F)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <button
                        className="btn-icon"
                        style={{ position: 'absolute', top: '50%', right: '0.5rem', transform: 'translateY(-50%)', padding: '0.25rem' }}
                        onClick={() => setSearchTerm('')}
                    >
                        <FiX />
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '150px' }}>
                <FiCode color="var(--text-muted)" />
                <select className="input-field" value={language} onChange={handleLangChange}>
                    <option value="">All Languages</option>
                    {LANGUAGES.map(l => (
                        <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default SearchBar;
