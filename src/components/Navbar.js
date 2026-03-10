import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiClipboard, FiPlus, FiFolder, FiClock, FiTrash2, FiSettings, FiMenu, FiX } from 'react-icons/fi';
import { THEMES } from '../utils/constants';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    const isActive = (path) => location.pathname === path ? 'active-link' : '';

    const navStyles = {
        header: {
            position: 'sticky',
            top: 0,
            zIndex: 50,
            backgroundColor: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-color)',
            padding: '1rem',
        },
        nav: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '1200px',
            margin: '0 auto',
        },
        logo: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: 'var(--brand-primary)',
        },
        links: {
            display: 'flex',
            gap: '1.5rem',
            alignItems: 'center',
        },
        link: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-secondary)',
            fontWeight: '500',
            transition: 'color 0.2s',
        },
        mobileMenu: {
            display: isOpen ? 'flex' : 'none',
            flexDirection: 'column',
            gap: '1rem',
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'var(--bg-secondary)',
            padding: '1rem',
            borderBottom: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)',
        }
    };

    return (
        <header style={navStyles.header}>
            <nav style={navStyles.nav}>
                <Link to="/" style={navStyles.logo} onClick={closeMenu}>
                    <FiClipboard size={24} />
                    <span className="gradient-text">ClipSync Pro</span>
                </Link>

                
                <div style={{ ...navStyles.links, display: window.innerWidth > 768 ? 'flex' : 'none' }} className="desktop-nav">
                    <Link to="/" style={navStyles.link} className={isActive('/')}>Home</Link>
                    <Link to="/collections" style={navStyles.link} className={isActive('/collections')}><FiFolder /> Collections</Link>
                    <Link to="/history" style={navStyles.link} className={isActive('/history')}><FiClock /> History</Link>
                    <Link to="/trash" style={navStyles.link} className={isActive('/trash')}><FiTrash2 /> Trash</Link>
                    <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--border-color)' }}></div>
                    <Link to="/settings" style={navStyles.link}><FiSettings /></Link>
                    <Link to="/clip/new" className="btn btn-primary" style={{ marginLeft: '0.5rem' }}>
                        <FiPlus /> New Clip
                    </Link>
                </div>
                <button
                    className="btn-icon"
                    onClick={toggleMenu}
                    style={{ display: window.innerWidth <= 768 ? 'block' : 'none' }}
                >
                    {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
                <div style={navStyles.mobileMenu}>
                    <Link to="/" style={navStyles.link} onClick={closeMenu}>Home</Link>
                    <Link to="/collections" style={navStyles.link} onClick={closeMenu}><FiFolder /> Collections</Link>
                    <Link to="/history" style={navStyles.link} onClick={closeMenu}><FiClock /> History</Link>
                    <Link to="/trash" style={navStyles.link} onClick={closeMenu}><FiTrash2 /> Trash</Link>
                    <Link to="/settings" style={navStyles.link} onClick={closeMenu}><FiSettings /> Settings</Link>
                    <Link to="/clip/new" className="btn btn-primary" style={{ marginTop: '0.5rem' }} onClick={closeMenu}>
                        <FiPlus /> New Clip
                    </Link>
                </div>
            </nav>
            <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .btn-icon { display: block !important; }
        }
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
          .btn-icon { display: none !important; }
        }
        .active-link { color: var(--brand-primary) !important; }
      `}</style>
        </header>
    );
}

export default Navbar;
