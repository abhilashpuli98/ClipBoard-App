import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useKeyboardShortcuts(actions) {
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (e) => {
           if (
                e.target.tagName === 'INPUT' ||
                e.target.tagName === 'TEXTAREA' ||
                e.target.isContentEditable
            ) {
                if (e.ctrlKey && e.key === 's' && actions.onSave) {
                    e.preventDefault();
                    actions.onSave();
                }
                return;
            }

            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                navigate('/clip/new');
            }

            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                const searchInput = document.getElementById('global-search');
                if (searchInput) searchInput.focus();
            }

            if (e.key === 'Escape' && actions.onEscape) {
                e.preventDefault();
                actions.onEscape();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigate, actions]);
}
