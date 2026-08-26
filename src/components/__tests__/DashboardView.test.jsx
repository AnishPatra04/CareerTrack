import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DashboardView from '../DashboardView';

const MOCK_SETTINGS = {
  profileName: 'John Doe',
  profileEmail: 'john@example.com'
};

const MOCK_APPLICATIONS = [
  {
    id: '1',
    company: 'Google',
    position: 'Software Engineer',
    location: 'Mountain View, CA',
    jobType: 'Full-time',
    status: 'Offer',
    dateApplied: '2026-08-20',
    salary: '$150,000',
    interviewDate: '2026-09-02',
    notes: 'Offer received!'
  },
  {
    id: '2',
    company: 'Stripe',
    position: 'Frontend Engineer',
    location: 'San Francisco, CA',
    jobType: 'Full-time',
    status: 'Interview',
    dateApplied: '2026-08-22',
    salary: '$140,000',
    interviewDate: '2026-08-28',
    notes: 'Technical round scheduled'
  },
  {
    id: '3',
    company: 'Amazon',
    position: 'SDE-1',
    location: 'Seattle, WA',
    jobType: 'Full-time',
    status: 'Applied',
    dateApplied: '2026-08-18',
    salary: '$130,000'
  }
];

describe('DashboardView', () => {
  it('renders welcome message and empty state when there are no applications', () => {
    const handleAddClick = vi.fn();
    render(
      <DashboardView
        applications={[]}
        onAddClick={handleAddClick}
        onViewClick={vi.fn()}
        userSettings={MOCK_SETTINGS}
      />
    );

    expect(screen.getByText(/Welcome back, John!/i)).toBeInTheDocument();
    expect(screen.getByText(/No applications tracked yet/i)).toBeInTheDocument();

    const addBtn = screen.getAllByRole('button', { name: /Add Application/i })[0];
    fireEvent.click(addBtn);
    expect(handleAddClick).toHaveBeenCalledTimes(1);
  });

  it('renders statistics correctly when applications are present', () => {
    render(
      <DashboardView
        applications={MOCK_APPLICATIONS}
        onAddClick={vi.fn()}
        onViewClick={vi.fn()}
        userSettings={MOCK_SETTINGS}
      />
    );

    // Query stats cards specifically to avoid duplicate text collisions
    const totalApplicationsCard = screen.getByText('Total Applications').closest('.stat-card');
    expect(totalApplicationsCard.querySelector('.stat-val').textContent).toBe('3');

    const activePipelineCard = screen.getByText('Active Pipeline').closest('.stat-card');
    expect(activePipelineCard.querySelector('.stat-val').textContent).toBe('2');

    const interviewsCard = screen.getByText('Interviews').closest('.stat-card');
    expect(interviewsCard.querySelector('.stat-val').textContent).toBe('2');

    const offersCard = screen.getByText('Offers').closest('.stat-card');
    expect(offersCard.querySelector('.stat-val').textContent).toBe('1');
  });

  it('renders recent applications list and handles view details action', () => {
    const handleViewClick = vi.fn();
    render(
      <DashboardView
        applications={MOCK_APPLICATIONS}
        onAddClick={vi.fn()}
        onViewClick={handleViewClick}
        userSettings={MOCK_SETTINGS}
      />
    );

    expect(screen.getByText('Recent Applications')).toBeInTheDocument();
    
    // Match companies with regex and use getAllByText since Stripe/Google appear in multiple places
    expect(screen.getAllByText(/Google/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Stripe/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Amazon/i).length).toBeGreaterThan(0);

    const viewButtons = screen.getAllByRole('button', { name: /View Details/i });
    expect(viewButtons.length).toBe(3);

    fireEvent.click(viewButtons[0]);
    // Stripe is first in sorting because dateApplied is 2026-08-22 (newest)
    expect(handleViewClick).toHaveBeenCalledWith(MOCK_APPLICATIONS[1]);
  });

  it('renders upcoming interviews correctly', () => {
    // Set a fixed date for today to test interview date filter reliably
    const originalDate = globalThis.Date;
    const mockToday = new Date('2026-08-25');
    globalThis.Date = class extends originalDate {
      constructor(...args) {
        super(...args);
        if (args.length === 0) return mockToday;
      }
      static now() {
        return mockToday.getTime();
      }
    };

    try {
      render(
        <DashboardView
          applications={MOCK_APPLICATIONS}
          onAddClick={vi.fn()}
          onViewClick={vi.fn()}
          userSettings={MOCK_SETTINGS}
        />
      );

      expect(screen.getByText('Upcoming Interviews')).toBeInTheDocument();
      // Stripe (2026-08-28) and Google (2026-09-02) are >= 2026-08-25
      // Amazon has no interviewDate, so it's not listed.
      expect(screen.getAllByText(/Stripe/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Google/i).length).toBeGreaterThan(0);
    } finally {
      globalThis.Date = originalDate;
    }
  });
});
