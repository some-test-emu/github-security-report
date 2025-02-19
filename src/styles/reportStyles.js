import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
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
  repoTable: {
    width: '90%',
    alignSelf: 'center',
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
  // Two-column cells
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
  // Repository breakdown cells
  repoTableCell: {
    width: '16.67%',  // Six columns for severity breakdown
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    fontSize: 10,  // Smaller font for repository tables
  },
  repoTableCellHeader: {
    width: '16.67%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    backgroundColor: '#f6f6f6',
    fontWeight: 'bold',
    fontSize: 10,
  },
  repoTableCellThird: {
    width: '33.33%',  // Three columns for secret scanning
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    fontSize: 10,
  },
  repoTableCellHeaderThird: {
    width: '33.33%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    backgroundColor: '#f6f6f6',
    fontWeight: 'bold',
    fontSize: 10,
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