export type Task = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
  status?: string;
  priority?: string;
  image?: string;
};
