import { Meta, StoryObj } from '@storybook/react';
import TaskList from './TaskList.tsx';
import * as TaskStories from './Task.stories'

const meta: Meta<typeof TaskList> = {
  component: TaskList,
  title: 'TaskList',
  tags: ['autodocs'],
  args: {
    ...TaskStories.ActionsData,
  },
  decorators: [
    (story) => (
      <div style={{ margin: '3rem'}}>
        {story()}
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof TaskList>;
export const Default: Story = {
  args: {
    tasks: [
      { ...TaskStories.Default.args?.task, id: '1', title: 'Task 1', state: 'TASK_INBOX' },
      { ...TaskStories.Default.args?.task, id: '2', title: 'Task 2', state: 'TASK_PINNED' },
      { ...TaskStories.Default.args?.task, id: '3', title: 'Task 3', state: 'TASK_ARCHIVED' },
      { ...TaskStories.Default.args?.task, id: '4', title: 'Task 4', state: 'TASK_INBOX' },
      { ...TaskStories.Default.args?.task, id: '5', title: 'Task 5', state: 'TASK_PINNED' },
      { ...TaskStories.Default.args?.task, id: '6', title: 'Task 6', state: 'TASK_ARCHIVED' },
    ],
  },
}

export const WithPinnedTasks: Story = {
  args: {
    tasks: [
      ...(Default.args?.tasks?.slice(0, 5) ?? []),
      { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
    ],
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    tasks: [],
  },
};

export const Empty: Story = {
  args: {
    ...Loading.args,
    loading: false,
  },
};
