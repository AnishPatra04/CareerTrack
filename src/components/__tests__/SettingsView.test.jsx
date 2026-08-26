import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import SettingsView from '../SettingsView';

const MOCK_SETTINGS = {
  profileName: 'John Doe',
  profileEmail: 'john@example.com',
  theme: 'light',
  compactMode: false,
  interviewReminders: true,
  applicationUpdates: true
};

describe('SettingsView', () => {
  beforeEach(() => {
    // Clear attribute and body class before each test
    document.documentElement.removeAttribute('data-theme');
    document.body.classList.remove('compact-mode');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes input fields with userSettings prop values', () => {
    render(
      <SettingsView
        userSettings={MOCK_SETTINGS}
        onSaveSettings={vi.fn()}
        triggerToast={vi.fn()}
      />
    );

    expect(screen.getByLabelText(/Full Name/i).value).toBe('John Doe');
    expect(screen.getByLabelText(/Email Address/i).value).toBe('john@example.com');
    
    // For theme, we check if the light theme button is active
    const lightThemeBtn = screen.getByRole('button', { name: /Light Theme/i });
    expect(lightThemeBtn.className).toContain('active');
    
    expect(screen.getByLabelText(/Compact Mode/i).checked).toBe(false);
    expect(screen.getByLabelText(/Interview Reminders/i).checked).toBe(true);
    expect(screen.getByLabelText(/Application Progress Updates/i).checked).toBe(true);
  });

  it('triggers toast error validation when profileName is empty', () => {
    const triggerToast = vi.fn();
    render(
      <SettingsView
        userSettings={MOCK_SETTINGS}
        onSaveSettings={vi.fn()}
        triggerToast={triggerToast}
      />
    );

    const nameInput = screen.getByLabelText(/Full Name/i);
    fireEvent.change(nameInput, { target: { value: '' } });

    const form = nameInput.closest('form');
    fireEvent.submit(form);

    expect(triggerToast).toHaveBeenCalledWith('error', 'Profile Error', 'Profile Name cannot be empty.');
  });

  it('triggers toast error validation when email is invalid', () => {
    const triggerToast = vi.fn();
    render(
      <SettingsView
        userSettings={MOCK_SETTINGS}
        onSaveSettings={vi.fn()}
        triggerToast={triggerToast}
      />
    );

    const emailInput = screen.getByLabelText(/Email Address/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const form = emailInput.closest('form');
    fireEvent.submit(form);

    expect(triggerToast).toHaveBeenCalledWith('error', 'Profile Error', 'Please enter a valid email address.');
  });

  it('triggers onSaveSettings and success toast when valid inputs are submitted', () => {
    const handleSave = vi.fn();
    const triggerToast = vi.fn();
    render(
      <SettingsView
        userSettings={MOCK_SETTINGS}
        onSaveSettings={handleSave}
        triggerToast={triggerToast}
      />
    );

    const nameInput = screen.getByLabelText(/Full Name/i);
    fireEvent.change(nameInput, { target: { value: 'Alex' } });

    const form = nameInput.closest('form');
    fireEvent.submit(form);

    expect(handleSave).toHaveBeenCalledTimes(1);
    expect(handleSave).toHaveBeenCalledWith({
      profileName: 'Alex',
      profileEmail: 'john@example.com',
      theme: 'light',
      compactMode: false,
      interviewReminders: true,
      applicationUpdates: true
    });
    expect(triggerToast).toHaveBeenCalledWith('success', 'Settings Saved', 'Your configuration has been updated successfully!');
  });

  it('applies theme and compact mode to document and body instantly', () => {
    render(
      <SettingsView
        userSettings={MOCK_SETTINGS}
        onSaveSettings={vi.fn()}
        triggerToast={vi.fn()}
      />
    );

    const darkThemeBtn = screen.getByRole('button', { name: /Dark Theme/i });
    fireEvent.click(darkThemeBtn);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    const compactCheckbox = screen.getByLabelText(/Compact Mode/i);
    fireEvent.click(compactCheckbox);
    expect(document.body.classList.contains('compact-mode')).toBe(true);
  });
});
