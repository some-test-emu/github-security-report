import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  FormControlLabel,
  Checkbox,
  Button,
} from '@mui/material';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { fetchSecurityAlerts, generateAlertsSummary } from '../services/githubService';
import SecurityReport from './SecurityReport';

const ReportGenerator = ({ authToken, organization }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alerts, setAlerts] = useState(null);
  const [summary, setSummary] = useState(null);
  const [showAllAlerts, setShowAllAlerts] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const alertsData = await fetchSecurityAlerts(authToken, organization);
        setAlerts(alertsData);
        const summaryData = generateAlertsSummary(alertsData);
        setSummary(summaryData);
      } catch (err) {
        setError(err.message || 'Failed to fetch security alerts');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authToken, organization]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Security Report for {organization}
        </Typography>

        {summary && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Summary
            </Typography>
            <Typography>
              Code Scanning Alerts: {summary.codeScanning.total} (Open: {summary.codeScanning.open})
            </Typography>
            <Typography>
              Secret Scanning Alerts: {summary.secretScanning.total} (Open: {summary.secretScanning.open})
            </Typography>
            <Typography>
              Dependabot Alerts: {summary.dependabot.total} (Open: {summary.dependabot.open})
            </Typography>
          </Box>
        )}

        <Box sx={{ mt: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={showAllAlerts}
                onChange={(e) => setShowAllAlerts(e.target.checked)}
              />
            }
            label="Include all alert details in PDF"
          />
        </Box>

        {alerts && (
          <Box sx={{ mt: 3 }}>
            <PDFDownloadLink
              document={
                <SecurityReport
                  organization={organization}
                  alerts={alerts}
                  summary={summary}
                  showAllAlerts={showAllAlerts}
                />
              }
              fileName={`${organization}-security-report.pdf`}
            >
              {({ loading }) => (
                <Button
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? 'Generating PDF...' : 'Download PDF Report'}
                </Button>
              )}
            </PDFDownloadLink>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ReportGenerator; 