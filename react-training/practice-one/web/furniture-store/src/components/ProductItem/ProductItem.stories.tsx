import type { Meta, StoryObj } from '@storybook/react-vite';
import ProductItem from '.';
import { AuthProvider } from '../../auth/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

const meta: Meta<typeof ProductItem> = {
  title: 'Components/ProductItem',
  component: ProductItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: false,
          },
        },
      });

      return (
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <Story />
            </AuthProvider>
          </QueryClientProvider>
        </BrowserRouter>
      );
    },
  ],
  argTypes: {
    id: {
      control: 'number',
      description: 'The unique identifier of the product',
    },
    variantId: {
      control: 'number',
      description: 'The identifier of the product variant',
    },
    name: {
      control: 'text',
      description: 'The name of the product',
    },
    price: {
      control: 'number',
      description: 'The price of the product in dollars',
    },
    imageUrl: {
      control: 'text',
      description: 'The URL of the product image',
    },
    imageAlt: {
      control: 'text',
      description: 'The alternative text for the product image',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 1,
    variantId: 1,
    name: 'Modern Dining Chair',
    price: 299,
    imageUrl:
      'https://ucarecdn.com/093e2ab7-3038-4752-9691-833462c4116b/-/format/auto/',
    imageAlt: 'Modern Dining Chair',
  },
};

export const LongProductName: Story = {
  args: {
    id: 4,
    variantId: 4,
    name: 'Premium Handcrafted Oak Wood Dining Table with Extendable Leaf',
    price: 899,
    imageUrl:
      'https://ucarecdn.com/093e2ab7-3038-4752-9691-833462c4116b/-/format/auto/',
    imageAlt: 'Premium Handcrafted Oak Wood Dining Table',
  },
};

export const ProductGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
      <ProductItem
        id={1}
        variantId={1}
        name="Modern Chair"
        price={299}
        imageUrl="https://ucarecdn.com/093e2ab7-3038-4752-9691-833462c4116b/-/format/auto/"
        imageAlt="Modern Chair"
        variantColor="red"
      />
      <ProductItem
        id={2}
        variantId={2}
        name="Luxury Sofa"
        price={1299}
        imageUrl="https://ucarecdn.com/093e2ab7-3038-4752-9691-833462c4116b/-/format/auto/"
        imageAlt="Luxury Sofa"
        variantColor="blue"
      />
      <ProductItem
        id={3}
        variantId={3}
        name="Coffee Table"
        price={89}
        imageUrl="https://ucarecdn.com/093e2ab7-3038-4752-9691-833462c4116b/-/format/auto/"
        imageAlt="Coffee Table"
        variantColor="green"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Example showing multiple ProductItem components in a grid layout.',
      },
    },
  },
};
