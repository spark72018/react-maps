import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import registerServiceWorker from './registerServiceWorker';

const ErrorWrappedApp = <ErrorBoundary><App /></ErrorBoundary>;

ReactDOM.render(ErrorWrappedApp, document.getElementById('root'));
registerServiceWorker();
