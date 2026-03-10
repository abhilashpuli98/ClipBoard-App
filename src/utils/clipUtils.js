import { v4 as uuidv4 } from 'uuid';

export const generateId = () => {
    return uuidv4();
};

export const getWordCount = (text) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

export const getByteSize = (str) => {
    return new Blob([str]).size;
};

export const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const isClipExpired = (clip) => {
    if (!clip.expiresAt) return false;
    return new Date(clip.expiresAt).getTime() < new Date().getTime();
};

export const encodeClipboardData = (content) => {
    try {
        return btoa(encodeURIComponent(content));
    } catch (err) {
        console.error('Failed to encode data', err);
        return null;
    }
};

export const decodeClipboardData = (encoded) => {
    try {
        return decodeURIComponent(atob(encoded));
    } catch (err) {
        console.error('Failed to decode data', err);
        return null;
    }
};
