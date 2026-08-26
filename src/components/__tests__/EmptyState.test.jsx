import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EmptyState from '../EmptyState';
import { Sparkles } from 'lucide-react';

describe('EmptyState', () => {
  it('renders title and description correctly', () => {
    render(
      <EmptyState
        title="No entries"
        description="Add some items to get started."
      />
    );

    expect(screen.getByText('No entries')).toBeInTheDocument();
    expect(screen.getByText('Add some items to get started.')).toBeInTheDocument();
  });

  it('renders action button and triggers callback on click', () => {
    const handleAction = vi.fn();
    render(
      <EmptyState
        title="No entries"
        description="Add some items to get started."
        actionText="Create Item"
        onActionClick={handleAction}
      />
    );

    const actionBtn = screen.getByRole('button', { name: /Create Item/i });
    expect(actionBtn).toBeInTheDocument();

    fireEvent.click(actionBtn);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('renders custom icon if provided', () => {
    const { container } = render(
      <EmptyState
        icon={Sparkles}
        title="No entries"
        description="Add some items to get started."
      />
    );

    // Verify SVG icon exists
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
