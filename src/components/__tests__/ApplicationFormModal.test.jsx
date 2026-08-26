import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ApplicationFormModal from '../ApplicationFormModal';

describe('ApplicationFormModal', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <ApplicationFormModal isOpen={false} onClose={vi.fn()} onSave={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders form inputs when isOpen is true', () => {
    render(
      <ApplicationFormModal isOpen={true} onClose={vi.fn()} onSave={vi.fn()} />
    );
    expect(screen.getByLabelText(/Company Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Job Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
  });

  it('validates required fields on empty submit', () => {
    render(
      <ApplicationFormModal isOpen={true} onClose={vi.fn()} onSave={vi.fn()} />
    );

    const companyInput = screen.getByLabelText(/Company Name/i);
    const positionInput = screen.getByLabelText(/Job Title/i);
    
    fireEvent.change(companyInput, { target: { value: '' } });
    fireEvent.change(positionInput, { target: { value: '' } });

    const submitButton = screen.getByRole('button', { name: /add application/i });
    fireEvent.click(submitButton);

    expect(screen.getByText(/company name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/job title is required/i)).toBeInTheDocument();
  });

  it('triggers onSave when submitting valid data', () => {
    const handleSave = vi.fn();
    render(
      <ApplicationFormModal isOpen={true} onClose={vi.fn()} onSave={handleSave} />
    );

    fireEvent.change(screen.getByLabelText(/Company Name/i), { target: { value: 'Google' } });
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Software Engineer' } });
    fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'New York, NY' } });
    fireEvent.change(screen.getByLabelText(/Salary/i), { target: { value: '150,000' } });

    const submitButton = screen.getByRole('button', { name: /add application/i });
    fireEvent.click(submitButton);

    expect(handleSave).toHaveBeenCalledTimes(1);
    expect(handleSave).toHaveBeenCalledWith(expect.objectContaining({
      company: 'Google',
      position: 'Software Engineer',
      location: 'New York, NY',
      salary: '150,000'
    }));
  });

  it('validates invalid job URLs', () => {
    render(
      <ApplicationFormModal isOpen={true} onClose={vi.fn()} onSave={vi.fn()} />
    );

    fireEvent.change(screen.getByLabelText(/Company Name/i), { target: { value: 'Google' } });
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Software Engineer' } });
    fireEvent.change(screen.getByLabelText(/Job Posting URL/i), { target: { value: 'javascript:alert(1)' } });

    const submitButton = screen.getByRole('button', { name: /add application/i });
    fireEvent.click(submitButton);

    expect(screen.getByText(/please enter a valid url/i)).toBeInTheDocument();
  });
});
