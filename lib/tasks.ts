export interface Task {
  id: string;
  title: string;
  reward: number;
  category: string;
  link?: string;
  timeEstimate?: string;
}

const DEFAULT_TASKS: Task[] = [
  { id: '1', title: 'YouTube Channel Subscription', reward: 30, category: 'Social Media', timeEstimate: '2 mins', link: 'https://youtube.com' },
  { id: '2', title: 'Download & Rate Android App', reward: 50, category: 'App Testing', timeEstimate: '3 mins', link: 'https://play.google.com' },
];

export function getStoredTasks(): Task[] {
  if (typeof window === 'undefined') return DEFAULT_TASKS;
  const saved = localStorage.getItem('rofra_tasks');
  return saved ? JSON.parse(saved) : DEFAULT_TASKS;
}

export function saveTask(newTask: Task) {
  const current = getStoredTasks();
  const updated = [newTask, ...current];
  localStorage.setItem('rofra_tasks', JSON.stringify(updated));
}

export function deleteTask(taskId: string) {
  const current = getStoredTasks();
  const updated = current.filter(t => t.id !== taskId);
  localStorage.setItem('rofra_tasks', JSON.stringify(updated));
}

export function getWorkerBalance(): number {
  if (typeof window === 'undefined') return 0;
  const balance = localStorage.getItem('rofra_worker_balance');
  return balance ? parseFloat(balance) : 0;
}

export function addWorkerBalance(amount: number): number {
  const current = getWorkerBalance();
  const updated = current + amount;
  localStorage.setItem('rofra_worker_balance', updated.toString());
  return updated;
}
