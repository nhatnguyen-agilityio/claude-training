import type { Meta, StoryObj } from '@storybook/react-vite';
import ShowMore from '.';

const meta: Meta<typeof ShowMore> = {
  title: 'Common/ShowMore',
  component: ShowMore,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: {
      action: 'clicked',
      description: 'Function called when button is clicked',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
  },
  args: {
    onClick: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Interactive: Story = {
  args: {
    disabled: false,
    onClick: () => {
      console.log('Show More clicked!');
      alert('Show More button clicked!');
    },
  },
};
