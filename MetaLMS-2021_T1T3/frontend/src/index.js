import React from 'react';
import ReactDOM from 'react-dom';
import 'es6-shim'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import StoreProvider from './utils/store';

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
