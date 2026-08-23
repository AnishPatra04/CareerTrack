import React from 'react';
import { Briefcase, Activity, Calendar, Award, Plus, Clock, ExternalLink } from 'lucide-react';
import EmptyState from './EmptyState';

export default function DashboardView({ applications, onAddClick, onViewClick, userSettings }) {
  // 1. Calculate statistics
  const totalCount = applications.length;
  
  const activeCount = applications.filter(
    (app) => ['Applied', 'Online Assessment', 'Interview'].includes(app.status)
  ).length;
  
  const interviewCount = applications.filter(
    (app) => app.status === 'Interview' || app.interviewDate
  ).length;
  
  const offerCount = applications.filter((app) => app.status === 'Offer').length;

  // 2. Filter and sort Recent Applications (latest 5 based on dateApplied, then ID/Index)
  const recentApps = [...applications]
    .sort((a, b) => new Date(b.dateApplied) - new Date(a.dateApplied))
    .slice(0, 5);

  // 3. Filter and sort Upcoming Interviews (interviewDate exists and is in the future or today)
  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingInterviews = applications
    .filter((app) => app.interviewDate && app.interviewDate >= todayStr)
    .sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate))
    .slice(0, 5);

  // 4. Status distribution calculation
  const statusCounts = {
    'Applied': 0,
    'Online Assessment': 0,
    'Interview': 0,
    'Offer': 0,
    'Rejected': 0
  };
  applications.forEach((app) => {
    if (statusCounts[app.status] !== undefined) {
      statusCounts[app.status]++;
    }
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'Applied': return 'badge-applied';
      case 'Online Assessment': return 'badge-assessment';
      case 'Interview': return 'badge-interview';
      case 'Offer': return 'badge-offer';
      case 'Rejected': return 'badge-rejected';
      default: return '';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return '#1d4ed8'; // Blue
      case 'Online Assessment': return '#7e22ce'; // Purple
      case 'Interview': return '#c2410c'; // Orange
      case 'Offer': return '#047857'; // Emerald
      case 'Rejected': return '#b91c1c'; // Red
      default: return 'var(--primary)';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      {/* Welcome Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div className="page-title-group">
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Welcome back, {userSettings.profileName.split(' ')[0] || 'User'}!
          </h1>
          <p className="page-subtitle">
            Here is your current job placement and application pipeline.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onAddClick}>
          <Plus size={18} />
          <span>Add Application</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Total Applications</span>
            <span className="stat-val">{totalCount}</span>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Briefcase size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Active Pipeline</span>
            <span className="stat-val">{activeCount}</span>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--status-applied-bg)', color: 'var(--status-applied-text)' }}>
            <Activity size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Interviews</span>
            <span className="stat-val">{interviewCount}</span>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--status-interview-bg)', color: 'var(--status-interview-text)' }}>
            <Calendar size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Offers</span>
            <span className="stat-val">{offerCount}</span>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--status-offer-bg)', color: 'var(--status-offer-text)' }}>
            <Award size={22} />
          </div>
        </div>
      </div>

      {/* Main Dashboard Sections */}
      {totalCount === 0 ? (
        <EmptyState 
          icon={Briefcase}
          title="No applications tracked yet"
          description="Start building your placement pipeline today by logging your first job application."
          actionText="Add Application"
          onActionClick={onAddClick}
        />
      ) : (
        <div className="dashboard-grid">
          {/* Left Column: Recent Applications */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <h2 className="dashboard-section-title">Recent Applications</h2>
            {recentApps.length > 0 ? (
              <div className="recent-list">
                {recentApps.map((app) => (
                  <div key={app.id} className="recent-item">
                    <div className="recent-item-meta">
                      <div className="recent-company-logo">
                        {app.company ? app.company[0].toUpperCase() : '?'}
                      </div>
                      <div className="recent-info-block">
                        <span className="recent-title">{app.position}</span>
                        <span className="recent-company">{app.company} • {app.location || 'Remote'}</span>
                      </div>
                    </div>

                    <div className="recent-item-details">
                      {app.salary && (
                        <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                          {app.salary}
                        </span>
                      )}
                      <span className="recent-date">Applied {formatDate(app.dateApplied)}</span>
                      <span className={`badge ${getStatusClass(app.status)}`}>
                        {app.status}
                      </span>
                      <button 
                        onClick={() => onViewClick(app)} 
                        className="action-btn-circle" 
                        aria-label="View Details"
                        data-tooltip="View Details"
                      >
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No recent applications.</p>
            )}
          </div>

          {/* Right Column: Interviews & Pipeline Status */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            {/* Upcoming Interviews */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <h2 className="dashboard-section-title">Upcoming Interviews</h2>
              {upcomingInterviews.length > 0 ? (
                <div className="interview-timeline">
                  {upcomingInterviews.map((app) => (
                    <div key={app.id} className="timeline-card">
                      <div className="timeline-date">
                        <Clock size={12} />
                        <span>{formatDate(app.interviewDate)}</span>
                      </div>
                      <div className="timeline-company">{app.company}</div>
                      <div className="timeline-position">{app.position}</div>
                      {app.notes && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '0.25rem' }}>
                          Note: {app.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="timeline-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-lg)', borderStyle: 'dashed', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                    No upcoming interviews scheduled.
                  </p>
                </div>
              )}
            </div>

            {/* Pipeline Distribution */}
            <div className="card" style={{ gap: 'var(--space-md)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Pipeline Distribution</h3>
              <div className="distribution-list">
                {Object.entries(statusCounts).map(([status, count]) => {
                  const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
                  return (
                    <div key={status} className="distribution-item">
                      <div className="distribution-meta">
                        <span style={{ color: 'var(--text-secondary)' }}>{status}</span>
                        <span>{count} ({percentage}%)</span>
                      </div>
                      <div className="distribution-track">
                        <div 
                          className="distribution-fill" 
                          style={{ 
                            width: `${percentage}%`, 
                            backgroundColor: getStatusColor(status) 
                          }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
