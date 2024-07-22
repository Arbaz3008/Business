import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Modal, ScrollView, Alert
} from 'react-native';
import { firestore } from '../../firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CRMCustomerScreen = ({ navigation }) => {
  const [customers, setCustomers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const storedCustomers = await AsyncStorage.getItem('customers');
      if (storedCustomers) {
        setCustomers(JSON.parse(storedCustomers));
      }

      const unsubscribe = onSnapshot(collection(firestore, 'customers'), (snapshot) => {
        const customerData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCustomers(customerData);
        AsyncStorage.setItem('customers', JSON.stringify(customerData));
      });

      return () => unsubscribe();
    };

    fetchData();
  }, []);

  const handleAddCustomer = async () => {
    try {
      await addDoc(collection(firestore, 'customers'), newCustomer);
      const customerSnapshot = await getDocs(collection(firestore, 'customers'));
      const customerData = customerSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCustomers(customerData);
      AsyncStorage.setItem('customers', JSON.stringify(customerData));
      setIsModalVisible(false);
      setNewCustomer({ name: '', email: '' });
    } catch (error) {
      console.error("Error adding customer: ", error);
    }
  };

  const handleDeleteCustomer = async (customer) => {
    try {
      await deleteDoc(doc(firestore, 'customers', customer.id));
      const customerSnapshot = await getDocs(collection(firestore, 'customers'));
      const customerData = customerSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCustomers(customerData);
      AsyncStorage.setItem('customers', JSON.stringify(customerData));
    } catch (error) {
      console.error("Error deleting customer: ", error);
    }
  };

  const handleEditCustomer = async () => {
    try {
      if (selectedCustomer) {
        const customerRef = doc(firestore, 'customers', selectedCustomer.id);
        await updateDoc(customerRef, selectedCustomer);
        const customerSnapshot = await getDocs(collection(firestore, 'customers'));
        const customerData = customerSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCustomers(customerData);
        AsyncStorage.setItem('customers', JSON.stringify(customerData));
        setIsModalVisible(false);
        setSelectedCustomer(null);
      }
    } catch (error) {
      console.error("Error updating customer: ", error);
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search customers..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <ScrollView>
        {filteredCustomers.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.customerItem}
            onPress={() => navigation.navigate('CustomerDetails', { customerId: item.id })}
            onLongPress={() => {
              Alert.alert(
                "Options",
                `Edit or Delete ${item.name}`,
                [
                  {
                    text: "Edit",
                    onPress: () => {
                      setSelectedCustomer(item);
                      setIsModalVisible(true);
                    }
                  },
                  {
                    text: "Delete",
                    onPress: () => handleDeleteCustomer(item),
                    style: "destructive"
                  },
                  {
                    text: "Cancel",
                    style: "cancel"
                  }
                ],
                { cancelable: true }
              );
            }}
          >
            <Text>{item.name}</Text>
            <Text>{item.email}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={() => setIsModalVisible(true)}>
        <Text style={styles.buttonText}>Add Customer</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => {
          setIsModalVisible(false);
          setSelectedCustomer(null);
        }}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{selectedCustomer ? "Edit Customer" : "Add New Customer"}</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={selectedCustomer ? selectedCustomer.name : newCustomer.name}
            onChangeText={(text) => {
              if (selectedCustomer) {
                setSelectedCustomer({ ...selectedCustomer, name: text });
              } else {
                setNewCustomer({ ...newCustomer, name: text });
              }
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={selectedCustomer ? selectedCustomer.email : newCustomer.email}
            onChangeText={(text) => {
              if (selectedCustomer) {
                setSelectedCustomer({ ...selectedCustomer, email: text });
              } else {
                setNewCustomer({ ...newCustomer, email: text });
              }
            }}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (selectedCustomer) {
                handleEditCustomer();
              } else {
                handleAddCustomer();
              }
            }}
          >
            <Text style={styles.buttonText}>{selectedCustomer ? "Save" : "Submit"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {
            setIsModalVisible(false);
            setSelectedCustomer(null);
          }}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    padding: 8,
    marginVertical: 8,
    borderRadius: 30,
  },
  customerItem: {
    borderWidth: 1,
    padding: 16,
    marginVertical: 8,
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'tomato',
    padding: 10,
    marginTop: 10,
    borderRadius: 50,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginVertical: 8,
    borderRadius: 30,
  },
});

export default CRMCustomerScreen;
