import React from 'react';
import { Stethoscope } from 'lucide-react';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex items-center">
          <Stethoscope className="h-6 w-6 text-emerald-500 mr-2" />
          <h1 className="text-xl font-semibold text-slate-800">ICU Device Monitoring</h1>
        </div>
      </header>
      
      <main className="container mx-auto py-6 px-4">
        <Dashboard />
      </main>
      
      <footer className="bg-slate-800 text-slate-300 py-4 text-center text-sm">
        <div className="container mx-auto">
          <p>© 2025 Hospital Systems | Real-time ICU Monitoring Dashboard</p>
        </div>
      </footer>
    </div>
  );
}

export default App;