import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function ApplicationFormModal({ isOpen, onClose, onSave, applicationToEdit }) {
  const isEdit = !!applicationToEdit;
  
  const getLocalDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const initialFormState = {
    company: '',
    position: '',
    location: '',
    jobType: 'Full-time',
    status: 'Applied',
    dateApplied: getLocalDateString(),
    salary: '',
    interviewDate: '',
    jobUrl: '',
    notes: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit && applicationToEdit) {
      setFormData({
        company: applicationToEdit.company || '',
        position: applicationToEdit.position || '',
        location: applicationToEdit.location || '',
        jobType: applicationToEdit.jobType || 'Full-time',
        status: applicationToEdit.status || 'Applied',
        dateApplied: applicationToEdit.dateApplied || '',
        salary: applicationToEdit.salary || '',
        interviewDate: applicationToEdit.interviewDate || '',
        jobUrl: applicationToEdit.jobUrl || '',
        notes: applicationToEdit.notes || ''
      });
      setErrors({});
    } else {
      setFormData(initialFormState);
      setErrors({});
    }
  }, [isEdit, applicationToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for field on change
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // URL Validation helper
  const isValidUrl = (url) => {
    if (!url) return true;
    try {
      const tempUrl = url.startsWith('http://') || url.startsWith('https://') ? url : 'https://' + url;
      new URL(tempUrl);
      return true;
    } catch (_) {
      return false;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }
    
    if (!formData.position.trim()) {
      newErrors.position = 'Job title is required';
    }
    
    if (!formData.dateApplied) {
      newErrors.dateApplied = 'Application date is required';
    }
    
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }
    
    if (!formData.jobType) {
      newErrors.jobType = 'Job type is required';
    }
    
    if (formData.jobUrl && !isValidUrl(formData.jobUrl)) {
      newErrors.jobUrl = 'Please enter a valid URL (e.g. google.com or https://stripe.com)';
    }

    if (formData.interviewDate && formData.dateApplied && formData.interviewDate < formData.dateApplied) {
      newErrors.interviewDate = 'Interview date cannot be before application date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Standardize URL before saving
      let formattedUrl = formData.jobUrl.trim();
      if (formattedUrl && !formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = 'https://' + formattedUrl;
      }
      
      onSave({
        ...formData,
        jobUrl: formattedUrl
      });
    }
  };

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2 id="modal-title">{isEdit ? 'Edit Application' : 'Add Application'}</h2>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className="modal-body">
            {/* Row 1: Company and Job Title */}
            <div className="form-row">
              <div className="form-group" style={{ flex: 1, minWidth: '240px' }}>
                <label htmlFor="company" className="form-label">
                  Company Name <span className="required" aria-hidden="true">*</span>
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className={`form-input ${errors.company ? 'has-error' : ''}`}
                  placeholder="e.g. Stripe, Google"
                  maxLength={100}
                />
                {errors.company && <span className="form-error" role="alert">{errors.company}</span>}
              </div>

              <div className="form-group" style={{ flex: 1, minWidth: '240px' }}>
                <label htmlFor="position" className="form-label">
                  Job Title <span className="required" aria-hidden="true">*</span>
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className={`form-input ${errors.position ? 'has-error' : ''}`}
                  placeholder="e.g. Frontend Engineer"
                  maxLength={100}
                />
                {errors.position && <span className="form-error" role="alert">{errors.position}</span>}
              </div>
            </div>

            {/* Row 2: Location and Salary */}
            <div className="form-row">
              <div className="form-group" style={{ flex: 1, minWidth: '240px' }}>
                <label htmlFor="location" className="form-label">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Seattle, WA (Hybrid), Remote"
                  maxLength={100}
                />
              </div>

              <div className="form-group" style={{ flex: 1, minWidth: '240px' }}>
                <label htmlFor="salary" className="form-label">Salary / Compensation</label>
                <input
                  type="text"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. $120,000 / year or $50/hr"
                  maxLength={50}
                />
              </div>
            </div>

            {/* Row 3: Job Type and Status */}
            <div className="form-row">
              <div className="form-group" style={{ flex: 1, minWidth: '240px' }}>
                <label htmlFor="jobType" className="form-label">
                  Job Type <span className="required" aria-hidden="true">*</span>
                </label>
                <select
                  id="jobType"
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div className="form-group" style={{ flex: 1, minWidth: '240px' }}>
                <label htmlFor="status" className="form-label">
                  Status <span className="required" aria-hidden="true">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="Applied">Applied</option>
                  <option value="Online Assessment">Online Assessment</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Row 4: Applied Date and Interview Date */}
            <div className="form-row">
              <div className="form-group" style={{ flex: 1, minWidth: '240px' }}>
                <label htmlFor="dateApplied" className="form-label">
                  Date Applied <span className="required" aria-hidden="true">*</span>
                </label>
                <input
                  type="date"
                  id="dateApplied"
                  name="dateApplied"
                  value={formData.dateApplied}
                  onChange={handleChange}
                  className={`form-input ${errors.dateApplied ? 'has-error' : ''}`}
                />
                {errors.dateApplied && <span className="form-error" role="alert">{errors.dateApplied}</span>}
              </div>

              <div className="form-group" style={{ flex: 1, minWidth: '240px' }}>
                <label htmlFor="interviewDate" className="form-label">Interview Date (Optional)</label>
                <input
                  type="date"
                  id="interviewDate"
                  name="interviewDate"
                  value={formData.interviewDate}
                  onChange={handleChange}
                  className={`form-input ${errors.interviewDate ? 'has-error' : ''}`}
                />
                {errors.interviewDate && <span className="form-error" role="alert">{errors.interviewDate}</span>}
              </div>
            </div>

            {/* Row 5: Job Posting URL */}
            <div className="form-group">
              <label htmlFor="jobUrl" className="form-label">Job Posting URL</label>
              <input
                type="text"
                id="jobUrl"
                name="jobUrl"
                value={formData.jobUrl}
                onChange={handleChange}
                className={`form-input ${errors.jobUrl ? 'has-error' : ''}`}
                placeholder="e.g. www.stripe.com/jobs/role"
              />
              {errors.jobUrl && <span className="form-error" role="alert">{errors.jobUrl}</span>}
            </div>

            {/* Row 6: Notes */}
            <div className="form-group">
              <label htmlFor="notes" className="form-label">Notes & Details</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="form-textarea"
                placeholder="List interview rounds, referrals, preparation steps, or other details..."
                maxLength={1000}
              />
            </div>
          </div>

          <footer className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEdit ? 'Save Changes' : 'Add Application'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
