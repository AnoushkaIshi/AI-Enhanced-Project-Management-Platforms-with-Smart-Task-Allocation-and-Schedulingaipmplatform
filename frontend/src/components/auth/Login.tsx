import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/store';
import { loginUser } from '../../store/slices/authSlice';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error state
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => navigate('/projects'))
      .catch((error: { message?: string }) => {
        console.error('Login failed:', error);
        setError(error.message || 'Login failed. Please try again.');
      });
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        {error && (
          <Typography color="error" align="center" paragraph>
            {error}
          </Typography>
        )}
        <form onSubmit={onSubmit}>
          <TextField
            label="Email"
            name="email"
            value={email}
            onChange={onChange}
            fullWidth
            margin="normal"
            required
            type="email"
          />
          <TextField
            label="Password"
            name="password"
            value={password}
            onChange={onChange}
            fullWidth
            margin="normal"
            required
            type="password"
          />
          <Box mt={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Login
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default Login;