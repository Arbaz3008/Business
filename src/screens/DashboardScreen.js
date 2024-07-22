import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Modal, Button, ScrollView, Dimensions, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { ProgressBar } from 'react-native-paper';
import { LineChart, BarChart, PieChart, ProgressChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { getDatabase, ref, onValue, push, set, remove, update } from 'firebase/database';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const DashboardScreen = ({ navigation }) => {
  const user = useSelector(state => state.auth.user);
  const [profileImageUri, setProfileImageUri] = useState(null);
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState('');
  const [activityDescription, setActivityDescription] = useState('');
  const [editActivity, setEditActivity] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [projects, setProjects] = useState([]);

  const database = getDatabase();
  const firestore = getFirestore();

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const userRef = ref(database, `users/${user.uid}`);
        onValue(userRef, snapshot => {
          const userData = snapshot.val();
          setUsername(userData.username);
        });

        const statsRef = ref(database, `stats/${user.uid}`);
        onValue(statsRef, snapshot => setStats(Object.values(snapshot.val() || {})));

        const activitiesRef = ref(database, `activities/${user.uid}`);
        onValue(activitiesRef, snapshot => setActivities(Object.entries(snapshot.val() || {}).map(([key, value]) => ({ key, ...value }))));

        const projectsSnapshot = await getDocs(collection(firestore, 'projects'));
        const projectsList = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(projectsList);
      };

      fetchData();

      const loadProfileImage = async () => {
        try {
          const uri = await AsyncStorage.getItem('profileImageUri');
          if (uri) {
            setProfileImageUri(uri);
          }
        } catch (error) {
          console.log('Failed to load profile image URI:', error);
        }
      };

      loadProfileImage();
    }
  }, [user]);

  const handleProfileImagePress = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileImageUri(uri);
      saveProfileImageUri(uri);
    }
  };

  const saveProfileImageUri = async (uri) => {
    try {
      await AsyncStorage.setItem('profileImageUri', uri);
    } catch (error) {
      console.log('Failed to save profile image URI:', error);
    }
  };

  const handleAddActivity = () => {
    if (user) {
      const activitiesRef = ref(database, `activities/${user.uid}`);
      const newActivityRef = push(activitiesRef);
      set(newActivityRef, {
        activity: newActivity,
        description: activityDescription,
        timestamp: new Date().toISOString()
      });
      setNewActivity('');
      setActivityDescription('');
      setModalVisible(false);
    }
  };

  const handleEditActivity = (activity) => {
    setEditActivity(activity);
    setNewActivity(activity.activity);
    setActivityDescription(activity.description);
    setModalVisible(true);
  };

  const handleUpdateActivity = () => {
    if (user) {
      const activityRef = ref(database, `activities/${user.uid}/${editActivity.key}`);
      update(activityRef, {
        activity: newActivity,
        description: activityDescription,
        timestamp: editActivity.timestamp // Keep the original timestamp
      });
      setNewActivity('');
      setActivityDescription('');
      setEditActivity(null);
      setModalVisible(false);
    }
  };

  const handleRemoveActivity = (key) => {
    if (user) {
      const activityRef = ref(database, `activities/${user.uid}/${key}`);
      remove(activityRef);
    }
  };

  const renderActivityItem = ({ item }) => (
    <View style={styles.activityItem}>
      <Text style={styles.activityTitle}>{item.activity}</Text>
      <Text style={styles.activityDescription}>{item.description}</Text>
      <Text style={styles.activityTimestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
      <View style={styles.activityButtons}>
        <TouchableOpacity onPress={() => handleEditActivity(item)}>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleRemoveActivity(item.key)}>
          <Text style={styles.removeButton}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
      },
    ],
  };

  const barChartData = {
    labels: ['Project Alpha', 'Project Beta', 'Project Gamma'],
    datasets: [
      {
        data: [5000, 3000, 7000],
      },
    ],
  };

  const pieChartData = [
    {
      name: 'High Quality',
      population: 8,
      color: '#FFD700',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Medium Quality',
      population: 1,
      color: '#ADD8E6',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  const progressChartData = {
    labels: ['Tasks Completed'],
    data: [0.75],
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading user data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleProfileImagePress}>
          {profileImageUri ? (
            <Image source={{ uri: profileImageUri }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileImagePlaceholderText}>Add Profile Picture</Text>
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.welcomeText}>Welcome Back {username}</Text>
      </View>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <Text style={styles.statTitle}>{stat.title}</Text>
            <ProgressBar progress={stat.value / stat.total} style={styles.progressBar} />
            <Text style={styles.statValue}>{stat.value}/{stat.total}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        
        <FlatList
          data={activities}
          keyExtractor={(item) => item.key}
          renderItem={renderActivityItem}
        />

        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>Add Activity</Text>
        </TouchableOpacity>

        <Modal visible={isModalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.input}
              placeholder="Activity"
              value={newActivity}
              onChangeText={setNewActivity}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={activityDescription}
              onChangeText={setActivityDescription}
            />
            <Button title={editActivity ? "Update Activity" : "Add Activity"} onPress={editActivity ? handleUpdateActivity : handleAddActivity} />
            <Button title="Cancel" onPress={() => { setModalVisible(false); setEditActivity(null); setNewActivity(''); setActivityDescription(''); }} />
          </View>
        </Modal>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Monthly Performance</Text>
        <LineChart
          data={lineChartData}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: '6', strokeWidth: '2', stroke: '#ffa726' },
          }}
          bezier
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project Budgets</Text>
        <BarChart
          data={barChartData}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: '6', strokeWidth: '2', stroke: '#ffa726' },
          }}
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Product Quality</Text>
        <PieChart
          data={pieChartData}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: '6', strokeWidth: '2', stroke: '#ffa726' },
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Task Progress</Text>
        <ProgressChart
          data={progressChartData}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: '6', strokeWidth: '2', stroke: '#ffa726' },
          }}
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5FCFF', padding: 10 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  profileImagePlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' },
  profileImagePlaceholderText: { color: '#fff', textAlign: 'center' },
  welcomeText: { marginLeft: 20, fontSize: 24 },
  statsContainer: { marginBottom: 20 },
  statItem: { marginBottom: 10 },
  statTitle: { fontSize: 16, fontWeight: 'bold' },
  progressBar: { height: 10, borderRadius: 5, marginTop: 5 },
  statValue: { marginTop: 5 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 20, marginBottom: 10 },
  activityItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  activityTitle: { fontSize: 16, fontWeight: 'bold' },
  activityDescription: { marginTop: 5 },
  activityTimestamp: { marginTop: 5, fontSize: 12, color: '#888' },
  activityButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  editButton: { color: 'blue' },
  removeButton: { color: 'red' },
  addButton: { backgroundColor: 'blue', padding: 10, borderRadius: 5, marginTop: 10 },
  addButtonText: { color: 'white', textAlign: 'center' },
  modalContainer: { padding: 20, backgroundColor: '#fff', flex: 1 },
  input: { borderColor: '#ccc', borderWidth: 1, padding: 10, marginBottom: 10 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 18, color: '#555' },
});

export default DashboardScreen;
