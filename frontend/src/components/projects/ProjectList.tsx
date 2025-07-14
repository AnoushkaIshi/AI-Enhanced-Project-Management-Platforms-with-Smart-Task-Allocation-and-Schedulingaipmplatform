import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { getProjects } from '../../store/slices/projectSlice';
import { ProjectItem } from './ProjectItem';
import { Button, Container, Typography, List, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import type { RootState } from '../../store/store';

const ProjectList = () => {
  const dispatch = useAppDispatch();
  const { projects, loading } = useAppSelector((state: RootState) => state.projects);

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="md">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Projects</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link}
          to="/projects/new"
        >
          New Project
        </Button>
      </Box>
      
      <List>
        {projects.map((project: any) => (
          <ProjectItem key={project._id} project={project} />
        ))}
      </List>
    </Container>
  );
};

export default ProjectList;
