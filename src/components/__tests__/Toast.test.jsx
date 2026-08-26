import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Toast from '../Toast';

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders list of toasts correctly', () => {
    const mockToasts = [
      { id: '1', type: 'success', title: 'Success Toast', message: 'Operation succeeded' },
      { id: '2', type: 'error', message: 'Something failed' }
    ];

    render(<Toast toasts={mockToasts} setToasts={vi.fn()} />);

    expect(screen.getByText('Success Toast')).toBeInTheDocument();
    expect(screen.getByText('Operation succeeded')).toBeInTheDocument();
    expect(screen.getByText('Something failed')).toBeInTheDocument();
  });

  it('triggers setToasts when close button is clicked', () => {
    const handleSetToasts = vi.fn();
    const mockToasts = [
      { id: '1', type: 'info', message: 'Info message' }
    ];

    render(<Toast toasts={mockToasts} setToasts={handleSetToasts} />);

    const closeBtn = screen.getByRole('button', { name: /Close Notification/i });
    fireEvent.click(closeBtn);

    expect(handleSetToasts).toHaveBeenCalledTimes(1);
  });

  it('auto-closes toast after specified duration', () => {
    const handleSetToasts = vi.fn();
    const mockToasts = [
      { id: '1', type: 'success', message: 'Will close soon', duration: 1000 }
    ];

    render(<Toast toasts={mockToasts} setToasts={handleSetToasts} />);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(handleSetToasts).toHaveBeenCalledTimes(1);
  });
});
