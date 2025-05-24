import axios from 'axios';
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux';
import App from 'src/App'
import 'src/index.css';
import { getBaseURL } from 'src/utils/commonUtils';
import store from 'src/redux/store';
import { ToastContainer } from 'react-toastify';

axios.defaults.baseURL = getBaseURL();

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer />
    </Provider>
  </React.StrictMode>
)
