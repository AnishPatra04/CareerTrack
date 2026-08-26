import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Sidebar from '../Sidebar';

const MOCK_SETTINGS = {
  profileName: 'John Doe',
  profileEmail: 'john@example.com'
};

describe('Sidebar', () => {
  it('renders logo and profile settings correctly', () => {
    render(
      <Sidebar
        activeTab="dashboard"
        setActiveTab={vi.fn()}
        isOpen={true}
        setIsOpen={vi.fn()}
        userSettings={MOCK_SETTINGS}
      />
    );

    expect(screen.getByText('CareerTrack')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('JD')).toBeInTheDocument(); // Profile avatar initials
  });

  it('triggers setActiveTab callback when navigation item is clicked', () => {
    const handleActiveTab = vi.fn();
    render(
      <Sidebar
        activeTab="dashboard"
        setActiveTab={handleActiveTab}
        isOpen={true}
        setIsOpen={vi.fn()}
        userSettings={MOCK_SETTINGS}
      />
    );

    const applicationsNav = screen.getByRole('button', { name: /Applications/i });
    fireEvent.click(applicationsNav);

    expect(handleActiveTab).toHaveBeenCalledTimes(1);
    expect(handleActiveTab).toHaveBeenCalledWith('applications');
  });

  it('renders active class for current tab', () => {
    render(
      <Sidebar
        activeTab="interviews"
        setActiveTab={vi.fn()}
        isOpen={true}
        setIsOpen={vi.fn()}
        userSettings={MOCK_SETTINGS}
      />
    );

    const activeItem = screen.getByRole('button', { name: /Interviews/i });
    expect(activeItem.className).toContain('active');
  });
});
