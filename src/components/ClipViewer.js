import React, { useState } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs2015, vs } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { FiCopy, FiCheck} from 'react-icons/fi';
import { useTheme } from '../hooks/useTheme';
import { THEMES } from '../utils/constants';
import { toast } from './Toast';

function ClipViewer({ clip, onCodeCopied }) {
    const [copied, setCopied] = useState(false);
    const [theme] = useTheme();

    const isDark =
        theme === THEMES.DARK ||
        (theme === THEMES.SYSTEM && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const syntaxTheme = isDark ? vs2015 : vs;

    const handleCopy = () => {
        navigator.clipboard.writeText(clip.content)
            .then(() => {
                setCopied(true);
                toast.success('Copied to clipboard!');
                if (onCodeCopied) onCodeCopied();
                setTimeout(() => setCopied(false), 2000);
            })
            .catch((err) => {
                console.error('Failed to copy', err);
                toast.error('Failed to copy. Please try manually.');
            });
    };

    return (
        <div className="glass" style={{
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '1px solid var(--border-color)',
            position: 'relative'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--bg-accent)',
                borderBottom: '1px solid var(--border-color)'
            }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{
                        width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56'
                    }}></span>
                    <span style={{
                        width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e'
                    }}></span>
                    <span style={{
                        width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f'
                    }}></span>
                    <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {clip.language || 'text'}
                    </span>
                </div>

                <button
                    className="btn btn-primary"
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem' }}
                    onClick={handleCopy}
                >
                    {copied ? <><FiCheck /> Copied!</> : <><FiCopy /> Copy</>}
                </button>
            </div>

            <div style={{
                position: 'relative',
                maxHeight: '600px',
                overflow: 'auto',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-mono)'
            }}>
                <SyntaxHighlighter
                    language={clip.language === 'text' ? 'plaintext' : clip.language}
                    style={syntaxTheme}
                    showLineNumbers={true}
                    wrapLines={true}
                    customStyle={{
                        margin: 0,
                        padding: '1.5rem',
                        background: 'transparent',
                        minHeight: '200px'
                    }}
                >
                    {clip.content}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}

export default ClipViewer;
