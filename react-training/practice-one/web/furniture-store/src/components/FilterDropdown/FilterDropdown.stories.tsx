import type { Meta, StoryObj } from '@storybook/react-vite';
import FilterDropdown from '.';
import { useState } from 'react';

const meta: Meta<typeof FilterDropdown> = {
  title: 'Components/FilterDropdown',
  component: FilterDropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['mostRecent', 'lowToHigh', 'highToLow'],
      description: 'The current selected sort position',
    },
    setPosition: {
      action: 'setPosition',
      description: 'Function called when position changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    position: 'mostRecent',
    setPosition: () => {},
  },
};

export const PriceLowToHigh: Story = {
  args: {
    position: 'lowToHigh',
    setPosition: () => {},
  },
};

export const PriceHighToLow: Story = {
  args: {
    position: 'highToLow',
    setPosition: () => {},
  },
};

export const Interactive: Story = {
  render: () => {
    const [position, setPosition] = useState('mostRecent');

    return (
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Current selection: <strong>{position}</strong>
          </p>
        </div>
        <FilterDropdown
          position={position}
          setPosition={(value) => {
            console.log('Position changed to:', value);
            setPosition(value);
          }}
        />
      </div>
    );
  },
};
