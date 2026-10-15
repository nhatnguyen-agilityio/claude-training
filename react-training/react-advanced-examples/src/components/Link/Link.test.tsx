import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Link from '.';

beforeAll(() => {
  console.log('before all tests');
});

afterAll(() => {
  console.log('after all tests');
});

beforeEach(() => {
  console.log('before each test');
});

afterEach(() => {
  console.log('after each test');
});

test('changes class when hovered', () => {
  console.log("changes class when hovered test case");
  const { container } = render(
    <Link page="http://www.facebook.com">Facebook</Link>
  );

  const linkElement = screen.getByText('Facebook');

  // Initial snapshot
  expect(container.firstChild).toMatchSnapshot();

  // Simulate mouse enter
  fireEvent.mouseEnter(linkElement);
  expect(container.firstChild).toMatchSnapshot();

  // Simulate mouse leave
  fireEvent.mouseLeave(linkElement);
  expect(container.firstChild).toMatchSnapshot();
});

test('has href attribute', () => {
  console.log("has href attribute test case");

  render(<Link page="http://www.facebook.com">Facebook</Link>);

  const linkElement = screen.getByText('Facebook');
  expect(linkElement).toHaveAttribute('href', 'http://www.facebook.com');
});

describe('Link component', () => {
  beforeEach(() => {
    console.log("before each test in the describe block");
  });

  afterEach(() => {
    console.log("after each test in the describe block");
  });

  test('renders with correct text', () => {
    console.log("renders with correct text test case");
    render(<Link page="http://www.facebook.com">Facebook</Link>);
    const linkElement = screen.getByText('Facebook');
    expect(linkElement).toBeInTheDocument();
  });
});

test('renders correctly', () => {
  const { container } = render(<Link page="http://www.facebook.com">Facebook</Link>);
  expect(container).toMatchSnapshot();
});

test('test property matchers', () => {
  const user = {
    name: 'John Doe',
    createdAt: new Date(),
    id: Math.floor(Math.random() * 20),
    age: 30,
    email: 'HbOg9@example.com',
  };
  expect(user).toMatchSnapshot(
    {
      createdAt: expect.any(Date),
      id: expect.any(Number),
    }
  );
});
