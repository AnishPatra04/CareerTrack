import React from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import EmptyState from './EmptyState';

export default function InterviewsView({ applications, onAddClick }) {
  // 1. Get current date in ISO format YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  // 2. Filter applications that have interview dates
  const appsWithInterviews = applications.filter((app) => !!app.interviewDate);

  // 3. Partition into Upcoming and Completed
  const upcomingInterviews = appsWithInterviews
    .filter((app) => app.interviewDate >= todayStr)
    .sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate)); // Soonest first

  const completedInterviews = appsWithInterviews
    .filter((app) => app.interviewDate < todayStr)
    .sort((a, b) => new Date(b.interviewDate) - new Date(a.interviewDate)); // Most recent past first

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div className="page-title-group">
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Interviews</h1>
          <p className="page-subtitle">Manage your schedule, preparations, and interview feedback.</p>
        </div>
      </div>

      {appsWithInterviews.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No interviews scheduled yet"
          description="Update your applications' status to 'Interview' or add an interview date to see them listed here."
          actionText="Log Application Interview"
          onActionClick={onAddClick}
        />
      ) : (
        <div className="interviews-layout">
          {/* Upcoming Interviews */}
          <div className="interview-column">
            <h2 className="interview-column-title">
              <span>Upcoming Interviews</span>
              <span className="interview-count-badge">{upcomingInterviews.length}</span>
            </h2>

            {upcomingInterviews.length === 0 ? (
              <div className="empty-state" style={{ padding: 'var(--space-xl)', borderStyle: 'dashed' }}>
                <Clock size={24} style={{ color: 'var(--text-muted)' }} />
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>No upcoming interviews</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>You don't have any interviews scheduled for future dates.</p>
              </div>
            ) : (
              upcomingInterviews.map((app) => (
                <div key={app.id} className="interview-row-card">
                  <div className="interview-card-meta">
                    <div className="interview-card-info">
                      <span className="interview-card-company">{app.company}</span>
                      <span className="interview-card-position">{app.position}</span>
                    </div>
                    <span className={`badge ${getStatusClass(app.status)}`}>{app.status}</span>
                  </div>

                  <div className="interview-card-meta" style={{ alignItems: 'center', marginTop: 'var(--space-xs)' }}>
                    <div className="interview-card-time">
                      <Calendar size={14} />
                      <span>{formatDate(app.interviewDate)}</span>
                    </div>
                    {app.jobType && <span className="interview-card-type">{app.jobType}</span>}
                  </div>

                  {app.notes && (
                    <div className="interview-card-notes">
                      <strong>Prep Note: </strong>
                      {app.notes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Completed Interviews */}
          <div className="interview-column">
            <h2 className="interview-column-title">
              <span>Completed Interviews</span>
              <span className="interview-count-badge">{completedInterviews.length}</span>
            </h2>

            {completedInterviews.length === 0 ? (
              <div className="empty-state" style={{ padding: 'var(--space-xl)', borderStyle: 'dashed' }}>
                <CheckCircle2 size={24} style={{ color: 'var(--text-muted)' }} />
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>No completed interviews</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>No interview dates in the past are recorded.</p>
              </div>
            ) : (
              completedInterviews.map((app) => (
                <div key={app.id} className="interview-row-card" style={{ opacity: 0.85 }}>
                  <div className="interview-card-meta">
                    <div className="interview-card-info">
                      <span className="interview-card-company" style={{ color: 'var(--text-secondary)' }}>{app.company}</span>
                      <span className="interview-card-position">{app.position}</span>
                    </div>
                    <span className={`badge ${getStatusClass(app.status)}`}>{app.status}</span>
                  </div>

                  <div className="interview-card-meta" style={{ alignItems: 'center', marginTop: 'var(--space-xs)' }}>
                    <div className="interview-card-time" style={{ color: 'var(--text-muted)' }}>
                      <CheckCircle2 size={14} style={{ color: app.status === 'Offer' ? 'var(--status-offer-text)' : 'var(--text-muted)' }} />
                      <span>{formatDate(app.interviewDate)}</span>
                    </div>
                    {app.jobType && <span className="interview-card-type">{app.jobType}</span>}
                  </div>

                  {app.notes && (
                    <div className="interview-card-notes" style={{ color: 'var(--text-muted)' }}>
                      <strong>Feedback/Notes: </strong>
                      {app.notes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
