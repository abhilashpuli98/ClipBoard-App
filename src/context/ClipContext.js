import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId, isClipExpired } from '../utils/clipUtils';

const ClipContext = createContext(null);

export const useClips = () => useContext(ClipContext);

export const ClipProvider = ({ children }) => {
    const [clips, setClips] = useLocalStorage('clipboard_clips', []);
    const [collections, setCollections] = useLocalStorage('clipboard_collections', [
        { id: '1', name: 'Personal', color: '#3b82f6' },
        { id: '2', name: 'Work', color: '#10b981' }
    ]);
    const [trash, setTrash] = useLocalStorage('clipboard_trash', []);
    const [history, setHistory] = useLocalStorage('clipboard_history', []);

    // Periodic cleanup of expired clips
    useEffect(() => {
        const interval = setInterval(() => {
            setClips(current => {
                let changed = false;
                const active = current.filter(clip => {
                    if (isClipExpired(clip)) {
                        changed = true;
                        return false;
                    }
                    return true;
                });
                return changed ? active : current;
            });
        }, 60000);
        return () => clearInterval(interval);
    }, [setClips]);

    const addHistoryEvent = (action, clipId, clipTitle) => {
        setHistory(prev => [{
            id: generateId(),
            action,
            clipId,
            clipTitle,
            timestamp: new Date().toISOString()
        }, ...prev].slice(0, 100)); // Keep last 100 events
    };

    const addClip = (clipData) => {
        const newClip = {
            ...clipData,
            id: generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            pinned: false,
        };
        setClips(prev => [newClip, ...prev]);
        addHistoryEvent('CREATED', newClip.id, newClip.title);
        return newClip;
    };

    const updateClip = (id, updates) => {
        setClips(prev => prev.map(clip => {
            if (clip.id === id) {
                addHistoryEvent('UPDATED', id, updates.title || clip.title);
                return { ...clip, ...updates, updatedAt: new Date().toISOString() };
            }
            return clip;
        }));
    };

    const deleteClip = (id) => {
        const clipToDelete = clips.find(c => c.id === id);
        if (clipToDelete) {
            setTrash(prev => [{ ...clipToDelete, deletedAt: new Date().toISOString() }, ...prev]);
            setClips(prev => prev.filter(c => c.id !== id));
            addHistoryEvent('DELETED', id, clipToDelete.title);
        }
    };

    const restoreClip = (id) => {
        const clipToRestore = trash.find(c => c.id === id);
        if (clipToRestore) {
            setTrash(prev => prev.filter(c => c.id !== id));
            const { deletedAt, ...rest } = clipToRestore;
            setClips(prev => [rest, ...prev]);
            addHistoryEvent('RESTORED', id, clipToRestore.title);
        }
    };

    const permanentDelete = (id) => {
        setTrash(prev => prev.filter(c => c.id !== id));
    };

    const togglePin = (id) => {
        setClips(prev => prev.map(clip =>
            clip.id === id ? { ...clip, pinned: !clip.pinned } : clip
        ));
    };

    const addCollection = (name, color) => {
        const newCol = { id: generateId(), name, color };
        setCollections(prev => [...prev, newCol]);
        return newCol;
    };

    const value = {
        clips,
        collections,
        trash,
        history,
        addClip,
        updateClip,
        deleteClip,
        restoreClip,
        permanentDelete,
        togglePin,
        addCollection,
        setClips 
    };

    return (
        <ClipContext.Provider value={value}>
            {children}
        </ClipContext.Provider>
    );
};
