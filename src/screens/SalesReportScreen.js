import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SalesReportScreen = () => {
  // Placeholder for sales report data
  const salesReportData = {
    summary: 'Monthly sales report summary goes here.',
    details: [
      { month: 'January', revenue: 500, conversions: 10 },
      { month: 'February', revenue: 600, conversions: 12 },
      { month: 'March', revenue: 700, conversions: 14 },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sales Report</Text>
      <Text>{salesReportData.summary}</Text>
      <View style={styles.reportDetails}>
        {salesReportData.details.map((item, index) => (
          <View key={index} style={styles.detailItem}>
            <Text>{item.month}</Text>
            <Text>Revenue: {item.revenue}</Text>
            <Text>Conversions: {item.conversions}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  reportDetails: {
    marginTop: 8,
  },
  detailItem: {
    borderWidth: 1,
    padding: 8,
    marginVertical: 4,
  },
});

export default SalesReportScreen;
