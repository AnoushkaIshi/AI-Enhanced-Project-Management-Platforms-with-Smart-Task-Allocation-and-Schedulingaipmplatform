import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { getRecommendations } from '../../store/slices/taskSlice';
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Paper,
  CircularProgress,
  Button
} from '@mui/material';

interface Recommendation {
  user: {
    id: string;
    name: string;
  };
  score: number;
  skills: string[];
  task?: string;
}

interface TaskState {
  tasks: any[];
  selectedTask: any | null;
  recommendations: Recommendation[];
  loading: boolean;
  error: string | null;
}

interface RootState {
  tasks: TaskState;
}

interface TaskRecommendationsProps {
  taskId: string;
}

const TaskRecommendations: React.FC<TaskRecommendationsProps> = ({ taskId }) => {
  const dispatch = useAppDispatch();
  const { recommendations, loading } = useAppSelector((state: RootState) => state.tasks);

  useEffect(() => {
    dispatch(getRecommendations(taskId));
  }, [dispatch, taskId]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Paper elevation={3} style={{ padding: '20px' }}>
      <Typography variant="h6" gutterBottom>
        AI Recommendations
      </Typography>
      
      {recommendations && recommendations.length > 0 ? (
        <>
          <Typography variant="body2" gutterBottom>
            Task: {recommendations[0].task}
          </Typography>
          
          <List>
            {recommendations.map((rec: Recommendation) => (
              <ListItem key={rec.user.id}>
                <ListItemAvatar>
                  <Avatar>
                    {rec.user.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={rec.user.name}
                  secondary={
                    <>
                      <span>Score: {(rec.score * 100).toFixed(0)}%</span>
                      <br />
                      <span>Skills: {rec.skills.join(', ')}</span>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
          
          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '10px' }}
          >
            Assign to Top Recommendation
          </Button>
        </>
      ) : (
        <Typography>No recommendations available</Typography>
      )}
    </Paper>
  );
};

export default TaskRecommendations;