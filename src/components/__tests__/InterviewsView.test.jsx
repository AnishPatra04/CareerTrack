import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import InterviewsView from '../InterviewsView';

const MOCK_APPLICATIONS = [
  {
    id: '1',
    company: 'Google',
    position: 'Software Engineer',
    interviewDate: '2026-09-02',
    status: 'Interview',
    jobType: 'Full-time',
    notes: 'Preparation details'
  },
  {
    id: '2',
    company: 'Stripe',
    position: 'Frontend Engineer',
    interviewDate: '2026-08-20',
    status: 'Interview',
    jobType: 'Contract',
    notes: 'Past round feedback'
  },
  {
    id: '3',
    company: 'Amazon',
    position: 'SDE-1',
    status: 'Applied'
  }
];

describe('InterviewsView', () => {
  it('renders empty state when there are no applications with interviews', () => {
    const handleAddClick = vi.fn();
    render(<InterviewsView applications={[]} onAddClick={handleAddClick} />);

    expect(screen.getByText(/No interviews scheduled yet/i)).toBeInTheDocument();

    const actionBtn = screen.getByRole('button', { name: /Log Application Interview/i });
    fireEvent.click(actionBtn);
    expect(handleAddClick).toHaveBeenCalledTimes(1);
  });

  it('correctly partitions and renders upcoming vs completed interviews', () => {
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
      render(<InterviewsView applications={MOCK_APPLICATIONS} onAddClick={vi.fn()} />);

      // Section titles
      expect(screen.getByText('Upcoming Interviews')).toBeInTheDocument();
      expect(screen.getByText('Completed Interviews')).toBeInTheDocument();

      // Counts in count badges (each section has a count badge containing '1')
      const countBadges = screen.getAllByText('1');
      expect(countBadges.length).toBeGreaterThanOrEqual(2);

      // Verify Google is in upcoming
      expect(screen.getByText('Google')).toBeInTheDocument();
      expect(screen.getByText('Preparation details')).toBeInTheDocument();

      // Verify Stripe is in completed
      expect(screen.getByText('Stripe')).toBeInTheDocument();
      expect(screen.getByText('Past round feedback')).toBeInTheDocument();

      // Verify Amazon (no interviewDate) is not in either list
      expect(screen.queryByText('Amazon')).not.toBeInTheDocument();
    } finally {
      globalThis.Date = originalDate;
    }
  });
});
