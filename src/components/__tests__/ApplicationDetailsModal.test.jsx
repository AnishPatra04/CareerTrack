import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ApplicationDetailsModal from '../ApplicationDetailsModal';

const MOCK_APPLICATION = {
  id: '1',
  company: 'Stripe',
  position: 'Frontend Engineer',
  location: 'San Francisco, CA',
  jobType: 'Full-time',
  status: 'Interview',
  dateApplied: '2026-08-01',
  notes: 'First round technical'
};

const SUCCESS_PREP_DATA = {
  preparationSummary: 'Focus on React performance and components.',
  likelyQuestions: ['Explain React fiber architecture.', 'How to secure React routes?'],
  talkingPoints: ['Highlight optimization work.', 'Detail a11y improvements.'],
  preparationTips: ['Practice system design.', 'Review HTTP/2 caching.']
};

describe('ApplicationDetailsModal', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <ApplicationDetailsModal isOpen={false} onClose={vi.fn()} application={MOCK_APPLICATION} onUpdate={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders application details correctly when open', () => {
    render(
      <ApplicationDetailsModal isOpen={true} onClose={vi.fn()} application={MOCK_APPLICATION} onUpdate={vi.fn()} />
    );
    expect(screen.getByText('Stripe')).toBeInTheDocument();
    expect(screen.getByText('Frontend Engineer')).toBeInTheDocument();
    expect(screen.getByText('San Francisco, CA')).toBeInTheDocument();
  });

  it('switches to AI Interview Prep tab and displays idle state', () => {
    render(
      <ApplicationDetailsModal isOpen={true} onClose={vi.fn()} application={MOCK_APPLICATION} onUpdate={vi.fn()} />
    );

    const prepTabBtn = screen.getByRole('button', { name: /AI Interview Prep/i });
    fireEvent.click(prepTabBtn);

    expect(screen.getByText(/Generate AI Prep Notes/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generate Prep Plan/i })).toBeInTheDocument();
  });

  it('displays loading spinner and handles successful AI preparation generation', async () => {
    const handleUpdate = vi.fn();
    const fetchMock = vi.mocked(globalThis.fetch);
    
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => SUCCESS_PREP_DATA
    });

    render(
      <ApplicationDetailsModal isOpen={true} onClose={vi.fn()} application={MOCK_APPLICATION} onUpdate={handleUpdate} />
    );

    const prepTabBtn = screen.getByRole('button', { name: /AI Interview Prep/i });
    fireEvent.click(prepTabBtn);

    const generateBtn = screen.getByRole('button', { name: /Generate Prep Plan/i });
    fireEvent.click(generateBtn);

    expect(screen.getByText(/Analyzing Job Profile.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    expect(handleUpdate).toHaveBeenCalledTimes(1);
    expect(handleUpdate).toHaveBeenCalledWith(expect.objectContaining({
      ...MOCK_APPLICATION,
      aiPrep: SUCCESS_PREP_DATA
    }));
  });

  it('renders success prep layout when aiPrep details are present', () => {
    const appWithPrep = {
      ...MOCK_APPLICATION,
      aiPrep: SUCCESS_PREP_DATA
    };

    render(
      <ApplicationDetailsModal isOpen={true} onClose={vi.fn()} application={appWithPrep} onUpdate={vi.fn()} />
    );

    // Switch to AI tab
    const prepTabBtn = screen.getByRole('button', { name: /AI Interview Prep/i });
    fireEvent.click(prepTabBtn);

    expect(screen.getByText('Prep Strategy Summary')).toBeInTheDocument();
    expect(screen.getByText('Focus on React performance and components.')).toBeInTheDocument();
    expect(screen.getByText('Explain React fiber architecture.')).toBeInTheDocument();
    expect(screen.getByText('Highlight optimization work.')).toBeInTheDocument();
    expect(screen.getByText('Practice system design.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Regenerate Prep Plan/i })).toBeInTheDocument();
  });

  it('handles API failure by rendering the error details and supporting retry', async () => {
    const fetchMock = vi.mocked(globalThis.fetch);
    
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Rate limit exceeded on Google Gemini.' })
    });

    render(
      <ApplicationDetailsModal isOpen={true} onClose={vi.fn()} application={MOCK_APPLICATION} onUpdate={vi.fn()} />
    );

    const prepTabBtn = screen.getByRole('button', { name: /AI Interview Prep/i });
    fireEvent.click(prepTabBtn);

    const generateBtn = screen.getByRole('button', { name: /Generate Prep Plan/i });
    fireEvent.click(generateBtn);

    await waitFor(() => {
      expect(screen.getByText(/Preparation Failed/i)).toBeInTheDocument();
    });

    expect(screen.getByText('Rate limit exceeded on Google Gemini.')).toBeInTheDocument();
    
    // Test that the Retry button works and calls fetch again
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => SUCCESS_PREP_DATA
    });

    const retryBtn = screen.getByRole('button', { name: /Try Again/i });
    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });
});
