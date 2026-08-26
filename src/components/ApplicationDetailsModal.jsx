import React, { useState } from 'react';
import { X, Calendar, Globe, MapPin, DollarSign, Tag, Info, Clock, AlignLeft, Sparkles, RefreshCw, AlertCircle, BrainCircuit } from 'lucide-react';

// URL safety validation helper
const isSafeUrl = (url) => {
  if (!url) return true;
  const trimmed = url.trim();

  // Check if the URL starts with a scheme that is NOT http/https
  const schemeMatch = trimmed.match(/^([a-z0-9+.-]+):/i);
  if (schemeMatch) {
    const scheme = schemeMatch[1].toLowerCase();
    const rest = trimmed.substring(schemeMatch[0].length);
    const isPort = /^\d+($|\/)/.test(rest);
    const isLocalhost = scheme === 'localhost';
    const hasDot = scheme.includes('.');
    
    if (!isPort && !isLocalhost && !hasDot) {
      if (scheme !== 'http' && scheme !== 'https') {
        return false;
      }
    }
  }

  // Verify it can be parsed as a valid URL
  try {
    const hasScheme = /^https?:\/\//i.test(trimmed);
    new URL(hasScheme ? trimmed : 'https://' + trimmed);
    return true;
  } catch {
    return false;
  }
};

export default function ApplicationDetailsModal({ isOpen, onClose, application, onUpdate }) {
  const [activeModalTab, setActiveModalTab] = useState('details'); // 'details' or 'prep'
  const [prepLoading, setPrepLoading] = useState(false);
  const [prepError, setPrepError] = useState(null);

  const [prevApplicationId, setPrevApplicationId] = useState(application?.id);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (application?.id !== prevApplicationId || isOpen !== prevIsOpen) {
    setPrevApplicationId(application?.id);
    setPrevIsOpen(isOpen);
    setActiveModalTab('details');
    setPrepError(null);
    setPrepLoading(false);
  }

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

  const handleGeneratePrep = async () => {
    setPrepLoading(true);
    setPrepError(null);

    try {
      const response = await fetch('/api/generate-prep', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          company: application.company,
          position: application.position,
          location: application.location,
          jobType: application.jobType,
          status: application.status,
          interviewDate: application.interviewDate,
          notes: application.notes
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to connect to the AI service. Verify that the environment variable is configured.');
      }

      const prepData = await response.json();
      
      // Validation of response structure
      if (
        typeof prepData.preparationSummary !== 'string' ||
        !Array.isArray(prepData.likelyQuestions) ||
        !Array.isArray(prepData.talkingPoints) ||
        !Array.isArray(prepData.preparationTips)
      ) {
        throw new Error('AI returned an invalid structured format.');
      }

      onUpdate({
        ...application,
        aiPrep: prepData
      });
    } catch (err) {
      console.error('AI generation error:', err);
      setPrepError(err.message || 'Failed to prepare interview tips.');
    } finally {
      setPrepLoading(false);
    }
  };

  const renderPrepLoading = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-xl) var(--space-md)', textAlign: 'center', gap: 'var(--space-md)' }}>
      <div className="prep-spinner" style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '3px solid var(--border-color)',
        borderTopColor: 'var(--primary)',
        animation: 'spin 1s linear infinite'
      }} />
      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Analyzing Job Profile...</div>
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0, maxWidth: '280px' }}>
        Tailoring interview questions, talking points, and preparation tips using Google Gemini...
      </p>
    </div>
  );

  const renderPrepError = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-xl) var(--space-md)', textAlign: 'center', gap: 'var(--space-md)' }}>
      <AlertCircle size={36} style={{ color: 'var(--status-rejected-text)' }} />
      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Preparation Failed</div>
      <p style={{ fontSize: '0.8125rem', color: 'var(--status-rejected-text)', backgroundColor: 'var(--status-rejected-bg)', padding: 'var(--space-sm) var(--space-md)', borderRadius: 'var(--border-radius-md)', margin: 0, maxWidth: '100%', wordBreak: 'break-word' }}>
        {prepError}
      </p>
      <button type="button" className="btn btn-primary" onClick={handleGeneratePrep} style={{ width: 'max-content', marginTop: 'var(--space-xs)' }}>
        <RefreshCw size={14} style={{ marginRight: '6px' }} />
        <span>Try Again</span>
      </button>
    </div>
  );

  const renderPrepIdle = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-xl) var(--space-md)', textAlign: 'center', gap: 'var(--space-md)', background: 'var(--bg-hover)', borderRadius: 'var(--border-radius-lg)', border: '1px dashed var(--border-color)' }}>
      <BrainCircuit size={40} style={{ color: 'var(--primary)' }} />
      <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>Generate AI Prep Notes</div>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '360px', lineHeight: '1.5' }}>
        Get custom AI questions, key talking points, and strategic preparation advice tailored to the <strong>{application.position}</strong> role at <strong>{application.company}</strong>.
      </p>
      <button type="button" className="btn btn-primary" onClick={handleGeneratePrep} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: 'var(--space-xs)' }}>
        <Sparkles size={14} />
        <span>Generate Prep Plan</span>
      </button>
    </div>
  );

  const renderPrepSuccess = () => {
    const { preparationSummary, likelyQuestions, talkingPoints, preparationTips } = application.aiPrep;
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        {/* Header Summary */}
        <div style={{ background: 'var(--primary-light)', padding: 'var(--space-md)', borderRadius: 'var(--border-radius-md)', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--primary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Prep Strategy Summary
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', margin: 0, lineHeight: '1.5' }}>
            {preparationSummary}
          </p>
        </div>

        {/* Likely Questions */}
        <div>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-xs)' }}>
            <span style={{ fontSize: '1.125rem' }}>❓</span> Likely Interview Questions
          </h3>
          <ul style={{ paddingLeft: 'var(--space-lg)', margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            {likelyQuestions.map((q, idx) => (
              <li key={idx} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {q}
              </li>
            ))}
          </ul>
        </div>

        {/* Talking Points */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-md)' }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-xs)' }}>
            <span style={{ fontSize: '1.125rem' }}>🎯</span> Key Talking Points to Emphasize
          </h3>
          <ul style={{ paddingLeft: 'var(--space-lg)', margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            {talkingPoints.map((tp, idx) => (
              <li key={idx} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {tp}
              </li>
            ))}
          </ul>
        </div>

        {/* Preparation Tips */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-md)' }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-xs)' }}>
            <span style={{ fontSize: '1.125rem' }}>💡</span> Practical Preparation Tips
          </h3>
          <ul style={{ paddingLeft: 'var(--space-lg)', margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            {preparationTips.map((tip, idx) => (
              <li key={idx} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Refresh button at bottom */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-xs)', borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-md)' }}>
          <button type="button" className="btn btn-secondary" onClick={handleGeneratePrep} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', padding: 'var(--space-xs) var(--space-sm)' }}>
            <RefreshCw size={12} />
            <span>Regenerate Prep Plan</span>
          </button>
        </div>
      </div>
    );
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

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', minHeight: '320px', overflowY: 'auto' }}>
          {/* Status and Type Badges */}
          <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap', alignItems: 'center' }}>
            <span className={`badge ${getStatusClass(application.status)}`}>
              <Info size={12} style={{ marginRight: '4px' }} />
              {application.status}
            </span>
            <span className={`badge ${getJobTypeClass(application.jobType)}`}>
              <Tag size={12} style={{ marginRight: '4px' }} />
              {application.jobType}
            </span>
          </div>

          {/* Tab Navigation */}
          <div className="modal-tabs" style={{ display: 'flex', gap: 'var(--space-md)', borderBottom: '1px solid var(--border-color)', marginBottom: 'var(--space-xs)', paddingBottom: 'var(--space-xs)' }}>
            <button
              type="button"
              className={`tab-btn ${activeModalTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveModalTab('details')}
              style={{
                background: 'none',
                border: 'none',
                padding: 'var(--space-xs) var(--space-sm)',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: activeModalTab === 'details' ? 'var(--primary)' : 'var(--text-secondary)',
                borderBottom: activeModalTab === 'details' ? '2px solid var(--primary)' : 'none',
                cursor: 'pointer'
              }}
            >
              Job Details
            </button>
            <button
              type="button"
              className={`tab-btn ${activeModalTab === 'prep' ? 'active' : ''}`}
              onClick={() => setActiveModalTab('prep')}
              style={{
                background: 'none',
                border: 'none',
                padding: 'var(--space-xs) var(--space-sm)',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: activeModalTab === 'prep' ? 'var(--primary)' : 'var(--text-secondary)',
                borderBottom: activeModalTab === 'prep' ? '2px solid var(--primary)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Sparkles size={12} style={{ color: 'var(--primary)' }} />
              <span>AI Interview Prep</span>
              {application.aiPrep && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />}
            </button>
          </div>

          {activeModalTab === 'details' ? (
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
              {application.jobUrl && isSafeUrl(application.jobUrl) && (
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
          ) : (
            <div className="prep-container">
              {prepLoading && renderPrepLoading()}
              {prepError && renderPrepError()}
              {!prepLoading && !prepError && application.aiPrep && renderPrepSuccess()}
              {!prepLoading && !prepError && !application.aiPrep && renderPrepIdle()}
            </div>
          )}
        </div>

        <footer className="modal-footer">
          {activeModalTab === 'details' && !application.aiPrep && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setActiveModalTab('prep');
                handleGeneratePrep();
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: 'auto' }}
            >
              <Sparkles size={14} />
              <span>Prepare for Interview</span>
            </button>
          )}
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </footer>
      </div>
    </div>
  );
}
