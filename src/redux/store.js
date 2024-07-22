import { createStore, applyMiddleware } from 'redux'; // Import createStore and applyMiddleware from redux
import { Provider } from 'react-redux'; // Import Provider from react-redux
import {thunk }from 'redux-thunk'; // Import redux-thunk middleware
import rootReducer from './reducers'; // Correct path to reducers

// Debug logs to check imports
console.log('createStore:', createStore); // Should log the createStore function
console.log('applyMiddleware:', applyMiddleware); // Should log the applyMiddleware function
console.log('thunk:', thunk); // Should log the thunk middleware function

// Create the Redux store with the rootReducer and middleware
const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

// Create a StoreProvider component that wraps its children with the Redux Provider
const StoreProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
