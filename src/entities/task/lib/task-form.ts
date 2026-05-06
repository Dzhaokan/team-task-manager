import type { Task, TaskInput } from '../model/types';
import type { TaskFormValues } from '../model/schema';

const MAX_TAGS = 10;

const parseTags = (raw: string): string[] => {
  if (!raw.trim()) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of raw.split(',')) {
    const tag = part.trim();
    if (!tag || seen.has(tag)) continue;
    seen.add(tag);
    out.push(tag);
    if (out.length >= MAX_TAGS) break;
  }
  return out;
};

const parseDeadline = (raw: string): string => {
  if (!raw) return '';
  return new Date(`${raw}T00:00:00.000Z`).toISOString();
};

const formatDeadlineForInput = (iso: string): string => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
};

export const formValuesToTaskInput = (v: TaskFormValues): TaskInput => ({
  title: v.title.trim(),
  description: v.description.trim(),
  priority: v.priority,
  tags: parseTags(v.tags),
  deadline: parseDeadline(v.deadline),
});

export const taskToFormValues = (t: Task): TaskFormValues => ({
  title: t.title,
  description: t.description,
  priority: t.priority,
  tags: t.tags.join(', '),
  deadline: formatDeadlineForInput(t.deadline),
});
