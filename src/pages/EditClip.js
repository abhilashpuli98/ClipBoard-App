import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClips } from '../context/ClipContext';
import ClipEditor from '../components/ClipEditor';
import PasswordGate from '../components/PasswordGate';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { toast } from '../components/Toast';

function EditClip() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { clips, updateClip } = useClips();

    const [clip, setClip] = useState(null);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const found = clips.find(c => c.id === id);
        if (!found) {
            toast.error('Clip not found');
            navigate('/');
        } else {
            setClip(found);
            if (!found.isProtected) {
                setIsUnlocked(true);
            }
        }
    }, [id, clips, navigate]);

    useKeyboardShortcuts({
        onEscape: () => navigate(`/clip/${id}`)
    });

    const handleSubmit = (clipData) => {
        setIsSaving(true);
        try {
            updateClip(id, clipData);
            toast.success('Clip updated strictly!');
            navigate(`/clip/${id}`);
        } catch (error) {
            console.error(error);
            toast.error('Failed to update clip.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!clip) return null;

    if (clip.isProtected && !isUnlocked) {
        return (
            <div className="animate-fade-in" style={{ marginTop: '10vh' }}>
                <PasswordGate
                    correctPassword={clip.password}
                    onUnlock={() => setIsUnlocked(true)}
                    onCancel={() => navigate(-1)}
                />
            </div>
        );
    }

    return (
        <div className="animate-fade-in container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                Edit Clip
            </h1>

            <ClipEditor
                initialData={clip}
                onSubmit={handleSubmit}
                onCancel={() => navigate(`/clip/${id}`)}
                isSaving={isSaving}
            />
        </div>
    );
}

export default EditClip;
