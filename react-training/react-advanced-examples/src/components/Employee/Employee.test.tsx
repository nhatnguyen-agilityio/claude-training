import { render, screen } from '@testing-library/react';
import Employee from '.';

test('renders Employee component', async () => {
  const mockUser = {
    name: 'John Doe',
    age: 30,
    address: '123 Main St',
  }

  // jest.spyOn(global, 'fetch').mockImplementation(() =>
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockUser),
    }) as unknown as Promise<Response>
  );

  await render(<Employee id="1" />);

  expect(screen.getByText('Loading...')).toBeInTheDocument();

  expect(await screen.findByText('John Doe')).toBeInTheDocument();
  expect(screen.getByText(30)).toBeInTheDocument();
  expect(screen.getByText('lives in 123 Main St')).toBeInTheDocument();
});
