import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import configureStore from './store';
import * as tripActions from './store/trips.js'
import * as itineraryActions from './store/itineraries.js'
import './reset.css'

const store = configureStore();

if (import.meta.env.MODE !== "production") {
  // restoreCSRF();
  window.store = store;
  window.tripActions = tripActions;
  window.itineraryActions = itineraryActions;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
