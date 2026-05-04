export const formatDeadline = (value: string | Date): string => {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
};
