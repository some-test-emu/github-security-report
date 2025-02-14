import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Container, CssBaseline } from '@mui/material';
import LoginForm from './components/LoginForm';
import ReportGenerator from './components/ReportGenerator';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  const [authToken, setAuthToken] = useState('');
  const [organization, setOrganization] = useState('');
  const [hasPermissions, setHasPermissions] = useState(false);

  const handleLogin = (token, org) => {
    setAuthToken(token);
    setOrganization(org);
    // In a real app, we would verify permissions here
    setHasPermissions(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          {!hasPermissions ? (
            <LoginForm onLogin={handleLogin} />
          ) : (
            <ReportGenerator 
              authToken={authToken} 
              organization={organization}
            />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
