import type { Meta, StoryObj } from '@storybook/react-vite';
import SearchProduct from '.';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof SearchProduct> = {
  title: 'Components/SearchProduct',
  component: SearchProduct,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="w-full max-w-2xl">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithInitialSearch: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/?search=furniture']}>
        <div className="w-full max-w-2xl">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};
