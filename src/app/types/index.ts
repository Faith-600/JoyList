export * from '@/config/themes'

export type Project = {
  id: string;
  name: string;
};

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
   dueDate?: string;
   imageUrl?: string;
    projectId: string;
};

