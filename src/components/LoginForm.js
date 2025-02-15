import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { fetchSecurityAlerts, generateAlertsSummary } from '../services/githubService';
import SecurityReport from './SecurityReport';

const LoginForm = () => {
  const [token, setToken] = useState('');
  const [organization, setOrganization] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !organization) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const alertsData = await fetchSecurityAlerts(token, organization);
      const summaryData = generateAlertsSummary(alertsData);
      setReportData({
        alerts: alertsData,
        summary: summaryData,
        organization,
      });
    } catch (err) {
      const status = err.response?.status;
      if (status >= 400 && status < 500) {
        setError(`Organization "${organization}" is not accessible with the provided token. Please check your permissions and token settings.`);
      } else {
        setError(err.message || 'Failed to fetch security alerts');
      }
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    return (
      <SecurityReport
        organization={reportData.organization}
        alerts={reportData.alerts}
        summary={reportData.summary}
        showAllAlerts={false}
        chartImages={null}
      />
    );
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
          disabled={loading}
        />

        <TextField
          label="Personal Access Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          type="password"
          fullWidth
          margin="normal"
          required
          disabled={loading}
          helperText="Token needs security read permissions"
        />

        {reportData ? (
          <PDFDownloadLink
            document={generatePDF()}
            fileName={`${organization}-security-report.pdf`}
          >
            {({ loading: pdfLoading }) => (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                disabled={pdfLoading}
              >
                {pdfLoading ? 'Generating PDF...' : 'Download PDF Report'}
              </Button>
            )}
          </PDFDownloadLink>
        ) : (
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                <span>Generating Report...</span>
              </Box>
            ) : (
              'Download PDF Report'
            )}
          </Button>
        )}
      </Paper>
    </Box>
  );
};

export default LoginForm; 