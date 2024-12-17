import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Import the authReducer from the authSlice
import { persistStore, persistReducer } from 'redux-persist'; // Import methods for setting up persistence
import storage from 'redux-persist/lib/storage'; // Import storage engine (localStorage/sessionStorage)

const persistConfig = {
  key: 'root', // The key used to store the persisted state in storage (usually localStorage or sessionStorage).
  storage, // The storage engine (in this case, it's `localStorage` by default).
  whiteList: ['user', 'isAuthenticated'], // Specify which parts of the state should be persisted. In this case, only 'user' and 'isAuthenticated' will be saved.
};

const persistedReducer = persistReducer(persistConfig, authReducer); // Wrap the authReducer with the persistence configuration

// Create the Redux store and apply middleware for serializable checks and persistence.
const store = configureStore({
  reducer: {
    auth: persistedReducer, // Use the persistedReducer for the 'auth' slice
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoreActions: ['persist/PERSIST', 'persist/REHYDRATE'], // Ignore actions related to persistence that may cause serializability warnings
    }
  }),
});

// Create a persistor to persist the store and rehydrate the state during the app lifecycle.
export const persistor = persistStore(store);

// Export the store as default
export default store;