import { StrictMode } from 'react';  // Importing StrictMode to highlight potential problems in the application during development
import { createRoot } from 'react-dom/client';  // Importing createRoot from 'react-dom/client' to render the root component
import './index.css';  // Importing the global CSS file for styling the application
import App from './App.jsx';  // Importing the main App component of the application
import { Provider } from 'react-redux';  // Importing Provider from react-redux to make the Redux store available to the entire app
import store, { persistor } from './redux/store.js';  // Importing the Redux store and persistor for persisting the store's state across sessions
import { PersistGate } from 'redux-persist/integration/react';  // Importing PersistGate to delay the rendering of the app until the persisted state is rehydrated

// Rendering the app inside the root element with the required Redux and persisting setup
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Wrapping the app with Provider to give access to the Redux store */}
    <Provider store={store}>
      {/* Wrapping with PersistGate to ensure the app waits for the persisted state before rendering */}
      <PersistGate loading={null} persistor={persistor}>
        {/* Rendering the main App component */}
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>,
);