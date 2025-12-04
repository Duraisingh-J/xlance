import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const root = createRoot(document.getElementById('root'));
// Prevent browser from restoring scroll position on navigation/reload
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  try {
    window.history.scrollRestoration = 'manual';
  } catch (e) {
    // ignore if not allowed
  }
}
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
