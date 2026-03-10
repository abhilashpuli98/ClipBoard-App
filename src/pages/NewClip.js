import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClips } from '../context/ClipContext';
import ClipEditor from '../components/ClipEditor';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { toast } from '../components/Toast';

function NewClip() {
    const { addClip } = useClips();
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);

    useKeyboardShortcuts({
        onEscape: () => navigate(-1)
    });

    const handleSubmit = (clipData) => {
        setIsSaving(true);
        try {
            const newClip = addClip(clipData);
            toast.success('Clip created successfully!');
            navigate(`/clip/${newClip.id}`);
        } catch (error) {
            console.error(error);
            toast.error('Failed to create clip.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="animate-fade-in container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                Create New Clip
            </h1>

            <ClipEditor
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isSaving={isSaving}
            />
        </div>
    );
}

export default NewClip;
