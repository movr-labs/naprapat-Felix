import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
  document.head.querySelectorAll('[data-react-page-styles]').forEach(styleTag => styleTag.remove());
});
