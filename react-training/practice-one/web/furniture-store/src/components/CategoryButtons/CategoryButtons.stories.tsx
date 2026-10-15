import type { Meta, StoryObj } from '@storybook/react-vite';
import CategoryButtons from '.';
import { useState } from 'react';

const meta: Meta<typeof CategoryButtons> = {
  title: 'Components/CategoryButtons',
  component: CategoryButtons,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    buttonList: {
      control: 'object',
      description: 'The list of buttons to display',
    },
    selectedCategory: {
      control: 'text',
      description: 'The selected category',
    },
    onCategorySelect: {
      action: 'onCategorySelect',
      description: 'The function to call when a category is selected',
    },
  },
  args: {
    buttonList: [
      'All',
      'Bedroom',
      'Living Room',
      'Kitchen',
      'Workspace',
      'Outdoor',
      'Bathroom',
      'Home office',
      'Dinning room',
    ],
    selectedCategory: 'All',
    onCategorySelect: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    buttonList: [
      'All',
      'Bedroom',
      'Living Room',
      'Kitchen',
      'Workspace',
      'Outdoor',
      'Bathroom',
      'Home office',
      'Dinning room',
    ],
    selectedCategory: 'All',
    onCategorySelect: () => {},
  },
};

export const BedroomChecked: Story = {
  args: {
    buttonList: [
      'All',
      'Bedroom',
      'Living Room',
      'Kitchen',
      'Workspace',
      'Outdoor',
      'Bathroom',
      'Home office',
      'Dinning room',
    ],
    selectedCategory: 'Bedroom',
    onCategorySelect: () => {},
  },
};

export const Interactive: Story = {
  render: () => {
    const [selectedCategory, setSelectedCategory] = useState('Kitchen');

    return (
      <CategoryButtons
        buttonList={[
          'All',
          'Bedroom',
          'Living Room',
          'Kitchen',
          'Workspace',
          'Outdoor',
          'Bathroom',
          'Home office',
          'Dinning room',
        ]}
        selectedCategory={selectedCategory}
        onCategorySelect={(category) => {
          setSelectedCategory(category);
        }}
      />
    );
  },
};
