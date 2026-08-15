import { supabase } from '@/lib/supabase';

export interface Task {
  id: string;
  title: string;
  reward: number;
  link: string;
  category?: string;
}

export async function fetchAllTasks(): Promise<Task[]> {
  const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
  if (error || !data || data.length === 0) {
    return [
      { id: '1', title: 'Watch YouTube Video & Like', reward: 50, link: 'https://youtube.com', category: 'Standard' },
      { id: '2', title: 'Follow Instagram Account', reward: 40, link: 'https://instagram.com', category: 'Standard' },
      { id: '3', title: 'Complete Online Survey', reward: 60, link: 'https://google.com', category: 'Standard' }
    ];
  }
  return data;
}

export function getStoredTasks(): Task[] {
  return [];
}

export function saveStoredTasks(tasks: Task[]): void {}
