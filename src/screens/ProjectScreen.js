import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addProject, fetchProjects, setProjects } from '../redux/actions/projectActions';
import { auth } from '../../firebase'; // Assuming you have initialized firestore in firebase.js
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProjectScreen = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.projects);
  const error = useSelector((state) => state.projects.error);
  const [user, setUser] = useState(null);
  const [newProject, setNewProject] = useState({ name: '', description: '', price: '', members: '', duedate: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchAndStoreProjects = async () => {
      if (user) {
        dispatch(fetchProjects());
      }
    };

    fetchAndStoreProjects();
  }, [dispatch, user]);

  useEffect(() => {
    if (projects.length > 0) {
      AsyncStorage.setItem('projects', JSON.stringify(projects));
      setFilteredProjects(projects);
    }
  }, [projects]);

  useEffect(() => {
    const loadProjectsFromStorage = async () => {
      const storedProjects = await AsyncStorage.getItem('projects');
      if (storedProjects) {
        dispatch(setProjects(JSON.parse(storedProjects)));
      }
    };

    loadProjectsFromStorage();
  }, [dispatch]);

  const handleAddProject = async () => {
    try {
      await new Promise(resolve => {
        setTimeout(() => {
          dispatch(addProject(newProject)); // Dispatch action to add project
          setNewProject({ name: '', description: '', price: '', members: '', duedate: '' }); // Clear form
          resolve();
        }, 1000); // Simulate 1 second delay
      });
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project =>
        project.name.toLowerCase().includes(query.toLowerCase()) ||
        project.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="tomato" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
       <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search"
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.searchInput}
        />
        <Icon name="search" size={15} color="black" />
      </View>
      <Text style={styles.title}>You Can Add Information Here</Text>
      <TextInput
        placeholder="Project Name"
        value={newProject.name}
        onChangeText={(text) => setNewProject({ ...newProject, name: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={newProject.description}
        onChangeText={(text) => setNewProject({ ...newProject, description: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Price"
        value={newProject.price}
        onChangeText={(text) => setNewProject({ ...newProject, price: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Members"
        value={newProject.members}
        onChangeText={(text) => setNewProject({ ...newProject, members: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Due Date"
        value={newProject.duedate}
        onChangeText={(text) => setNewProject({ ...newProject, duedate: text })}
        style={styles.input}
      />
      <TouchableOpacity onPress={handleAddProject} style={styles.button}>
        <Text style={styles.buttonText}>Add Project</Text>
      </TouchableOpacity>
     
      <ScrollView style={styles.scrollView}>
        {filteredProjects.map((item) => (
          <Card key={item.id} style={styles.card}>
            <Card.Content>
              <Text style={styles.projectName}>{item.name}</Text>
              <Text style={styles.projectDetail}>{item.description}</Text>
              <Text style={styles.projectDetail}>Price: {item.price}</Text>
              <Text style={styles.projectDetail}>Members: {item.members}</Text>
              <Text style={styles.projectDetail}>Due Date: {item.duedate}</Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'tomato',
    borderWidth: 1,
    borderRadius: 50,
    marginBottom: 10,
    width: '100%',
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'tomato',
    padding: 10,
    borderRadius: 50,
    height: 40,
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'tomato',
    borderRadius: 50,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: '40%',
  },
  searchInput: {
    height: 30,
    flex: 1,
    paddingHorizontal: 10,

  },
  scrollView: {
    width: '100%',
  },
  card: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    elevation: 4,
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  projectDetail: {
    fontSize: 14,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProjectScreen;
