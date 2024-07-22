import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../firebase'; // Ensure this path is correct
import { login } from '../redux/actions/authActions';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('email');
        const savedPassword = await AsyncStorage.getItem('password');
        if (savedEmail !== null) setEmail(savedEmail);
        if (savedPassword !== null) setPassword(savedPassword);
      } catch (error) {
        console.error('Failed to load credentials', error);
      }
    };

    loadCredentials();
  }, []);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Logged in with:', user.email);
      dispatch(login({ email: user.email }));

      // Save email and password to AsyncStorage
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('password', password);

      navigation.navigate('Main', { screen: 'Dashboard' });
    } catch (error) {
      const errorMessage = error.message;
      Alert.alert('Error', errorMessage);
    }
  };

  const toggleSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={secureTextEntry}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={toggleSecureTextEntry} style={styles.eyeIcon}>
          <Ionicons name={secureTextEntry ? 'eye-off' : 'eye'} size={24} color="gray" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Forget')}>
        <Text style={styles.link}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center"
  },
  input: {
    borderWidth: 2,
    padding: 8,
    marginBottom: 16,
    borderRadius: 30,
    borderColor: 'tomato',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 30,
    borderColor: 'tomato',
    paddingRight: 8,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    padding: 8,
  },
  eyeIcon: {
    marginLeft: 8,
  },
  button: {
    backgroundColor: 'tomato',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 16,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  link: {
    color: 'tomato',
    textAlign: 'center',
    marginVertical: 8,
  },
});

export default LoginScreen;
