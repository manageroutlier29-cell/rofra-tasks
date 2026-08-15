export interface Task {
  id: string;
  title: string;
  reward: number;
  link: string;
  category?: string;
}

const DEFAULT_TASKS: Task[] = [
  {
    id: '1',
    title: 'Watch YouTube Video & Like',
    reward: 50,
    link: 'https://youtube.com',
    category: 'Standard'
  },
  {
    id: '2',
    title: 'Follow Instagram Account',
    reward: 40,
    link: 'https://instagram.com',
    category: 'Standard'
  },
  {
    id: '3',
    title: 'Complete Online Survey',
    reward: 60,
    link: 'https://google.com',
    category: 'Standard'
  },
  {
    id: '4',
    title: 'Download & Review Mobile App',
    reward: 150,
    link: 'https://play.google.com',
    category: 'Pro'
  },
  {
    id: '5',
    title: 'Test Web App Functionality',
    reward: 200,
    link: 'https://github.com',
    category: 'Pro'
  }
];

export function getStoredTasks(): Task[] {
  if (typeof window === 'undefined') return DEFAULT_TASKS;
  const stored = localStorage.getItem('rofra_tasks');
  if (!stored) {
    localStorage.setItem('rofra_tasks', JSON.stringify(DEFAULT_TASKS));
    return DEFAULT_TASKS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_TASKS;
  }
}

export function saveStoredTasks(tasks: Task[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('rofra_tasks', JSON.stringify(tasks));
  }
}
