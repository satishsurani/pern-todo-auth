import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' 
import { PERSIST } from './../../node_modules/redux-persist/es/constants';

const persistConfig = {
  key: 'root',
  storage,
  whiteList: ['user', 'isAuthenticated '],
}

const persistedReducer = persistReducer(persistConfig, authReducer)

const store = configureStore({
  reducer: {
    auth: persistedReducer, // Add the auth reducer here
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck:{
      ignoreActions:['persist/PERSIST','persist/REHYDRATE']
    }
  })
});

export const persistor = persistStore(store);;

export default store;  