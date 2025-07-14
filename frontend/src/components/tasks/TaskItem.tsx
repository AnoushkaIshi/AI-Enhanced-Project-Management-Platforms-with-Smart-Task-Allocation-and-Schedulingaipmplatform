import React from 'react';
import { ListItem, ListItemText, ListItemButton } from '@mui/material';
import { Task } from '../../types/task'; // <-- use this Task interface

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  return (
    <ListItem disablePadding>
      <ListItemButton>
        <ListItemText
          primary={task.title}
          secondary={task.description || 'No description'}
        />
      </ListItemButton>
    </ListItem>
  );
};
