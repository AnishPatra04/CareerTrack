import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AnalyticsView from '../AnalyticsView';

const MOCK_APPLICATIONS = [
  { id: '1', status: 'Offer', company: 'Google', position: 'SWE', dateApplied: '2026-08-01' },
  { id: '2', status: 'Interview', company: 'Stripe', position: 'FE', dateApplied: '2026-08-05' },
  { id: '3', status: 'Applied', company: 'Netflix', position: 'BE', dateApplied: '2026-08-10' }
];

describe('AnalyticsView', () => {
  it('renders empty state when no applications are provided', () => {
    render(<AnalyticsView applications={[]} />);
    expect(screen.getByText('No data to analyze')).toBeInTheDocument();
  });

  it('renders analysis cards and status ratios when applications are provided', () => {
    render(<AnalyticsView applications={MOCK_APPLICATIONS} />);
    // Total Applications count card
    expect(screen.getByText('3')).toBeInTheDocument();
    // Rates (1 out of 3 is 33%)
    expect(screen.getAllByText(/33%/i).length).toBeGreaterThan(0);
  });
});
