import type { BoardId } from '@/shared/config/ids';

export type TaskId = string;

export type Priority = 'low' | 'medium' | 'high';

export type Task = {
  id: TaskId;
  boardId: BoardId;
  title: string;
  description: string;
  priority: Priority;
  tags: string[];
  deadline: string;
  assigneeId: string | null;
  createdAt: string;
};

export type TaskInput = Pick<
  Task,
  'title' | 'description' | 'priority' | 'tags' | 'deadline'
>;

export type TaskPatch = Partial<TaskInput>;
