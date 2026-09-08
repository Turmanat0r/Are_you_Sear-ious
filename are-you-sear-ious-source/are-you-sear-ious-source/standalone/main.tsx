/**
 * Entry point for the standalone static build.
 *
 * The hosted app renders through vinext, whose root layout depends on
 * `next/font/google`. This build skips that layout and mounts the page
 * directly, so the bundle carries no framework-server code. Fonts come from
 * app/fonts.css instead, which embeds them and needs no network.
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
