import React, { useState, useEffect, useRef } from 'react';
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
import SecurityPieChart from './SecurityPieChart';

const ReportGenerator = ({ authToken, organization }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alerts, setAlerts] = useState(null);
  const [summary, setSummary] = useState(null);
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const codeScanningChartRef = useRef(null);
  const dependabotChartRef = useRef(null);
  const [chartImages, setChartImages] = useState(null);

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

  useEffect(() => {
    if (summary) {
      // Wait for charts to render
      setTimeout(() => {
        setChartImages({
          codeScanning: codeScanningChartRef.current?.getChartImage(),
          dependabot: dependabotChartRef.current?.getChartImage()
        });
      }, 1000);
    }
  }, [summary]);

  const generatePDF = () => {
    return (
      <SecurityReport
        organization={organization}
        alerts={alerts}
        summary={summary}
        showAllAlerts={showAllAlerts}
        chartImages={chartImages}
      />
    );
  };

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
          <>
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

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mt: 2 }}>
              <Box>
                <SecurityPieChart
                  ref={codeScanningChartRef}
                  data={summary.codeScanning.severity}
                  title="Code Scanning Alerts by Severity"
                />
              </Box>
              <Box>
                <SecurityPieChart
                  ref={dependabotChartRef}
                  data={summary.dependabot.severity}
                  title="Dependabot Alerts by Severity"
                />
              </Box>
            </Box>
          </>
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

        {alerts && chartImages && (
          <Box sx={{ mt: 3 }}>
            <PDFDownloadLink
              document={generatePDF()}
              fileName={`${organization}-security-report.pdf`}
            >
              {({ loading: pdfLoading }) => (
                <Button
                  variant="contained"
                  color="primary"
                  disabled={pdfLoading}
                >
                  {pdfLoading ? 'Generating PDF...' : 'Download PDF Report'}
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