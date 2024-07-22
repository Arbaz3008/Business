import { firestore } from '../../../firebase'; // Ensure this path is correct
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';

export const SET_MESSAGES = 'SET_MESSAGES';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const DELETE_MESSAGE = 'DELETE_MESSAGE';
export const UPDATE_MESSAGE = 'UPDATE_MESSAGE';

export const fetchMessages = () => async (dispatch) => {
  try {
    console.log('Fetching messages');
    const messagesCollection = collection(firestore, 'messages');
    const snapshot = await getDocs(messagesCollection);
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    dispatch({ type: SET_MESSAGES, payload: messages });
  } catch (error) {
    console.error("Error fetching messages: ", error);
  }
};

export const addMessage = (message) => async (dispatch) => {
  try {
    console.log('Adding message:', message);
    const messagesCollection = collection(firestore, 'messages');
    const docRef = await addDoc(messagesCollection, message);
    const newMessage = { id: docRef.id, ...message };
    console.log('Message added with ID:', docRef.id);
    dispatch({ type: ADD_MESSAGE, payload: newMessage });
  } catch (error) {
    console.error("Error adding message: ", error);
  }
};

export const deleteMessage = (id) => async (dispatch) => {
  try {
    console.log('Deleting message with ID:', id);
    const messageRef = doc(firestore, 'messages', id);
    await deleteDoc(messageRef);
    dispatch({ type: DELETE_MESSAGE, payload: id });
  } catch (error) {
    console.error("Error deleting message: ", error);
  }
};

export const updateMessage = (id, updatedText) => async (dispatch) => {
  try {
    console.log('Updating message with ID:', id);
    const messageRef = doc(firestore, 'messages', id);
    await updateDoc(messageRef, { text: updatedText });
    dispatch({ type: UPDATE_MESSAGE, payload: { id, text: updatedText } });
  } catch (error) {
    console.error("Error updating message: ", error);
  }
};

export const subscribeMessages = () => (dispatch) => {
  console.log('Subscribing to messages');
  const messagesCollection = collection(firestore, 'messages');
  const unsubscribe = onSnapshot(messagesCollection, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    dispatch({ type: SET_MESSAGES, payload: messages });
  });

  return () => {
    console.log('Unsubscribing from messages');
    unsubscribe();
  };
};
