import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { getTasks } from '../../store/slices/taskSlice';
import { TaskItem } from './TaskItem';
import TaskRecommendations from './TaskRecommendations';
import type { RootState } from '../../store/store';
import type { Task } from '../../types/task';
import { Container, Typography, List, Box } from '@mui/material';

const TaskList = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useAppDispatch();

  const { tasks, selectedTask, loading } = useAppSelector(
    (state: RootState) => state.tasks
  );

  useEffect(() => {
    if (projectId) {
      dispatch(getTasks(projectId));
    }
  }, [dispatch, projectId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Tasks
      </Typography>

      <Box display="flex">
        <Box flex={1} mr={2}>
          <List>
            {tasks.map((task: Task) => (
              <TaskItem key={task._id} task={task} />
            ))}
          </List>
        </Box>

        {selectedTask && (
          <Box width={400}>
            <TaskRecommendations taskId={selectedTask._id} />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default TaskList;
