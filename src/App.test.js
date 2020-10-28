import React from 'react';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});


test('renders App component', () => {
  render(<App />);
  // screen.debug();
});

test('After submit game should start', async () => {
  render(<App />);
  fireEvent.change(screen.getByRole('textbox'), {
  	target: { value: 'Sohan' },
  });

  await userEvent.click(screen.getByRole('button'));

  expect(screen.getByText(/Name: Sohan/)).toBeInTheDocument();
});

// test('Level Selection should be correct', async () => {

// 	render(<App />);

// 	fireEvent.change(screen.getByRole('textbox'), {
// 		target: { value: 'Sohan' },
//   });

//   fireEvent.change(screen.getByTestId("levels"), {
//   	target: { value: "HARD" },
//   });

//   await userEvent.click(screen.getByRole('button'));

//   expect(screen.getByText(/Level: HARD/)).toBeInTheDocument();
// })