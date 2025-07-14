export interface Task {
  _id: string;
  title: string;
  description: string;
  project: string;
  assignedTo: string;
  status: string;
  priority: string;
  estimatedHours?: number;
  actualHours?: number;
  dueDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}