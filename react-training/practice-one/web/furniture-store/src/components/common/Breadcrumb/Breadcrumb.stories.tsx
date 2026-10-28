import type { Meta, StoryObj } from '@storybook/react-vite';
import BreadcrumbComponent from '.';
import { lazy } from 'react';

const Skeleton = lazy(() =>
  import('../../ui/skeleton').then((module) => ({ default: module.Skeleton })),
);

const meta: Meta<typeof BreadcrumbComponent> = {
  title: 'Common/Breadcrumb',
  component: BreadcrumbComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: 'object',
      description: 'Array of breadcrumb items',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Current Page', isCurrentPage: true },
    ],
  },
};

export const HomePage: Story = {
  args: {
    items: [{ label: 'Home', isCurrentPage: true }],
  },
};

export const CategoryPage: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Sitting Room', href: '/sitting-room', isCurrentPage: true },
    ],
  },
};

export const ProductDetailLoading: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Sitting Room', href: '/sitting-room' },
      { label: <Skeleton className="h-4 w-32" />, isCurrentPage: true },
    ],
  },
};

export const ProductDetailPage: Story = {
  args: {
    items: [
      { label: 'Homepage', href: '/' },
      { label: 'Sitting Room', href: '/' },
      { label: 'Luxe Armchair - Left Arm Chute', isCurrentPage: true },
    ],
  },
};
