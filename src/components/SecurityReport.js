import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
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
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 10,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#f6f6f6',
  },
  tableCell: {
    width: '33%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableCellHeader: {
    width: '33%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    backgroundColor: '#f6f6f6',
    fontWeight: 'bold',
  },
  tableCellHalf: {
    width: '50%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableCellHeaderHalf: {
    width: '50%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    backgroundColor: '#f6f6f6',
    fontWeight: 'bold',
  },
  chartContainer: {
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
    height: 200,
  },
  chart: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  alertItem: {
    marginBottom: 10,
    padding: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const TableRow = ({ items, isHeader = false, twoColumns = false }) => (
  <View style={styles.tableRow}>
    {items.map((item, i) => (
      <Text key={i} style={isHeader ? 
        (twoColumns ? styles.tableCellHeaderHalf : styles.tableCellHeader) :
        (twoColumns ? styles.tableCellHalf : styles.tableCell)
      }>
        {item}
      </Text>
    ))}
  </View>
);

const SecurityReport = ({ organization, alerts, summary, showAllAlerts, chartImages }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>
        Security Report for {organization}
      </Text>

      {/* Executive Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Executive Summary</Text>
        <View style={styles.table}>
          <TableRow items={['Alert Type', 'Total', 'Open']} isHeader={true} />
          <TableRow items={[
            'Code Scanning',
            summary.codeScanning.total.toString(),
            summary.codeScanning.open.toString()
          ]} />
          <TableRow items={[
            'Secret Scanning',
            summary.secretScanning.total.toString(),
            summary.secretScanning.open.toString()
          ]} />
          <TableRow items={[
            'Dependabot',
            summary.dependabot.total.toString(),
            summary.dependabot.open.toString()
          ]} />
        </View>
      </View>

      {/* Code Scanning Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Code Scanning Alerts</Text>
        {chartImages?.codeScanning && (
          <View style={styles.chartContainer}>
            <Image style={styles.chart} src={chartImages.codeScanning} />
          </View>
        )}
        <View style={styles.table}>
          <TableRow items={['Severity', 'Count']} isHeader={true} twoColumns={true} />
          <TableRow items={['Critical', summary.codeScanning.severity.critical.toString()]} twoColumns={true} />
          <TableRow items={['High', summary.codeScanning.severity.high.toString()]} twoColumns={true} />
          <TableRow items={['Medium', summary.codeScanning.severity.medium.toString()]} twoColumns={true} />
          <TableRow items={['Low', summary.codeScanning.severity.low.toString()]} twoColumns={true} />
        </View>

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
        <View style={styles.table}>
          <TableRow items={['Secret Type', 'Count']} isHeader={true} twoColumns={true} />
          {Object.entries(summary.secretScanning.types).map(([type, count], index) => (
            <TableRow key={index} items={[type, count.toString()]} twoColumns={true} />
          ))}
        </View>

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
        {chartImages?.dependabot && (
          <View style={styles.chartContainer}>
            <Image style={styles.chart} src={chartImages.dependabot} />
          </View>
        )}
        <View style={styles.table}>
          <TableRow items={['Severity', 'Count']} isHeader={true} twoColumns={true} />
          <TableRow items={['Critical', summary.dependabot.severity.critical.toString()]} twoColumns={true} />
          <TableRow items={['High', summary.dependabot.severity.high.toString()]} twoColumns={true} />
          <TableRow items={['Medium', summary.dependabot.severity.medium.toString()]} twoColumns={true} />
          <TableRow items={['Low', summary.dependabot.severity.low.toString()]} twoColumns={true} />
        </View>

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