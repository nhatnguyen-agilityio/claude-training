import { Meta, StoryObj } from '@storybook/react';
import Task from './Task';
import { expect, fn, userEvent, within } from '@storybook/test';
import { useState } from 'react';

export const ActionsData = {
    onArchiveTask: fn(),
    onPinTask: fn(),
    onChangeTask: fn(),
};

const meta: Meta<typeof Task> = {
    component: Task,
    title: 'Task',
    tags: ['autodocs'],
    excludeStories: /.*Data$/,
};

export default meta;
type Story = StoryObj<typeof Task>;
export const Default: Story = {
  args: {
      task: {
          id: '1',
          title: 'Task 1',
          state: 'TASK_INBOX',
      },
      ...ActionsData,
  },

  render: (args) => {
    const TaskWrapper = () => {
      const [state, setState] = useState(args.task.state);

      return (
        <Task
          {...args}
          task={{ ...args.task, state }}
          onChangeTask={() => {
            console.log('Checkbox clicked!');
            // Toggle state to simulate checkbox change
            setState((prev) => (prev === 'TASK_ARCHIVED' ? 'TASK_INBOX' : 'TASK_ARCHIVED'));
          }}
        />
      );
    };

    return <TaskWrapper />;
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox');

    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  }
}

export const Pinned: Story = {
    args: {
        task: {
            id: '2',
            title: 'Task 2',
            state: 'TASK_PINNED',
        },
        ...ActionsData,
    },
};
export const Archived: Story = {
    args: {
        task: {
            id: '3',
            title: 'Task 3',
            state: 'TASK_ARCHIVED',
        },
        ...ActionsData,
    },
};
