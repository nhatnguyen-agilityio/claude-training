import type { Meta, StoryObj } from '@storybook/react-vite';
import Image from './index';

const meta: Meta<typeof Image> = {
  title: 'Common/Image',
  component: Image,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: 'Image source URL',
    },
    alt: {
      control: 'text',
      description: 'Alternative text for the image',
    },
    width: {
      control: 'text',
      description: 'Width of the image',
    },
    height: {
      control: 'text',
      description: 'Height of the image',
    },
    className: {
      control: 'text',
      description: 'CSS classes to apply to the image',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: 'https://ucarecdn.com/093e2ab7-3038-4752-9691-833462c4116b/-/format/auto/',
    alt: 'Default image',
  },
};

export const CustomDimensions: Story = {
  args: {
    src: 'https://ucarecdn.com/093e2ab7-3038-4752-9691-833462c4116b/-/format/auto/',
    alt: 'Custom dimensions image',
    width: '400',
    height: '300',
  },
};

export const ProductImage: Story = {
  args: {
    src: 'https://ucarecdn.com/093e2ab7-3038-4752-9691-833462c4116b/-/format/auto/',
    alt: 'Modern chair product',
    className: 'w-64 h-64 object-cover rounded-lg',
  },
};
