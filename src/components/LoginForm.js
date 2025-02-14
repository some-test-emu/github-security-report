import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from '@mui/material';

const LoginForm = ({ onLogin }) => {
  const [token, setToken] = useState('');
  const [organization, setOrganization] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !organization) {
      setError('Please fill in all fields');
      return;
    }

    try {
      // Here we would typically validate the token and check permissions
      // For now, we'll just pass the values up
      onLogin(token, organization);
    } catch (err) {
      setError(err.message || 'Failed to authenticate');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 500 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          GitHub Security Report Generator
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3 }}>
          Enter your GitHub organization name and a personal access token with security read permissions.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Organization Name"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Personal Access Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          type="password"
          fullWidth
          margin="normal"
          required
          helperText="Token needs security read permissions"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Generate Report
        </Button>
      </Paper>
    </Box>
  );
};

export default LoginForm; 