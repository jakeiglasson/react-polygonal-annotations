import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders upload image button', () => {
  render(<App />);
  const linkElement = screen.getByText(/upload image/i);
  expect(linkElement).toBeInTheDocument();
});
