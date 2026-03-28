import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HomePage } from '../pages/HomePage';

describe('HomePage chat flow', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('collects contact details before the final response', () => {
    render(<HomePage />);

    fireEvent.click(screen.getByRole('button', { name: /ont i ryggen/i }));
    act(() => {
      vi.runAllTimers();
    });

    expect(screen.getByText(/hur länge har du haft besvären/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /några veckor/i }));
    act(() => {
      vi.runAllTimers();
    });

    fireEvent.click(screen.getByRole('button', { name: /molande och konstant/i }));
    act(() => {
      vi.runAllTimers();
    });

    expect(screen.getByText(/sista steget/i)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Namn'), { target: { value: 'Anna Andersson' } });
    fireEvent.change(screen.getByPlaceholderText('Stad'), { target: { value: 'Stockholm' } });
    fireEvent.change(screen.getByPlaceholderText('Mejl'), { target: { value: 'anna@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Telefonnummer'), { target: { value: '+46701234567' } });
    fireEvent.submit(screen.getByRole('button', { name: /skicka kontaktuppgifter/i }).closest('form'));

    act(() => {
      vi.runAllTimers();
    });

    expect(screen.getByText(/kontaktuppgifter registrerade/i)).toBeInTheDocument();
    expect(screen.getByText('Stockholm')).toBeInTheDocument();
    expect(screen.getByText(/vi återkommer via e-post inom 24 timmar/i)).toBeInTheDocument();
  });
});
