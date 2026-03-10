import React, { useState, useEffect } from 'react';
import { LANGUAGES, EXPIRY_OPTIONS } from '../utils/constants';

function ClipEditor({ initialData = {}, onSubmit, onCancel, isSaving }) {
    const [formData, setFormData] = useState({
        title: initialData.title || '',
        content: initialData.content || '',
        language: initialData.language || 'text',
        tags: initialData.tags ? initialData.tags.join(', ') : '',
        password: initialData.password || '',
        expiresIn: '0',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const newErrors = {};
        if (!formData.content.trim()) {
            newErrors.content = 'Content is required';
        }
        setErrors(newErrors);
    }, [formData.content]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (Object.keys(errors).length > 0) return;

        const processedTags = formData.tags
            .split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0);

        let expiresAt = null;
        if (formData.expiresIn !== '0') {
            const minutes = parseInt(formData.expiresIn, 10);
            expiresAt = new Date(new Date().getTime() + minutes * 60000).toISOString();
        }

        const payload = {
            title: formData.title.trim(),
            content: formData.content,
            language: formData.language,
            tags: processedTags,
            isProtected: formData.password.length > 0,
            password: formData.password,
        };

        if (expiresAt) {
            payload.expiresAt = expiresAt;
        }

        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="animate-fade-in glass" style={{
            padding: '2rem',
            borderRadius: 'var(--radius-lg)'
        }}>
            <div className="input-group">
                <label className="input-label">Title (Optional)</label>
                <input
                    type="text"
                    name="title"
                    className="input-field"
                    placeholder="e.g. Server Setup Script"
                    value={formData.title}
                    onChange={handleChange}
                />
            </div>

            <div className="input-group" style={{ flex: 1 }}>
                <label className="input-label">
                    Content <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <textarea
                    name="content"
                    className="input-field"
                    style={{
                        minHeight: '300px',
                        fontFamily: 'var(--font-mono)',
                        resize: 'vertical'
                    }}
                    placeholder="Paste your code or text here..."
                    value={formData.content}
                    onChange={handleChange}
                />
                {errors.content && formData.content.length > 0 && <span style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{errors.content}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                <div className="input-group">
                    <label className="input-label">Syntax Highlighting</label>
                    <select
                        name="language"
                        className="input-field"
                        value={formData.language}
                        onChange={handleChange}
                    >
                        {LANGUAGES.map(l => (
                            <option key={l.value} value={l.value}>{l.label}</option>
                        ))}
                    </select>
                </div>

                <div className="input-group">
                    <label className="input-label">Auto Destruct</label>
                    <select
                        name="expiresIn"
                        className="input-field"
                        value={formData.expiresIn}
                        onChange={handleChange}
                        disabled={!!initialData.id}
                    >
                        {EXPIRY_OPTIONS.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="input-group">
                    <label className="input-label">Tags (comma separated)</label>
                    <input
                        type="text"
                        name="tags"
                        className="input-field"
                        placeholder="js, frontend, util"
                        value={formData.tags}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">Password Protection (Optional)</label>
                    <input
                        type="password"
                        name="password"
                        className="input-field"
                        placeholder="Leave empty for public"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1rem',
                marginTop: '2rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--border-color)'
            }}>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onCancel}
                    disabled={isSaving}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={Object.keys(errors).length > 0 || isSaving || !formData.content.trim()}
                >
                    {isSaving ? 'Saving...' : 'Save Clip'}
                </button>
            </div>
        </form>
    );
}

export default ClipEditor;
