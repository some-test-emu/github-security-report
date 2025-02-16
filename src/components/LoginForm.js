import React, { useState, useRef, useEffect } from 'react';
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
import SecurityPieChart from './SecurityPieChart';

const LoginForm = () => {
  const [token, setToken] = useState('');
  const [organization, setOrganization] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [chartImages, setChartImages] = useState(null);
  const codeScanningChartRef = useRef(null);
  const dependabotChartRef = useRef(null);

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
      setReportData(null);
      setChartImages(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reportData?.summary) {
      setTimeout(() => {
        const codeScanningImage = codeScanningChartRef.current?.getChartImage();
        const dependabotImage = dependabotChartRef.current?.getChartImage();
        
        if (codeScanningImage && dependabotImage) {
          setChartImages({
            codeScanning: codeScanningImage,
            dependabot: dependabotImage
          });
        }
      }, 2000);
    }
  }, [reportData]);

  const generatePDF = () => {
    return (
      <SecurityReport
        organization={reportData.organization}
        alerts={reportData.alerts}
        summary={reportData.summary}
        showAllAlerts={false}
        chartImages={chartImages}
      />
    );
  };

  const renderButton = () => {
    if (!reportData) {
      return (
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
              <span>Retrieving Alerts...</span>
            </Box>
          ) : (
            'Retrieve Security Alerts'
          )}
        </Button>
      );
    }

    if (reportData && chartImages) {
      return (
        <PDFDownloadLink
          document={generatePDF()}
          fileName={`${organization}-security-report.pdf`}
        >
          {({ loading: pdfLoading }) => (
            <Button
              variant="contained"
              color="success"
              fullWidth
              sx={{ mt: 2 }}
              disabled={pdfLoading}
            >
              {pdfLoading ? 'Generating PDF...' : 'Download PDF Report'}
            </Button>
          )}
        </PDFDownloadLink>
      );
    }

    return (
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        disabled
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={20} color="inherit" />
          <span>Preparing Report...</span>
        </Box>
      </Button>
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

        {reportData && (
          <Box sx={{
            position: 'absolute',
            width: '500px',
            height: '300px',
            overflow: 'hidden',
            opacity: 0,
            pointerEvents: 'none',
          }}>
            <Box sx={{ width: '100%', height: '100%' }}>
              <SecurityPieChart
                ref={codeScanningChartRef}
                data={reportData.summary.codeScanning.severity}
                title="Code Scanning Alerts by Severity"
              />
            </Box>
            <Box sx={{ width: '100%', height: '100%' }}>
              <SecurityPieChart
                ref={dependabotChartRef}
                data={reportData.summary.dependabot.severity}
                title="Software Composition Analysis Alerts by Severity"
              />
            </Box>
          </Box>
        )}

        {renderButton()}
      </Paper>
    </Box>
  );
};

export default LoginForm; 