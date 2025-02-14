import axios from 'axios';

const BASE_URL = 'https://api.github.com';

export const createGitHubClient = (token) => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });
};

export const fetchSecurityAlerts = async (token, organization) => {
  const client = createGitHubClient(token);
  
  try {
    const alerts = {
      codeScanning: [],
      secretScanning: [],
      dependabot: [],
    };

    // Fetch all alerts using organization-level endpoints
    try {
      // Code scanning alerts
      const codeScanningResponse = await client.get(
        `/orgs/${organization}/code-scanning/alerts`
      );
      alerts.codeScanning = codeScanningResponse.data;
    } catch (error) {
      console.warn('Error fetching code scanning alerts:', error.message);
    }

    try {
      // Secret scanning alerts
      const secretScanningResponse = await client.get(
        `/orgs/${organization}/secret-scanning/alerts`
      );
      alerts.secretScanning = secretScanningResponse.data;
    } catch (error) {
      console.warn('Error fetching secret scanning alerts:', error.message);
    }

    try {
      // Dependabot alerts
      const dependabotResponse = await client.get(
        `/orgs/${organization}/dependabot/alerts`
      );
      alerts.dependabot = dependabotResponse.data;
    } catch (error) {
      console.warn('Error fetching dependabot alerts:', error.message);
    }

    return alerts;
  } catch (error) {
    throw new Error(`Failed to fetch security alerts: ${error.message}`);
  }
};

export const generateAlertsSummary = (alerts) => {
  return {
    codeScanning: {
      total: alerts.codeScanning.length,
      open: alerts.codeScanning.filter(alert => alert.state === 'open').length,
      severity: {
        critical: alerts.codeScanning.filter(alert => alert.rule?.severity === 'critical').length,
        high: alerts.codeScanning.filter(alert => alert.rule?.severity === 'high').length,
        medium: alerts.codeScanning.filter(alert => alert.rule?.severity === 'medium').length,
        low: alerts.codeScanning.filter(alert => alert.rule?.severity === 'low').length,
      },
    },
    secretScanning: {
      total: alerts.secretScanning.length,
      open: alerts.secretScanning.filter(alert => alert.state === 'open').length,
      types: alerts.secretScanning.reduce((acc, alert) => {
        acc[alert.secret_type] = (acc[alert.secret_type] || 0) + 1;
        return acc;
      }, {}),
    },
    dependabot: {
      total: alerts.dependabot.length,
      open: alerts.dependabot.filter(alert => alert.state === 'open').length,
      severity: {
        critical: alerts.dependabot.filter(alert => alert.security_advisory?.severity === 'critical').length,
        high: alerts.dependabot.filter(alert => alert.security_advisory?.severity === 'high').length,
        medium: alerts.dependabot.filter(alert => alert.security_advisory?.severity === 'medium').length,
        low: alerts.dependabot.filter(alert => alert.security_advisory?.severity === 'low').length,
      },
    },
  };
}; 