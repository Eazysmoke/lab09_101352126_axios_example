import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import PersonList from './PersonList.jsx';
import './styles.css';

function App() {
  return (
    <>
      <header className="bg-success text-white text-center py-3">
        <h1 className="h2 mb-0">User List</h1>
      </header>
      <main className="container-fluid px-3 py-3">
        <PersonList />
      </main>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
