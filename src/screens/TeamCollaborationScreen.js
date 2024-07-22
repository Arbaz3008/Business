import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, subscribeMessages } from '../redux/actions/action';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';

const MessageScreen = () => {
  const dispatch = useDispatch();
  const messages = useSelector(state => state.messages);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    const unsubscribe = dispatch(subscribeMessages());
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [dispatch]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage = {
        text: messageText,
        timestamp: new Date()
      };
      dispatch(addMessage(newMessage));
      setMessageText('');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message"
        />
        <Button title="Send" onPress={handleSendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  messageList: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
});

export default MessageScreen;
