import React from 'react';
import { LayoutDashboard, Briefcase, Calendar, BarChart3, Settings as SettingsIcon, X } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen, userSettings }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'applications', label: 'Applications', icon: Briefcase },
    { id: 'interviews', label: 'Interviews', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setIsOpen(false); // Close sidebar on mobile after clicking
  };

  // Get initials for profile avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsOpen(false)} />
      )}

      <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <span style={{ fontSize: '1.25rem' }}>🎯</span>
          </div>
          <span>CareerTrack</span>
          {/* Close button for mobile */}
          <button 
            className="menu-toggle-btn modal-close-btn" 
            style={{ marginLeft: 'auto', display: 'none', color: '#fff' }}
            onClick={() => setIsOpen(false)}
            aria-label="Close Navigation Menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-profile">
          <div className="sidebar-avatar">
            {getInitials(userSettings.profileName)}
          </div>
          <div className="sidebar-profile-info">
            <div className="sidebar-profile-name">{userSettings.profileName || 'Guest User'}</div>
            <div className="sidebar-profile-email">{userSettings.profileEmail || 'guest@example.com'}</div>
          </div>
        </div>
      </aside>
      
      {/* Inline styles override to show sidebar close button on mobile */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 1024px) {
          .sidebar .modal-close-btn {
            display: flex !important;
          }
        }
      `}} />
    </>
  );
}
