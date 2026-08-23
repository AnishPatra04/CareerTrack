import React from 'react';
import { X, Calendar, Globe, MapPin, DollarSign, Tag, Info, Clock, AlignLeft } from 'lucide-react';

export default function ApplicationDetailsModal({ isOpen, onClose, application }) {
  if (!isOpen || !application) return null;

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

  const getJobTypeClass = (type) => {
    switch (type) {
      case 'Full-time': return 'badge-ft';
      case 'Internship': return 'badge-intern';
      case 'Contract': return 'badge-contract';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="detail-modal-title">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <h2 id="detail-modal-title" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {application.position}
            </h2>
            <span style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              {application.company}
            </span>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </header>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {/* Status and Type Badges */}
          <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
            <span className={`badge ${getStatusClass(application.status)}`}>
              <Info size={12} style={{ marginRight: '4px' }} />
              {application.status}
            </span>
            <span className={`badge ${getJobTypeClass(application.jobType)}`}>
              <Tag size={12} style={{ marginRight: '4px' }} />
              {application.jobType}
            </span>
          </div>

          <div className="detail-grid">
            {/* Location */}
            <div className="detail-block">
              <span className="detail-label">
                <MapPin size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                Location
              </span>
              <span className="detail-value">{application.location || 'Not Specified'}</span>
            </div>

            {/* Salary */}
            <div className="detail-block">
              <span className="detail-label">
                <DollarSign size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                Salary
              </span>
              <span className="detail-value">{application.salary || 'Not Specified'}</span>
            </div>

            {/* Date Applied */}
            <div className="detail-block">
              <span className="detail-label">
                <Calendar size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                Date Applied
              </span>
              <span className="detail-value">{formatDate(application.dateApplied)}</span>
            </div>

            {/* Interview Date */}
            <div className="detail-block">
              <span className="detail-label">
                <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                Interview Date
              </span>
              <span className="detail-value" style={{ color: application.interviewDate ? 'var(--primary)' : 'inherit' }}>
                {application.interviewDate ? formatDate(application.interviewDate) : 'Not Scheduled'}
              </span>
            </div>

            {/* Job URL */}
            {application.jobUrl && (
              <div className="detail-block detail-block-full">
                <span className="detail-label">
                  <Globe size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                  Job URL
                </span>
                <span className="detail-value">
                  <a
                    href={application.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="detail-url-link"
                  >
                    View Job Posting
                    <Globe size={12} />
                  </a>
                </span>
              </div>
            )}

            {/* Notes */}
            <div className="detail-block detail-block-full" style={{ borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-md)' }}>
              <span className="detail-label">
                <AlignLeft size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                Notes & Description
              </span>
              <p className="detail-value" style={{ 
                whiteSpace: 'pre-wrap', 
                fontSize: '0.875rem', 
                color: 'var(--text-secondary)',
                lineHeight: '1.5',
                marginTop: '0.25rem' 
              }}>
                {application.notes || 'No notes added for this application.'}
              </p>
            </div>
          </div>
        </div>

        <footer className="modal-footer">
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </footer>
      </div>
    </div>
  );
}
