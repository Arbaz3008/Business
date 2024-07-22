import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { firestore } from '../../firebase';
import { collection, addDoc, doc, onSnapshot, query } from 'firebase/firestore'; 

const SalesPerformanceScreen = ({ navigation }) => {
  const [salesData, setSalesData] = useState({
    totalSales: 0,
    conversionRate: 0,
    leadSources: []
  });
  const [newLeadSource, setNewLeadSource] = useState('');
  const [allSalesData, setAllSalesData] = useState([]);

  useEffect(() => {
    const docRef = doc(firestore, 'sales', 'salesData');
    const salesCollectionRef = collection(firestore, 'sales');

    const unsubscribeSalesData = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setSalesData(docSnap.data());
      } else {
        console.log('No such document!');
      }
    });

    const q = query(salesCollectionRef);
    const unsubscribeSalesCollection = onSnapshot(q, (snapshot) => {
      const salesArray = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllSalesData(salesArray);
    });

    return () => {
      unsubscribeSalesData();
      unsubscribeSalesCollection();
    };
  }, []);

  const handleAddLeadSource = async () => {
    try {
      const salesCollectionRef = collection(firestore, 'sales');
      await addDoc(salesCollectionRef, { leadSource: newLeadSource });
      setNewLeadSource('');
    } catch (error) {
      console.error('Error adding lead source: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sales Performance</Text>
      <View style={styles.metric}>
        <Text>Total Sales: {salesData.totalSales}</Text>
      </View>
      <View style={styles.metric}>
        <Text>Conversion Rate: {salesData.conversionRate}%</Text>
      </View>
      <View style={styles.metric}>
        <Text>Lead Sources:</Text>
        {salesData.leadSources.map((source, index) => (
          <Text key={index}>{source}</Text>
        ))}
      </View>

      <Text style={styles.subtitle}>All Sales Data:</Text>
      <FlatList
        data={allSalesData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Lead Source: {item.leadSource}</Text>
          </View>
        )}
      />

      <TextInput
        style={styles.input}
        placeholder="New Lead Source"
        value={newLeadSource}
        onChangeText={setNewLeadSource}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddLeadSource}>
        <Text>Add Lead Source</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SalesReport')}>
        <Text>View Sales Report</Text>
      </TouchableOpacity>
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
  metric: {
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginVertical: 8,
    borderRadius: 4,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 16,
  },
  item: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
  },
});

export default SalesPerformanceScreen;
