//import React from 'react';
import { render, screen } from '@testing-library/react';

test('trivial', () => {
  render(<div>Hello world</div>);
  const element = screen.getByText('Hello world');
  expect(element).toBeInTheDocument();
});

export {};
