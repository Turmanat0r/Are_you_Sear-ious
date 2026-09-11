import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './fonts.css';
import './globals.css';
import './experience.css';
import './recipe-page.css';

const root = document.getElementById('root');
if (!root) throw new Error('Missing recipe root');
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
