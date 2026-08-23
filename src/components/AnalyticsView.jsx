import React from 'react';
import { BarChart3, TrendingUp, HelpCircle } from 'lucide-react';
import EmptyState from './EmptyState';

export default function AnalyticsView({ applications }) {
  const totalCount = applications.length;

  if (totalCount === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <div className="page-title-group">
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Analytics</h1>
            <p className="page-subtitle">Visual summaries of your job search progress.</p>
          </div>
        </div>
        <EmptyState
          icon={BarChart3}
          title="No data to analyze"
          description="Analytics are generated automatically once you log job applications and update their statuses."
        />
      </div>
    );
  }

  // 1. Calculate Status Counts
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

  // 2. Calculate Rates
  // Interview rate: Applications with Interview status OR has an interview date
  const interviewCount = applications.filter((app) => app.status === 'Interview' || !!app.interviewDate).length;
  const offerCount = statusCounts['Offer'];
  const rejectedCount = statusCounts['Rejected'];

  const interviewRate = totalCount > 0 ? Math.round((interviewCount / totalCount) * 100) : 0;
  const offerRate = totalCount > 0 ? Math.round((offerCount / totalCount) * 100) : 0;
  const rejectionRate = totalCount > 0 ? Math.round((rejectedCount / totalCount) * 100) : 0;

  // Active Pipeline
  const activeCount = applications.filter(
    (app) => ['Applied', 'Online Assessment', 'Interview'].includes(app.status)
  ).length;
  const activeRate = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return 'var(--status-applied-text)';
      case 'Online Assessment': return 'var(--status-assessment-text)';
      case 'Interview': return 'var(--status-interview-text)';
      case 'Offer': return 'var(--status-offer-text)';
      case 'Rejected': return 'var(--status-rejected-text)';
      default: return 'var(--primary)';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'Applied': return '#3b82f6'; // Blue 500
      case 'Online Assessment': return '#a855f7'; // Purple 500
      case 'Interview': return '#f97316'; // Orange 500
      case 'Offer': return '#10b981'; // Emerald 500
      case 'Rejected': return '#ef4444'; // Red 500
      default: return 'var(--primary)';
    }
  };

  // Helper for rendering conic gradient circles
  const getRingStyle = (percentage, color) => {
    return {
      background: `radial-gradient(closest-side, var(--bg-surface) 79%, transparent 80% 100%), conic-gradient(${color} ${percentage}%, var(--border-color) 0)`
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div className="page-title-group">
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Analytics</h1>
          <p className="page-subtitle">Real-time statistics computed from your tracked positions.</p>
        </div>
      </div>

      {/* Summary Grid */}
      <div className="analytics-summary-grid">
        <div className="analytics-card-compact">
          <span className="analytics-card-label">Total Applications</span>
          <span className="analytics-card-val">{totalCount}</span>
        </div>
        <div className="analytics-card-compact">
          <span className="analytics-card-label">Active Pipeline</span>
          <span className="analytics-card-val" style={{ color: 'var(--status-applied-text)' }}>
            {activeCount} <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>({activeRate}%)</span>
          </span>
        </div>
        <div className="analytics-card-compact">
          <span className="analytics-card-label">Interviews Run</span>
          <span className="analytics-card-val" style={{ color: 'var(--status-interview-text)' }}>
            {interviewCount}
          </span>
        </div>
        <div className="analytics-card-compact">
          <span className="analytics-card-label">Offers Won</span>
          <span className="analytics-card-val" style={{ color: 'var(--status-offer-text)' }}>
            {offerCount}
          </span>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="analytics-charts-grid">
        {/* Status Distribution Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Status Breakdown</h3>
          </div>
          
          <div className="bar-chart-container">
            {Object.entries(statusCounts).map(([status, count]) => {
              const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
              return (
                <div key={status} className="bar-chart-row">
                  <span className="bar-chart-label" style={{ color: getStatusColor(status) }}>{status}</span>
                  <div className="bar-chart-bar-wrapper">
                    <div
                      className="bar-chart-fill"
                      style={{
                        width: `${Math.max(percentage, 5)}%`,
                        backgroundColor: getStatusBgColor(status)
                      }}
                    >
                      {percentage > 10 && `${percentage}%`}
                    </div>
                  </div>
                  <span className="bar-chart-value">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Funnel Conversion Rates */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Conversion Rates</h3>
          </div>

          <div className="rates-grid">
            <div className="rate-ring-container">
              <div 
                className="rate-ring-visual" 
                style={getRingStyle(interviewRate, '#f97316')}
                aria-label={`Interview Rate: ${interviewRate}%`}
              >
                <span className="rate-ring-value">{interviewRate}%</span>
              </div>
              <span className="rate-ring-label">Interview Rate</span>
            </div>

            <div className="rate-ring-container">
              <div 
                className="rate-ring-visual" 
                style={getRingStyle(offerRate, '#10b981')}
                aria-label={`Offer Rate: ${offerRate}%`}
              >
                <span className="rate-ring-value">{offerRate}%</span>
              </div>
              <span className="rate-ring-label">Offer Rate</span>
            </div>

            <div className="rate-ring-container">
              <div 
                className="rate-ring-visual" 
                style={getRingStyle(rejectionRate, '#ef4444')}
                aria-label={`Rejection Rate: ${rejectionRate}%`}
              >
                <span className="rate-ring-value">{rejectionRate}%</span>
              </div>
              <span className="rate-ring-label">Rejection Rate</span>
            </div>
          </div>

          {/* Simple breakdown analytics logic helper info */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-xs)', background: 'var(--bg-hover)', padding: 'var(--space-md)', borderRadius: 'var(--border-radius-md)', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 'auto' }}>
            <TrendingUp size={16} style={{ flexShrink: 0, color: 'var(--primary)' }} />
            <div>
              <strong>Pipeline Efficiency:</strong> Your overall interview rate is <strong>{interviewRate}%</strong>.
              {offerRate > 0 ? (
                <span> With an offer rate of <strong>{offerRate}%</strong>, your search is highly competitive. Keep it up!</span>
              ) : (
                <span> Focus on preparing for outstanding assessments and interviews to unlock pending offers.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
