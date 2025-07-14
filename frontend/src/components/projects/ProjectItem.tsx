import React from 'react';
import { ListItem, ListItemText } from '@mui/material';

const ProjectItem = ({ project }: { project: any }) => {
  return (
    <ListItem>
      <ListItemText primary={project.name} secondary={project.description} />
    </ListItem>
  );
};

export { ProjectItem };
