import React from 'react';
import { createRoot } from 'react-dom/client';
import { Watchlist } from '../features/stock_watchlist/Watchlist';

const container = document.getElementById('dashboard-root');
const root = createRoot(container);

document.addEventListener('DOMContentLoaded', () => {
  root.render(<Watchlist />);
});
