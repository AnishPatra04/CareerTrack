import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function EmptyState({ icon: Icon = HelpCircle, title, description, actionText, onActionClick }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" aria-hidden="true">
        <Icon size={32} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {actionText && onActionClick && (
        <button className="btn btn-primary" onClick={onActionClick}>
          {actionText}
        </button>
      )}
    </div>
  );
}
