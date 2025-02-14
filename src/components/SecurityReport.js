import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginTop: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  subsectionTitle: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 5,
  },
  summaryItem: {
    marginBottom: 5,
  },
  alertItem: {
    marginBottom: 10,
    padding: 5,
    borderBottom: '1 solid #ccc',
  },
  severityHigh: {
    color: '#d32f2f',
  },
  severityCritical: {
    color: '#7a0000',
  },
  severityMedium: {
    color: '#ed6c02',
  },
  severityLow: {
    color: '#2e7d32',
  },
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const SecurityReport = ({ organization, alerts, summary, showAllAlerts }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>
        Security Report for {organization}
      </Text>

      {/* Executive Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Executive Summary</Text>
        <Text style={styles.summaryItem}>
          Total Code Scanning Alerts: {summary.codeScanning.total} (Open: {summary.codeScanning.open})
        </Text>
        <Text style={styles.summaryItem}>
          Total Secret Scanning Alerts: {summary.secretScanning.total} (Open: {summary.secretScanning.open})
        </Text>
        <Text style={styles.summaryItem}>
          Total Dependabot Alerts: {summary.dependabot.total} (Open: {summary.dependabot.open})
        </Text>
      </View>

      {/* Code Scanning Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Code Scanning Alerts</Text>
        <Text style={styles.summaryItem}>
          Severity Breakdown:
          {'\n'}Critical: {summary.codeScanning.severity.critical}
          {'\n'}High: {summary.codeScanning.severity.high}
          {'\n'}Medium: {summary.codeScanning.severity.medium}
          {'\n'}Low: {summary.codeScanning.severity.low}
        </Text>

        {showAllAlerts && alerts.codeScanning.map((alert, index) => (
          <View key={index} style={styles.alertItem}>
            <Text>Rule: {alert.rule.name}</Text>
            <Text>Severity: {alert.rule.severity}</Text>
            <Text>State: {alert.state}</Text>
            <Text>Created: {formatDate(alert.created_at)}</Text>
            <Text>Description: {alert.rule.description}</Text>
          </View>
        ))}
      </View>

      {/* Secret Scanning Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Secret Scanning Alerts</Text>
        <Text style={styles.summaryItem}>
          Secret Types:
          {Object.entries(summary.secretScanning.types).map(([type, count]) => (
            `\n${type}: ${count}`
          ))}
        </Text>

        {showAllAlerts && alerts.secretScanning.map((alert, index) => (
          <View key={index} style={styles.alertItem}>
            <Text>Type: {alert.secret_type_display_name}</Text>
            <Text>State: {alert.state}</Text>
            <Text>Created: {formatDate(alert.created_at)}</Text>
            <Text>Resolution: {alert.resolution || 'None'}</Text>
          </View>
        ))}
      </View>

      {/* Dependabot Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dependabot Alerts</Text>
        <Text style={styles.summaryItem}>
          Severity Breakdown:
          {'\n'}Critical: {summary.dependabot.severity.critical}
          {'\n'}High: {summary.dependabot.severity.high}
          {'\n'}Medium: {summary.dependabot.severity.medium}
          {'\n'}Low: {summary.dependabot.severity.low}
        </Text>

        {showAllAlerts && alerts.dependabot.map((alert, index) => (
          <View key={index} style={styles.alertItem}>
            <Text>Package: {alert.dependency.package.name}</Text>
            <Text>Severity: {alert.security_advisory.severity}</Text>
            <Text>State: {alert.state}</Text>
            <Text>Created: {formatDate(alert.created_at)}</Text>
            <Text>Summary: {alert.security_advisory.summary}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default SecurityReport; 