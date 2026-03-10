import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { THEMES } from '../utils/constants';

export function useTheme() {
    const [theme, setTheme] = useLocalStorage('clipboard_theme', THEMES.SYSTEM);

    useEffect(() => {
        const applyTheme = (currentTheme) => {
            const root = window.document.documentElement;
            const isDark =
                currentTheme === THEMES.DARK ||
                (currentTheme === THEMES.SYSTEM && window.matchMedia('(prefers-color-scheme: dark)').matches);

            if (isDark) {
                root.setAttribute('data-theme', 'dark');
            } else {
                root.removeAttribute('data-theme');
            }
        };

        applyTheme(theme);

        if (theme === THEMES.SYSTEM) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => applyTheme(THEMES.SYSTEM);
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [theme]);

    return [theme, setTheme];
}
