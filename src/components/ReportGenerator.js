import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Button,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { fetchSecurityAlerts, generateAlertsSummary } from '../services/githubService';
import SecurityReport from './SecurityReport';
import SecurityPieChart from './SecurityPieChart';
import CloseIcon from '@mui/icons-material/Close';

const ReportGenerator = ({ authToken, organization }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alerts, setAlerts] = useState(null);
  const [summary, setSummary] = useState(null);
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const codeScanningChartRef = useRef(null);
  const dependabotChartRef = useRef(null);
  const [chartImages, setChartImages] = useState(null);

  const handleCloseError = () => {
    setError('');
  };

  const renderErrorDialog = () => (
    <Dialog 
      open={!!error} 
      onClose={handleCloseError}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Error
        <IconButton
          aria-label="close"
          onClick={handleCloseError}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        {error.includes('not accessible') && (
          <>
            <Typography variant="h6" gutterBottom>Prerequisites:</Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="GitHub Personal Access Token (PAT) with the following permissions:"
                  secondary={
                    <List>
                      <ListItem>
                        <ListItemText primary="Organization owner access" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Code Scanning Alerts: Read access" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Secret Scanning Alerts: Read access" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Dependabot Alerts: Read access" />
                      </ListItem>
                    </List>
                  }
                />
              </ListItem>
            </List>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Troubleshooting:</Typography>
            <List>
              <ListItem>
                <ListItemText primary="1. Verify your Personal Access Token has the required permissions" />
              </ListItem>
              <ListItem>
                <ListItemText primary="2. Ensure you have organization owner access" />
              </ListItem>
              <ListItem>
                <ListItemText primary="3. Check if your token hasn't expired" />
              </ListItem>
            </List>

            <Typography variant="body1" sx={{ mt: 2 }}>
              To create a Personal Access Token:
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="1. Go to GitHub.com → Settings → Developer settings → Fine-grained tokens" />
              </ListItem>
              <ListItem>
                <ListItemText primary="2. Click 'Generate new token'" />
              </ListItem>
              <ListItem>
                <ListItemText primary="3. Resource Owner should be the Organization you want to report on" />
              </ListItem>
              <ListItem>
                <ListItemText primary="4. Select repositories you want to report on or choose 'All repositories'" />
              </ListItem>
              <ListItem>
                <ListItemText primary="5. Select the required permissions mentioned above" />
              </ListItem>
            </List>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseError} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const alertsData = await fetchSecurityAlerts(authToken, organization);
        setAlerts(alertsData);
        const summaryData = generateAlertsSummary(alertsData);
        setSummary(summaryData);
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

  return (
    <Box sx={{ mt: 4 }}>
      {renderErrorDialog()}
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
                Software Composition Analysis Alerts: {summary.dependabot.total} (Open: {summary.dependabot.open})
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
                  title="Software Composition Analysis Alerts by Severity"
                />
              </Box>
            </Box>
          </>
        )}

        {/* Temporarily commented out
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
        */}

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