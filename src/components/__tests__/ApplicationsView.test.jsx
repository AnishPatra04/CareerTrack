import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ApplicationsView from '../ApplicationsView';

const MOCK_APPLICATIONS = [
  {
    id: '1',
    company: 'Google',
    position: 'Software Engineer',
    location: 'New York, NY',
    jobType: 'Full-time',
    status: 'Interview',
    dateApplied: '2026-08-01',
    salary: '150k'
  },
  {
    id: '2',
    company: 'Stripe',
    position: 'Frontend Engineer',
    location: 'San Francisco, CA',
    jobType: 'Contract',
    status: 'Offer',
    dateApplied: '2026-08-05',
    salary: '180k'
  }
];

describe('ApplicationsView', () => {
  it('renders empty state when no applications are provided', () => {
    const handleAddClick = vi.fn();
    render(
      <ApplicationsView
        applications={[]}
        onAddClick={handleAddClick}
        onViewClick={vi.fn()}
        onEditClick={vi.fn()}
        onDeleteConfirm={vi.fn()}
      />
    );
    expect(screen.getByText(/no applications registered/i)).toBeInTheDocument();
    
    const addBtn = screen.getAllByRole('button', { name: /add application/i })[0];
    fireEvent.click(addBtn);
    expect(handleAddClick).toHaveBeenCalledTimes(1);
  });

  it('renders application data table correctly', () => {
    render(
      <ApplicationsView
        applications={MOCK_APPLICATIONS}
        onAddClick={vi.fn()}
        onViewClick={vi.fn()}
        onEditClick={vi.fn()}
        onDeleteConfirm={vi.fn()}
      />
    );

    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('Stripe')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Frontend Engineer')).toBeInTheDocument();
  });

  it('filters applications based on search query', () => {
    render(
      <ApplicationsView
        applications={MOCK_APPLICATIONS}
        onAddClick={vi.fn()}
        onViewClick={vi.fn()}
        onEditClick={vi.fn()}
        onDeleteConfirm={vi.fn()}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search company or position/i);
    fireEvent.change(searchInput, { target: { value: 'Google' } });

    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.queryByText('Stripe')).not.toBeInTheDocument();
  });

  it('filters applications based on status filter', () => {
    render(
      <ApplicationsView
        applications={MOCK_APPLICATIONS}
        onAddClick={vi.fn()}
        onViewClick={vi.fn()}
        onEditClick={vi.fn()}
        onDeleteConfirm={vi.fn()}
      />
    );

    const statusFilter = screen.getByLabelText(/status:/i);
    fireEvent.change(statusFilter, { target: { value: 'Offer' } });

    expect(screen.getByText('Stripe')).toBeInTheDocument();
    expect(screen.queryByText('Google')).not.toBeInTheDocument();
  });

  it('triggers onViewClick, onEditClick, and onDeleteConfirm callbacks', () => {
    const handleView = vi.fn();
    const handleEdit = vi.fn();
    const handleDeleteConfirm = vi.fn();

    render(
      <ApplicationsView
        applications={MOCK_APPLICATIONS}
        onAddClick={vi.fn()}
        onViewClick={handleView}
        onEditClick={handleEdit}
        onDeleteConfirm={handleDeleteConfirm}
      />
    );

    const viewBtn = screen.getByLabelText(/view details for software engineer at google/i);
    fireEvent.click(viewBtn);
    expect(handleView).toHaveBeenCalledWith(MOCK_APPLICATIONS[0]);

    const editBtn = screen.getByLabelText(/edit software engineer at google/i);
    fireEvent.click(editBtn);
    expect(handleEdit).toHaveBeenCalledWith(MOCK_APPLICATIONS[0]);

    const deleteBtn = screen.getByLabelText(/delete software engineer at google/i);
    fireEvent.click(deleteBtn);

    expect(screen.getByText(/confirm deletion/i)).toBeInTheDocument();
    const confirmDeleteBtn = screen.getByRole('button', { name: /yes, delete/i });
    fireEvent.click(confirmDeleteBtn);
    expect(handleDeleteConfirm).toHaveBeenCalledWith('1');
  });
});
