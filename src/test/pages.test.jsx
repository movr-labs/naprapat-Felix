import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { KlinikerPage } from '../pages/KlinikerPage';
import { OmNaprapatPage } from '../pages/OmNaprapatPage';
import { SkadorPage } from '../pages/SkadorPage';

describe('Static React pages', () => {
  it('renders the clinics page content', () => {
    render(<KlinikerPage />);
    expect(screen.getByRole('heading', { name: /Naprapatkliniker i/i })).toBeInTheDocument();
  });

  it('renders the injuries page content', () => {
    render(<SkadorPage />);
    expect(screen.getByRole('heading', { name: /Skador & besvär/i })).toBeInTheDocument();
  });

  it('renders the about naprapat page content', () => {
    render(<OmNaprapatPage />);
    expect(screen.getByRole('heading', { name: /Vad är en naprapat/i })).toBeInTheDocument();
  });
});
