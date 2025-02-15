import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Svg,
  Path,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoTable: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: 150,
    fontWeight: 'bold',
  },
  infoValue: {
    flex: 1,
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

const formatDate = () => {
  const now = new Date();
  return now.toISOString().replace('T', ' ').slice(0, -5) + 'Z';
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
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <Svg viewBox="0 0 98 96">
            <Path
              fill="#24292f"
              fillRule="evenodd"
              d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
            />
          </Svg>
        </View>
        <View>
          <Text style={styles.headerText}>GitHub Advanced Security</Text>
          <Text style={styles.headerText}>Summary Report</Text>
        </View>
      </View>

      <View style={styles.infoTable}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>GitHub Repository:</Text>
          <Text style={styles.infoValue}>{organization}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Generated:</Text>
          <Text style={styles.infoValue}>{formatDate()}</Text>
        </View>
      </View>

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