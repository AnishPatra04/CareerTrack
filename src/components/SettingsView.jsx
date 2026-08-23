import React, { useState, useEffect } from 'react';
import { User, Bell, Monitor, Save, Check } from 'lucide-react';

export default function SettingsView({ userSettings, onSaveSettings, triggerToast }) {
  const [profileName, setProfileName] = useState(userSettings.profileName || '');
  const [profileEmail, setProfileEmail] = useState(userSettings.profileEmail || '');
  const [theme, setTheme] = useState(userSettings.theme || 'light');
  const [compactMode, setCompactMode] = useState(userSettings.compactMode || false);
  const [interviewReminders, setInterviewReminders] = useState(userSettings.interviewReminders || false);
  const [applicationUpdates, setApplicationUpdates] = useState(userSettings.applicationUpdates || false);

  const [hasChanges, setHasChanges] = useState(false);

  // Apply visual settings immediately to body/html
  useEffect(() => {
    // Apply theme attribute
    document.documentElement.setAttribute('data-theme', theme);
    
    // Apply compact mode class
    if (compactMode) {
      document.body.classList.add('compact-mode');
    } else {
      document.body.classList.remove('compact-mode');
    }

    // Revert to parent's saved settings on unmount/cleanup
    return () => {
      document.documentElement.setAttribute('data-theme', userSettings.theme || 'light');
      if (userSettings.compactMode) {
        document.body.classList.add('compact-mode');
      } else {
        document.body.classList.remove('compact-mode');
      }
    };
  }, [theme, compactMode, userSettings]);

  // Sync state if parent state changes (e.g. initial load)
  useEffect(() => {
    setProfileName(userSettings.profileName);
    setProfileEmail(userSettings.profileEmail);
    setTheme(userSettings.theme);
    setCompactMode(userSettings.compactMode);
    setInterviewReminders(userSettings.interviewReminders);
    setApplicationUpdates(userSettings.applicationUpdates);
  }, [userSettings]);

  // Track if changes have been made
  useEffect(() => {
    const changed = 
      profileName !== userSettings.profileName ||
      profileEmail !== userSettings.profileEmail ||
      theme !== userSettings.theme ||
      compactMode !== userSettings.compactMode ||
      interviewReminders !== userSettings.interviewReminders ||
      applicationUpdates !== userSettings.applicationUpdates;
      
    setHasChanges(changed);
  }, [profileName, profileEmail, theme, compactMode, interviewReminders, applicationUpdates, userSettings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!profileName.trim()) {
      triggerToast('error', 'Profile Error', 'Profile Name cannot be empty.');
      return;
    }

    if (profileEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileEmail.trim())) {
      triggerToast('error', 'Profile Error', 'Please enter a valid email address.');
      return;
    }

    onSaveSettings({
      profileName: profileName.trim(),
      profileEmail: profileEmail.trim(),
      theme,
      compactMode,
      interviewReminders,
      applicationUpdates
    });

    triggerToast('success', 'Settings Saved', 'Your configuration has been updated successfully!');
    setHasChanges(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div className="page-title-group">
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Settings</h1>
          <p className="page-subtitle">Configure your CareerTrack profile and dashboard preferences.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {/* Profile Settings */}
        <div className="settings-section-card">
          <div className="settings-section-header">
            <User size={20} />
            <h2 className="settings-section-title">Profile Information</h2>
          </div>
          
          <div className="form-row">
            <div className="form-group" style={{ flex: 1, minWidth: '240px' }}>
              <label htmlFor="profileName" className="form-label">Full Name</label>
              <input
                type="text"
                id="profileName"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="form-input"
                placeholder="e.g. Alex Morgan"
                maxLength={50}
              />
            </div>
            
            <div className="form-group" style={{ flex: 1, minWidth: '240px' }}>
              <label htmlFor="profileEmail" className="form-label">Email Address</label>
              <input
                type="email"
                id="profileEmail"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className="form-input"
                placeholder="e.g. alex.morgan@example.com"
                maxLength={100}
              />
            </div>
          </div>
        </div>

        {/* Preferences / Theme Settings */}
        <div className="settings-section-card">
          <div className="settings-section-header">
            <Monitor size={20} />
            <h2 className="settings-section-title">Theme Preferences</h2>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ marginBottom: 'var(--space-sm)' }}>Choose UI Theme</label>
            <div className="theme-selector-grid">
              {/* Light Theme Button */}
              <button
                type="button"
                className={`theme-option-btn ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
                data-theme="light"
              >
                <div className="theme-preview-box">
                  <div className="theme-preview-sidebar" />
                  <div className="theme-preview-body">
                    <div className="theme-preview-card" />
                  </div>
                </div>
                <span>Light Theme</span>
              </button>

              {/* Dark Theme Button */}
              <button
                type="button"
                className={`theme-option-btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
                data-theme="dark"
              >
                <div className="theme-preview-box">
                  <div className="theme-preview-sidebar" />
                  <div className="theme-preview-body">
                    <div className="theme-preview-card" />
                  </div>
                </div>
                <span>Dark Theme</span>
              </button>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: 'var(--space-sm)' }}>
            <label className="settings-row-checkbox" htmlFor="compactMode">
              <input
                type="checkbox"
                id="compactMode"
                checked={compactMode}
                onChange={(e) => setCompactMode(e.target.checked)}
                className="settings-checkbox"
              />
              <div className="settings-checkbox-label-group">
                <span className="settings-checkbox-title">Enable Compact Mode</span>
                <span className="settings-checkbox-desc">Reduces margins, spacing, and size of table items for dense viewports.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="settings-section-card">
          <div className="settings-section-header">
            <Bell size={20} />
            <h2 className="settings-section-title">Notifications</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <label className="settings-row-checkbox" htmlFor="interviewReminders">
              <input
                type="checkbox"
                id="interviewReminders"
                checked={interviewReminders}
                onChange={(e) => setInterviewReminders(e.target.checked)}
                className="settings-checkbox"
              />
              <div className="settings-checkbox-label-group">
                <span className="settings-checkbox-title">Interview Reminders</span>
                <span className="settings-checkbox-desc">Show timeline cues and reminders for upcoming scheduled interview rounds.</span>
              </div>
            </label>

            <label className="settings-row-checkbox" htmlFor="applicationUpdates">
              <input
                type="checkbox"
                id="applicationUpdates"
                checked={applicationUpdates}
                onChange={(e) => setApplicationUpdates(e.target.checked)}
                className="settings-checkbox"
              />
              <div className="settings-checkbox-label-group">
                <span className="settings-checkbox-title">Application Progress Updates</span>
                <span className="settings-checkbox-desc">Notify upon major milestones (offers won, interview loops completed).</span>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-md)', gap: 'var(--space-md)', alignItems: 'center' }}>
          {hasChanges && (
            <span style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="pulsing-dot" /> You have unsaved settings modifications.
            </span>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!hasChanges}
            style={{ width: 'max-content' }}
          >
            <Save size={16} />
            <span>Save Settings</span>
          </button>
        </div>
      </form>

      {/* Inline styles override for pulsing dot indicator */}
      <style dangerouslySetInnerHTML={{__html: `
        .pulsing-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--primary);
          display: inline-block;
          animation: pulse 1.5s infinite ease-in-out;
        }
        @keyframes pulse {
          0% { transform: scale(0.85); opacity: 0.5; }
          50% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(0.85); opacity: 0.5; }
        }
      `}} />
    </div>
  );
}
