import type { Meta, StoryObj } from '@storybook/react-vite';
import CategoryItem from '.';
import { BrowserRouter } from 'react-router-dom';

const meta: Meta<typeof CategoryItem> = {
  title: 'Components/CategoryItem',
  component: CategoryItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  argTypes: {
    id: {
      control: 'number',
      description: 'The unique identifier of the category',
    },
    name: {
      control: 'text',
      description: 'The name of the category',
    },
    imageUrl: {
      control: 'text',
      description: 'The URL of the category image',
    },
    imageAlt: {
      control: 'text',
      description: 'The alternative text for the category image',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for the container',
    },
    imageClassName: {
      control: 'text',
      description: 'Additional CSS classes for the image container',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 1,
    name: 'Living Room',
    imageUrl:
      'https://ucarecdn.com/093e2ab7-3038-4752-9691-833462c4116b/-/format/auto/',
    imageAlt: 'Living Room Furniture',
    className: 'md:col-span-2 md:flex-row md:justify-between md:pl-10',
    imageClassName: 'md:w-auto md:h-full',
  },
  parameters: {
    layout: 'centered',
  },
};
