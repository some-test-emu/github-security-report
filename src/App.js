import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Container, CssBaseline } from '@mui/material';
import LoginForm from './components/LoginForm';

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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <LoginForm />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
