import React, { useState, useMemo } from 'react';
import { Search, Plus, Eye, Edit2, Trash2, SlidersHorizontal, AlertTriangle, X } from 'lucide-react';
import EmptyState from './EmptyState';

export default function ApplicationsView({ applications, onAddClick, onViewClick, onEditClick, onDeleteConfirm }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  
  // Custom Delete Confirmation State
  const [deleteTarget, setDeleteTarget] = useState(null);

  // 1. Filter applications
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const matchQuery = 
        app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.position.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchStatus = statusFilter === 'All' || app.status === statusFilter;
      
      return matchQuery && matchStatus;
    });
  }, [applications, searchQuery, statusFilter]);

  // 2. Sort applications
  const sortedApps = useMemo(() => {
    return [...filteredApps].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.dateApplied) - new Date(a.dateApplied);
      }
      if (sortBy === 'oldest') {
        return new Date(a.dateApplied) - new Date(b.dateApplied);
      }
      if (sortBy === 'company') {
        return a.company.localeCompare(b.company);
      }
      return 0;
    });
  }, [filteredApps, sortBy]);

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
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDeleteClick = (app) => {
    setDeleteTarget(app);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      onDeleteConfirm(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div className="page-title-group">
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Applications</h1>
          <p className="page-subtitle">Track and manage your {applications.length} logged positions.</p>
        </div>
        <button className="btn btn-primary" onClick={onAddClick}>
          <Plus size={18} />
          <span>Add Application</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search company or position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingRight: searchQuery ? '2.5rem' : '0.875rem' }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="action-btn-circle"
              style={{
                position: 'absolute',
                right: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '24px',
                height: '24px',
                border: 'none',
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0
              }}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="filter-group">
          <label htmlFor="status-filter" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status:</label>
          <select
            id="status-filter"
            className="form-select filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Online Assessment">Online Assessment</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-select" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Sort By:</label>
          <select
            id="sort-select"
            className="form-select filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest Applied</option>
            <option value="oldest">Oldest Applied</option>
            <option value="company">Company Name</option>
          </select>
        </div>
      </div>

      {/* Main List Area */}
      {applications.length === 0 ? (
        <EmptyState
          icon={SlidersHorizontal}
          title="No applications registered"
          description="Log your job applications to track interviews, assessments, and follow up actions."
          actionText="Add Application"
          onActionClick={onAddClick}
        />
      ) : sortedApps.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No matching applications"
          description={`We couldn't find any results for "${searchQuery}" ${statusFilter !== 'All' ? `with status "${statusFilter}"` : ''}.`}
          actionText="Clear Filters"
          onActionClick={() => {
            setSearchQuery('');
            setStatusFilter('All');
          }}
        />
      ) : (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Position</th>
                <th>Location</th>
                <th>Date Applied</th>
                <th>Job Type</th>
                <th>Salary</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedApps.map((app) => (
                <tr key={app.id}>
                  <td data-label="Company" style={{ fontWeight: 600 }}>{app.company}</td>
                  <td data-label="Position">{app.position}</td>
                  <td data-label="Location">{app.location || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                  <td data-label="Date Applied">{formatDate(app.dateApplied)}</td>
                  <td data-label="Job Type">
                    <span className={`badge ${getJobTypeClass(app.jobType)}`}>
                      {app.jobType}
                    </span>
                  </td>
                  <td data-label="Salary">{app.salary || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                  <td data-label="Status">
                    <span className={`badge ${getStatusClass(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      onClick={() => onViewClick(app)}
                      className="action-btn-circle"
                      aria-label={`View details for ${app.position} at ${app.company}`}
                      data-tooltip="View Details"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => onEditClick(app)}
                      className="action-btn-circle"
                      aria-label={`Edit ${app.position} at ${app.company}`}
                      data-tooltip="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(app)}
                      className="action-btn-circle"
                      style={{ color: 'var(--status-rejected-text)' }}
                      aria-label={`Delete ${app.position} at ${app.company}`}
                      data-tooltip="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={handleDeleteCancel} role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
          <div className="modal-container" style={{ maxWidth: '450px' }} onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h2 id="delete-modal-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', fontSize: '1.125rem' }}>
                <AlertTriangle style={{ color: 'var(--status-rejected-text)' }} size={22} />
                Confirm Deletion
              </h2>
            </header>
            <div className="modal-body">
              <p style={{ fontSize: '0.9375rem', lineHeight: '1.5' }}>
                Are you sure you want to delete the application for <strong>{deleteTarget.position}</strong> at <strong>{deleteTarget.company}</strong>?
              </p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                This action is permanent and cannot be undone.
              </p>
            </div>
            <footer className="modal-footer">
              <button className="btn btn-secondary" onClick={handleDeleteCancel}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeleteConfirm}>
                Yes, Delete
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
