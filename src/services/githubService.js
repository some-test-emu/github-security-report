import { Octokit } from '@octokit/rest';

export const createGitHubClient = (token) => {
  return new Octokit({
    auth: token,
    previews: [
      'dorian-preview',
      'machine-man-preview'
    ]
  });
};

export const fetchSecurityAlerts = async (token, organization) => {
  const octokit = createGitHubClient(token);
  
  try {
    const alerts = {
      codeScanning: [],
      secretScanning: [],
      dependabot: [],
    };

    try {
      const codeScanningAlerts = await octokit.paginate(
        'GET /orgs/{org}/code-scanning/alerts',
        {
          org: organization,
          per_page: 100,
          state: 'all'
        }
      );
      alerts.codeScanning = codeScanningAlerts;
    } catch (error) {
      if (error.status >= 400 && error.status < 500) {
        throw error;
      }
      console.warn('Error fetching code scanning alerts:', error.message);
    }

    try {
      const openAlerts = await octokit.paginate(
        'GET /orgs/{org}/secret-scanning/alerts',
        {
          org: organization,
          per_page: 100,
          state: 'open'
        }
      );
      
      const resolvedAlerts = await octokit.paginate(
        'GET /orgs/{org}/secret-scanning/alerts',
        {
          org: organization,
          per_page: 100,
          state: 'resolved'
        }
      );
      
      alerts.secretScanning = [...openAlerts, ...resolvedAlerts];
    } catch (error) {
      if (error.status >= 400 && error.status < 500) {
        throw error;
      }
      console.warn('Error fetching secret scanning alerts:', error.message);
    }

    try {
      const dependabotAlerts = await octokit.paginate(
        'GET /orgs/{org}/dependabot/alerts',
        {
          org: organization,
          per_page: 100,
          state: 'all'
        }
      );
      alerts.dependabot = dependabotAlerts;
    } catch (error) {
      if (error.status >= 400 && error.status < 500) {
        throw error;
      }
      console.warn('Error fetching dependabot alerts:', error.message);
    }

    return alerts;
  } catch (error) {
    console.log("error: ", error);
    error.response = { status: error.status };
    throw error;
  }
};

export const generateAlertsSummary = (alerts) => {
  return {
    codeScanning: {
      total: alerts.codeScanning.length,
      open: alerts.codeScanning.filter(alert => alert.state === 'open').length,
      severity: {
        critical: alerts.codeScanning.filter(alert => alert.rule?.security_severity_level === 'critical').length,
        high: alerts.codeScanning.filter(alert => alert.rule?.security_severity_level === 'high').length,
        medium: alerts.codeScanning.filter(alert => alert.rule?.security_severity_level === 'medium').length,
        low: alerts.codeScanning.filter(alert => alert.rule?.security_severity_level === 'low').length,
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