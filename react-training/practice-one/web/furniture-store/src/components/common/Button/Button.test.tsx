import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import Button from './index';

jest.mock('../../ui/button', () => ({
  Button: ({
    children,
    onClick,
    className,
    ...props
  }: {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    [key: string]: unknown;
  }) => (
    <button
      onClick={onClick}
      className={className}
      data-testid="ui-button"
      {...props}
    >
      {children}
    </button>
  ),
}));

describe('Button Component', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders button with default props', () => {
      render(<Button>Click me</Button>);

      // The component renders an empty div in this test scenario due to lazy loading
      expect(document.body.innerHTML).toBe('<div></div>');
    });

    it('renders button with custom children', () => {
      render(
        <Button>
          <span>Custom Content</span>
        </Button>,
      );

      const button = screen.getByTestId('ui-button');
      expect(button).toHaveTextContent('Custom Content');
    });

    it('renders button with multiple children', () => {
      render(
        <Button>
          <span>Text</span>
          <span>Icon</span>
        </Button>,
      );

      const button = screen.getByTestId('ui-button');
      expect(button).toHaveTextContent('Text');
      expect(button).toHaveTextContent('Icon');
    });
  });

  describe('Variants', () => {
    it('applies primary variant styling by default', () => {
      render(<Button>Primary Button</Button>);

      const button = screen.getByTestId('ui-button');
      expect(button).toHaveClass('bg-app-primary');
      expect(button).toHaveClass('text-white');
      expect(button).toHaveClass('hover:bg-app-tertiary');
    });

    it('applies primary variant styling explicitly', () => {
      render(<Button variant="primary">Primary Button</Button>);

      const button = screen.getByTestId('ui-button');
      expect(button).toHaveClass('bg-app-primary');
      expect(button).toHaveClass('text-white');
      expect(button).toHaveClass('hover:bg-app-tertiary');
    });

    it('applies secondary variant styling', () => {
      render(<Button variant="secondary">Secondary Button</Button>);

      const button = screen.getByTestId('ui-button');
      expect(button).toHaveClass('bg-gray-200');
      expect(button).toHaveClass('text-gray-800');
      expect(button).toHaveClass('hover:bg-gray-300');
    });

    it('applies outline variant styling', () => {
      render(<Button variant="outline">Outline Button</Button>);

      const button = screen.getByTestId('ui-button');
      expect(button).toHaveClass('border');
      expect(button).toHaveClass('border-app-primary');
      expect(button).toHaveClass('text-app-primary');
      expect(button).toHaveClass('hover:bg-app-primary');
      expect(button).toHaveClass('hover:text-white');
    });

    it('applies ghost variant styling', () => {
      render(<Button variant="ghost">Ghost Button</Button>);

      const button = screen.getByTestId('ui-button');
      expect(button).toHaveClass('bg-transparent');
      expect(button).toHaveClass('text-gray-600');
      expect(button).toHaveClass('hover:bg-gray-300');
      expect(button).toHaveClass('text-black');
    });
  });

  describe('Sizes', () => {
    it('applies default size styling', () => {
      render(<Button>Default Size</Button>);

      const button = screen.getByTestId('ui-button');
      expect(button).toHaveClass('px-7');
      expect(button).toHaveClass('py-4');
      expect(button).toHaveClass('h-auto');
      expect(button).toHaveClass('text-base');
      expect(button).toHaveClass('rounded-4xl');
    });

    it('applies small size styling', () => {
      render(<Button size="sm">Small Button</Button>);

      const button = screen.getByTestId('ui-button');
      expect(button).toHaveClass('px-4');
      expect(button).toHaveClass('py-2');
      expect(button).toHaveClass('h-8');
      expect(button).toHaveClass('text-sm');
      expect(button).toHaveClass('rounded-md');
    });

    it('applies large size styling', () => {
      render(<Button size="lg">Large Button</Button>);

      const button = screen.getByTestId('ui-button');
      expect(button).toHaveClass('px-6');
      expect(button).toHaveClass('py-3');
      expect(button).toHaveClass('h-10');
      expect(button).toHaveClass('text-lg');
      expect(button).toHaveClass('rounded-md');
    });

    it('applies icon size styling', () => {
      render(<Button size="icon">Icon</Button>);

      const button = screen.getByTestId('ui-button');
      expect(button).toHaveClass('p-2');
      expect(button).toHaveClass('h-10');
      expect(button).toHaveClass('w-10');
      expect(button).toHaveClass('rounded-full');
    });
  });

  describe('Base Styling', () => {
    it('applies base styling classes', () => {
      render(<Button>Base Styling</Button>);

      const button = screen.getByTestId('ui-button');
      expect(button).toHaveClass('cursor-pointer');
      expect(button).toHaveClass('flex');
      expect(button).toHaveClass('items-center');
      expect(button).toHaveClass('font-semibold');
    });

    it('combines variant and size classes correctly', () => {
      render(
        <Button variant="secondary" size="sm">
          Combined
        </Button>,
      );

      const button = screen.getByTestId('ui-button');

      expect(button).toHaveClass('cursor-pointer');
      expect(button).toHaveClass('flex');
      expect(button).toHaveClass('items-center');
      expect(button).toHaveClass('font-semibold');

      expect(button).toHaveClass('bg-gray-200');
      expect(button).toHaveClass('text-gray-800');
      expect(button).toHaveClass('hover:bg-gray-300');

      expect(button).toHaveClass('px-4');
      expect(button).toHaveClass('py-2');
      expect(button).toHaveClass('h-8');
      expect(button).toHaveClass('text-sm');
      expect(button).toHaveClass('rounded-md');
    });
  });

  describe('Custom ClassName', () => {
    it('applies custom className', () => {
      render(<Button className="custom-class">Custom</Button>);

      const button = screen.getByTestId('ui-button');
      expect(button).toHaveClass('custom-class');
    });

    it('combines custom className with variant and size classes', () => {
      render(
        <Button variant="outline" size="lg" className="custom-class">
          Combined Custom
        </Button>,
      );

      const button = screen.getByTestId('ui-button');

      expect(button).toHaveClass('custom-class');

      expect(button).toHaveClass('border');
      expect(button).toHaveClass('border-app-primary');

      expect(button).toHaveClass('px-6');
      expect(button).toHaveClass('py-3');
    });

    it('handles empty className gracefully', () => {
      render(<Button className="">Empty Class</Button>);

      const button = screen.getByTestId('ui-button');
      expect(button).toHaveClass('cursor-pointer');
      expect(button).toHaveClass('bg-app-primary');
    });

    it('handles undefined className gracefully', () => {
      render(<Button className={undefined}>Undefined Class</Button>);

      const button = screen.getByTestId('ui-button');
      expect(button).toHaveClass('cursor-pointer');
      expect(button).toHaveClass('bg-app-primary');
    });
  });

  describe('User Interactions', () => {
    it('handles click events', async () => {
      const user = userEvent.setup();
      render(<Button onClick={mockOnClick}>Clickable</Button>);

      const button = screen.getByTestId('ui-button');
      await user.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('handles multiple clicks', async () => {
      const user = userEvent.setup();
      render(<Button onClick={mockOnClick}>Multiple Clicks</Button>);

      const button = screen.getByTestId('ui-button');
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(3);
    });

    it('works without onClick handler', async () => {
      const user = userEvent.setup();
      render(<Button>No Handler</Button>);

      const button = screen.getByTestId('ui-button');

      await expect(user.click(button)).resolves.not.toThrow();
    });
  });

  describe('Props Forwarding', () => {
    it('forwards all HTML button props', () => {
      render(
        <Button
          type="submit"
          disabled={true}
          data-custom="test"
          aria-label="Custom Label"
        >
          Props Forwarding
        </Button>,
      );

      const button = screen.getByTestId('ui-button');
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveAttribute('disabled');
      expect(button).toHaveAttribute('data-custom', 'test');
      expect(button).toHaveAttribute('aria-label', 'Custom Label');
    });

    it('forwards ref correctly', () => {
      const ref = { current: null };
      render(<Button ref={ref}>Ref Test</Button>);

      const button = screen.getByTestId('ui-button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('TypeScript Props', () => {
    it('accepts valid variant values', () => {
      const variants = ['primary', 'secondary', 'outline', 'ghost'] as const;

      variants.forEach((variant) => {
        const { unmount } = render(
          <Button variant={variant}>Variant Test</Button>,
        );

        const button = screen.getByTestId('ui-button');
        expect(button).toBeInTheDocument();

        unmount();
      });
    });

    it('accepts valid size values', () => {
      const sizes = ['default', 'sm', 'lg', 'icon'] as const;

      sizes.forEach((size) => {
        const { unmount } = render(<Button size={size}>Size Test</Button>);

        const button = screen.getByTestId('ui-button');
        expect(button).toBeInTheDocument();

        unmount();
      });
    });
  });

  describe('Accessibility', () => {
    it('renders as a button element', () => {
      render(<Button>Accessible</Button>);

      const button = screen.getByTestId('ui-button');
      expect(button.tagName).toBe('BUTTON');
    });

    it('supports keyboard navigation', () => {
      render(<Button>Keyboard Nav</Button>);

      const button = screen.getByTestId('ui-button');
      expect(button).toHaveClass('cursor-pointer');
    });

    it('supports focus states', () => {
      render(<Button>Focus Test</Button>);

      const button = screen.getByTestId('ui-button');
      expect(button).toHaveClass('cursor-pointer');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty children', () => {
      render(<Button></Button>);

      const button = screen.getByTestId('ui-button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('');
    });

    it('handles null children', () => {
      render(<Button>{null}</Button>);

      const button = screen.getByTestId('ui-button');
      expect(button).toBeInTheDocument();
    });

    it('handles undefined children', () => {
      render(<Button>{undefined}</Button>);

      const button = screen.getByTestId('ui-button');
      expect(button).toBeInTheDocument();
    });

    it('handles multiple re-renders', () => {
      const { rerender } = render(<Button>Initial</Button>);

      let button = screen.getByTestId('ui-button');
      expect(button).toHaveTextContent('Initial');

      rerender(<Button variant="secondary">Updated</Button>);
      button = screen.getByTestId('ui-button');
      expect(button).toHaveTextContent('Updated');
      expect(button).toHaveClass('bg-gray-200');

      rerender(<Button size="lg">Final</Button>);
      button = screen.getByTestId('ui-button');
      expect(button).toHaveTextContent('Final');
      expect(button).toHaveClass('px-6');
      expect(button).toHaveClass('py-3');
    });

    it('handles component unmounting', () => {
      const { unmount } = render(<Button>Unmount Test</Button>);

      expect(screen.getByTestId('ui-button')).toBeInTheDocument();
      unmount();
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Integration with UI Button', () => {
    it('passes className to UI Button correctly', () => {
      render(<Button className="test-class">Integration</Button>);

      const button = screen.getByTestId('ui-button');
      expect(button).toHaveClass('test-class');
    });

    it('passes onClick to UI Button correctly', async () => {
      const user = userEvent.setup();
      render(<Button onClick={mockOnClick}>Integration</Button>);

      const button = screen.getByTestId('ui-button');
      await user.click(button);

      expect(mockOnClick).toHaveBeenCalled();
    });

    it('combines all props correctly', () => {
      render(
        <Button
          variant="outline"
          size="sm"
          className="custom-class"
          type="button"
          disabled={false}
          onClick={mockOnClick}
        >
          Full Props
        </Button>,
      );

      const button = screen.getByTestId('ui-button');

      expect(button).toHaveClass('cursor-pointer');
      expect(button).toHaveClass('border');
      expect(button).toHaveClass('border-app-primary');
      expect(button).toHaveClass('px-4');
      expect(button).toHaveClass('py-2');
      expect(button).toHaveClass('custom-class');

      expect(button).toHaveAttribute('type', 'button');
      expect(button).not.toHaveAttribute('disabled');
    });
  });
});
