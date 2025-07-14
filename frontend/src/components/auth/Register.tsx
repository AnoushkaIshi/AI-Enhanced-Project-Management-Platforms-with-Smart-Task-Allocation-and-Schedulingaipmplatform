import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/store';
import { registerUser } from '../../store/slices/authSlice';
import { TextField, Button, Container, Typography, Box, MenuItem } from '@mui/material';

interface RegistrationError {
  message?: string;
  errors?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    role?: string;
  };
}

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'member'
  });
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { firstName, lastName, email, password, role } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear field-specific error when user types
    if (fieldErrors[e.target.name]) {
      setFieldErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    
    dispatch(registerUser({ firstName, lastName, email, password, role }))
      .unwrap()
      .then(() => navigate('/projects'))
      .catch((error: RegistrationError) => {
        console.error('Registration failed:', error);
        
        // Handle field-specific errors
        if (error.errors) {
          setFieldErrors(error.errors);
        }
        
        // Set general error message
        setError(error.message || 'Registration failed. Please check your inputs.');
      });
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
        {error && (
          <Typography color="error" align="center" paragraph>
            {error}
          </Typography>
        )}
        <form onSubmit={onSubmit}>
          <TextField
            label="First Name"
            name="firstName"
            value={firstName}
            onChange={onChange}
            fullWidth
            margin="normal"
            required
            error={!!fieldErrors.firstName}
            helperText={fieldErrors.firstName}
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={lastName}
            onChange={onChange}
            fullWidth
            margin="normal"
            required
            error={!!fieldErrors.lastName}
            helperText={fieldErrors.lastName}
          />
          <TextField
            label="Email"
            name="email"
            value={email}
            onChange={onChange}
            fullWidth
            margin="normal"
            required
            type="email"
            error={!!fieldErrors.email}
            helperText={fieldErrors.email}
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
            error={!!fieldErrors.password}
            helperText={fieldErrors.password}
          />
          <TextField
            select
            label="Role"
            name="role"
            value={role}
            onChange={onChange}
            fullWidth
            margin="normal"
            error={!!fieldErrors.role}
            helperText={fieldErrors.role}
          >
            <MenuItem value="member">Member</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
          <Box mt={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Register
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default Register;