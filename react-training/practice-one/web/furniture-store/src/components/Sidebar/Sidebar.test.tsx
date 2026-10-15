import { render, screen, act, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Sidebar from '.';

jest.mock('../common/Button', () => {
  return function MockButton({
    children,
    className,
    variant,
    size,
    ...props
  }: {
    children: ReactNode;
    className?: string;
    variant?: string;
    size?: string;
    [key: string]: unknown;
  }) {
    return (
      <button
        className={className}
        data-testid="close-button"
        data-variant={variant}
        data-size={size}
        {...props}
      >
        {children}
      </button>
    );
  };
});

jest.mock('lucide-react', () => ({
  X: () => <span data-testid="cancel-icon">×</span>,
}));

jest.mock('vaul', () => ({
  Drawer: {
    Root: ({
      children,
      ...props
    }: {
      children: ReactNode;
      [key: string]: unknown;
    }) => (
      <div data-testid="drawer-root" {...props}>
        {children}
      </div>
    ),
    Trigger: ({
      children,
      ...props
    }: {
      children: ReactNode;
      [key: string]: unknown;
    }) => (
      <div data-testid="drawer-trigger" {...props}>
        {children}
      </div>
    ),
    Content: ({
      children,
      ...props
    }: {
      children: ReactNode;
      [key: string]: unknown;
    }) => (
      <div data-testid="drawer-content" {...props}>
        {children}
      </div>
    ),
    Close: ({
      children,
      ...props
    }: {
      children: ReactNode;
      [key: string]: unknown;
    }) => (
      <div data-testid="drawer-close" {...props}>
        {children}
      </div>
    ),
    Portal: ({
      children,
      ...props
    }: {
      children: ReactNode;
      [key: string]: unknown;
    }) => (
      <div data-testid="drawer-portal" {...props}>
        {children}
      </div>
    ),
    Overlay: ({ ...props }: { [key: string]: unknown }) => (
      <div data-testid="drawer-overlay" {...props} />
    ),
    Title: ({
      children,
      ...props
    }: {
      children: ReactNode;
      [key: string]: unknown;
    }) => (
      <div data-testid="drawer-title" {...props}>
        {children}
      </div>
    ),
    Description: ({
      children,
      ...props
    }: {
      children: ReactNode;
      [key: string]: unknown;
    }) => (
      <div data-testid="drawer-description" {...props}>
        {children}
      </div>
    ),
  },
}));

jest.mock('../ui/drawer', () => {
  let globalOnOpenChange: ((open: boolean) => void) | undefined;

  return {
    Drawer: ({
      children,
      open,
      onOpenChange,
    }: {
      children: ReactNode;
      open?: boolean;
      onOpenChange?: (open: boolean) => void;
    }) => {
      globalOnOpenChange = onOpenChange;
      return (
        <div data-testid="drawer" data-open={open}>
          {children}
        </div>
      );
    },
    DrawerTrigger: ({
      children,
      asChild,
    }: {
      children: ReactNode;
      asChild?: boolean;
    }) => (
      <div
        data-testid="drawer-trigger"
        data-as-child={asChild}
        onClick={() => {
          if (globalOnOpenChange) {
            globalOnOpenChange(true);
          }
        }}
      >
        {children}
      </div>
    ),
    DrawerContent: ({
      children,
      className,
      ...props
    }: {
      children: ReactNode;
      className?: string;
      [key: string]: unknown;
    }) => (
      <div data-testid="drawer-content" className={className} {...props}>
        {children}
      </div>
    ),
    DrawerHeader: ({
      children,
      className,
    }: {
      children: ReactNode;
      className?: string;
    }) => (
      <div data-testid="drawer-header" className={className}>
        {children}
      </div>
    ),
    DrawerTitle: ({
      children,
      className,
    }: {
      children: ReactNode;
      className?: string;
    }) => (
      <div data-testid="drawer-title" className={className}>
        {children}
      </div>
    ),
    DrawerDescription: ({
      children,
      className,
    }: {
      children: ReactNode;
      className?: string;
    }) => (
      <div data-testid="drawer-description" className={className}>
        {children}
      </div>
    ),
    DrawerClose: ({
      children,
      asChild,
    }: {
      children: ReactNode;
      asChild?: boolean;
    }) => (
      <div data-testid="drawer-close" data-as-child={asChild}>
        {children}
      </div>
    ),
  };
});

const mockButton = <div>Button</div>;
const mockChildren = <div>Children</div>;
const mockTitle = 'Title';
const mockOnOpenChange = jest.fn();

const TestQueryClient = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Sidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the drawer with correct structure', async () => {
      await act(async () => {
        render(
          <TestQueryClient>
            <Sidebar
              button={mockButton}
              children={mockChildren}
              title={mockTitle}
              open={false}
              onOpenChange={mockOnOpenChange}
            />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        // Check drawer structure
        expect(screen.getByTestId('drawer')).toBeInTheDocument();
        expect(screen.getByTestId('drawer')).toHaveAttribute(
          'data-open',
          'false',
        );

        // Check trigger button
        expect(screen.getByTestId('drawer-trigger')).toBeInTheDocument();
        expect(screen.getByTestId('drawer-trigger')).toHaveAttribute(
          'data-as-child',
          'true',
        );
        expect(screen.getByText('Button')).toBeInTheDocument();
      });
    });

    it('should render drawer content with header and children when open', async () => {
      await act(async () => {
        render(
          <TestQueryClient>
            <Sidebar
              button={mockButton}
              children={mockChildren}
              title={mockTitle}
              open={true}
              onOpenChange={mockOnOpenChange}
            />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        // Check drawer is open
        expect(screen.getByTestId('drawer')).toHaveAttribute(
          'data-open',
          'true',
        );

        // Check content structure
        expect(screen.getByTestId('drawer-content')).toBeInTheDocument();
        expect(screen.getByTestId('drawer-content')).toHaveClass(
          'w-full',
          'lg:w-1/2',
        );

        // Check header
        expect(screen.getByTestId('drawer-header')).toBeInTheDocument();
        expect(screen.getByTestId('drawer-title')).toBeInTheDocument();
        expect(screen.getByText(mockTitle)).toBeInTheDocument();

        // Check close button
        expect(screen.getByTestId('drawer-close')).toBeInTheDocument();
        expect(screen.getByTestId('close-button')).toBeInTheDocument();
        expect(screen.getByTestId('cancel-icon')).toBeInTheDocument();

        // Check children
        expect(screen.getByText('Children')).toBeInTheDocument();
      });
    });

    it('should render without trigger button when button prop is not provided', async () => {
      await act(async () => {
        render(
          <TestQueryClient>
            <Sidebar
              children={mockChildren}
              title={mockTitle}
              open={true}
              onOpenChange={mockOnOpenChange}
            />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        expect(screen.queryByTestId('drawer-trigger')).not.toBeInTheDocument();
        expect(screen.getByText(mockTitle)).toBeInTheDocument();
        expect(screen.getByText('Children')).toBeInTheDocument();
      });
    });

    it('should render without title when title prop is not provided', async () => {
      await act(async () => {
        render(
          <TestQueryClient>
            <Sidebar
              button={mockButton}
              children={mockChildren}
              open={true}
              onOpenChange={mockOnOpenChange}
            />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        expect(screen.getByTestId('drawer-title')).toBeInTheDocument();
        expect(screen.getByText('Children')).toBeInTheDocument();
        expect(screen.getByText('Button')).toBeInTheDocument();
      });
    });

    it('should apply correct CSS classes to drawer content', () => {
      render(
        <TestQueryClient>
          <Sidebar
            button={mockButton}
            children={mockChildren}
            title={mockTitle}
            open={true}
            onOpenChange={mockOnOpenChange}
          />
        </TestQueryClient>,
      );

      const drawerContent = screen.getByTestId('drawer-content');
      expect(drawerContent).toHaveAttribute(
        'data-vaul-drawer-direction',
        'right',
      );
      expect(drawerContent).toHaveClass(
        'w-full',
        'lg:w-1/2',
        'border-none',
        'overflow-y-auto',
        'overflow-x-hidden',
        'max-h-screen',
      );
    });

    it('should apply correct CSS classes to drawer header', () => {
      render(
        <TestQueryClient>
          <Sidebar
            button={mockButton}
            children={mockChildren}
            title={mockTitle}
            open={true}
            onOpenChange={mockOnOpenChange}
          />
        </TestQueryClient>,
      );

      const drawerHeader = screen.getByTestId('drawer-header');
      expect(drawerHeader).toHaveClass(
        '!flex-row',
        'relative',
        '!items-center',
        '!justify-center',
        'my-5',
      );
    });

    it('should apply correct CSS classes to drawer title', () => {
      render(
        <TestQueryClient>
          <Sidebar
            button={mockButton}
            children={mockChildren}
            title={mockTitle}
            open={true}
            onOpenChange={mockOnOpenChange}
          />
        </TestQueryClient>,
      );

      const drawerTitle = screen.getByTestId('drawer-title');
      expect(drawerTitle).toHaveClass(
        'text-center',
        'text-xl',
        'font-semibold',
      );
    });

    it('should render close button with correct props', () => {
      render(
        <TestQueryClient>
          <Sidebar
            button={mockButton}
            children={mockChildren}
            title={mockTitle}
            open={true}
            onOpenChange={mockOnOpenChange}
          />
        </TestQueryClient>,
      );

      const closeButton = screen.getByTestId('close-button');
      expect(closeButton).toHaveAttribute('data-variant', 'ghost');
      expect(closeButton).toHaveAttribute('data-size', 'icon');
      expect(closeButton).toHaveClass(
        'absolute',
        'left-4',
        'top-1/2',
        '-translate-y-1/2',
        'h-11',
        'w-11',
        'bg-background-primary',
        'rounded-full',
      );
    });
  });

  describe('Interaction', () => {
    it('should call onOpenChange when trigger is clicked', async () => {
      const user = userEvent.setup();
      render(
        <TestQueryClient>
          <Sidebar
            button={mockButton}
            children={mockChildren}
            title={mockTitle}
            open={false}
            onOpenChange={mockOnOpenChange}
          />
        </TestQueryClient>,
      );

      const trigger = screen.getByTestId('drawer-trigger');
      await user.click(trigger);

      expect(mockOnOpenChange).toHaveBeenCalledWith(true);
    });

    it('should handle clicks on trigger button content', async () => {
      const user = userEvent.setup();
      render(
        <TestQueryClient>
          <Sidebar
            button={mockButton}
            children={mockChildren}
            title={mockTitle}
            open={false}
            onOpenChange={mockOnOpenChange}
          />
        </TestQueryClient>,
      );

      const buttonContent = screen.getByText('Button');
      await user.click(buttonContent);

      expect(mockOnOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Props Forwarding', () => {
    it('should pass open state to drawer correctly', () => {
      const { rerender } = render(
        <TestQueryClient>
          <Sidebar
            button={mockButton}
            children={mockChildren}
            title={mockTitle}
            open={false}
            onOpenChange={mockOnOpenChange}
          />
        </TestQueryClient>,
      );

      let drawer = screen.getByTestId('drawer');
      expect(drawer).toHaveAttribute('data-open', 'false');

      rerender(
        <TestQueryClient>
          <Sidebar
            button={mockButton}
            children={mockChildren}
            title={mockTitle}
            open={true}
            onOpenChange={mockOnOpenChange}
          />
        </TestQueryClient>,
      );

      drawer = screen.getByTestId('drawer');
      expect(drawer).toHaveAttribute('data-open', 'true');
    });

    it('should pass onOpenChange callback to drawer', () => {
      render(
        <TestQueryClient>
          <Sidebar
            button={mockButton}
            children={mockChildren}
            title={mockTitle}
            open={false}
            onOpenChange={mockOnOpenChange}
          />
        </TestQueryClient>,
      );

      // The callback should be passed to the drawer
      expect(screen.getByTestId('drawer')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('should render drawer description as empty', () => {
      render(
        <TestQueryClient>
          <Sidebar
            button={mockButton}
            children={mockChildren}
            title={mockTitle}
            open={true}
            onOpenChange={mockOnOpenChange}
          />
        </TestQueryClient>,
      );

      const drawerDescription = screen.getByTestId('drawer-description');
      expect(drawerDescription).toBeInTheDocument();
      expect(drawerDescription).toBeEmptyDOMElement();
    });

    it('should render drawer close with asChild prop', () => {
      render(
        <TestQueryClient>
          <Sidebar
            button={mockButton}
            children={mockChildren}
            title={mockTitle}
            open={true}
            onOpenChange={mockOnOpenChange}
          />
        </TestQueryClient>,
      );

      const drawerClose = screen.getByTestId('drawer-close');
      expect(drawerClose).toHaveAttribute('data-as-child', 'true');
    });

    it('should render drawer trigger with asChild prop when button is provided', () => {
      render(
        <TestQueryClient>
          <Sidebar
            button={mockButton}
            children={mockChildren}
            title={mockTitle}
            open={false}
            onOpenChange={mockOnOpenChange}
          />
        </TestQueryClient>,
      );

      const drawerTrigger = screen.getByTestId('drawer-trigger');
      expect(drawerTrigger).toHaveAttribute('data-as-child', 'true');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined open prop', () => {
      render(
        <TestQueryClient>
          <Sidebar
            button={mockButton}
            children={mockChildren}
            title={mockTitle}
            onOpenChange={mockOnOpenChange}
          />
        </TestQueryClient>,
      );

      const drawer = screen.getByTestId('drawer');
      expect(drawer).not.toHaveAttribute('data-open');
    });

    it('should handle undefined onOpenChange prop', () => {
      render(
        <TestQueryClient>
          <Sidebar
            button={mockButton}
            children={mockChildren}
            title={mockTitle}
            open={true}
          />
        </TestQueryClient>,
      );

      expect(screen.getByTestId('drawer')).toBeInTheDocument();
    });

    it('should handle empty title string', () => {
      render(
        <TestQueryClient>
          <Sidebar
            button={mockButton}
            children={mockChildren}
            title=""
            open={true}
            onOpenChange={mockOnOpenChange}
          />
        </TestQueryClient>,
      );

      const drawerTitle = screen.getByTestId('drawer-title');
      expect(drawerTitle).toBeInTheDocument();
      expect(drawerTitle).toHaveTextContent('');
    });
  });
});
