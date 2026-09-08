/**
 * Entry point.
 *
 * The app is a client-rendered single page: this mounts it into the shell in
 * standalone/index.html. Fonts are embedded in app/fonts.css, so nothing here
 * needs a network at runtime.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Home from '../app/page';
import '../app/globals.css';
import '../app/experience.css';
import '../app/fonts.css';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root');
createRoot(root).render(
  <StrictMode>
    <Home />
  </StrictMode>,
);
