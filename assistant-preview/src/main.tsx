import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App, ASSISTANT_ROUTE } from './App';
import './styles/tokens.css';
import './styles/app.css';

// Single-route preview: every path lands on /assistant.
if (window.location.pathname !== ASSISTANT_ROUTE) {
  window.history.replaceState(null, '', `${ASSISTANT_ROUTE}${window.location.search}`);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
