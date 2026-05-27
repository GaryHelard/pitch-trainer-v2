import { useState } from 'react';

import RehearseScreen from './screens/RehearseScreen';

import './App.css';

const TABS = [
  'Rehearse',
  'Pitch',
  'History',
  'Settings',
];

export default function App() {
  const [tab, setTab] = useState('Rehearse');

  return (
    <div className="app">
      <main className="main">
        {tab === 'Rehearse' && (
          <RehearseScreen />
        )}

        {tab !== 'Rehearse' && (
          <div className="placeholder-screen">
            <h1>{tab}</h1>
            <p>{tab} screen coming next.</p>
          </div>
        )}
      </main>

      <nav className="bottom-nav">
        {TABS.map((item) => (
          <button
            key={item}
            className={
              tab === item
                ? 'nav-button active'
                : 'nav-button'
            }
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </nav>
    </div>
  );
}