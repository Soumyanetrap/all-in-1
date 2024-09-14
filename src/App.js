import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/Dashboard/Dashboard';
import Finance from './components/Finance/Finance';
import Banks from './components/Banks/Banks';
import AddAccount from './components/Add_Accounts/Add_Accounts';
import Tickets from './components/Tickets/Tickets';
import RaiseTickets from './components/Raise_Tickets/RaiseTickets';
import Connections from './components/Connections/Connections';
import PendingRequests from './components/Pending_Requests/PendingRequests';
import './App.css'; 
import PendingTickets from './components/PendingTickets/PendingTickets';
import ResolveRequests from './components/Resolved_Requests/ResolveRequests';
import ResolvedTickets from './components/Resolved_Tickets/ResolvedTickets';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>All in 1</h1>
      </header>
      <main className="App-Main">
        <Router basename={process.env.PUBLIC_URL}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/banks" element={<Banks />} />
            <Route path="/connect" element={<Connections />} />
            <Route path="/add_ac" element={<AddAccount />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/iraise" element={<RaiseTickets />} />
            <Route path="/ipending" element={<PendingRequests />} />
            <Route path="/iresolved" element={<ResolveRequests />} />
            <Route path="/pending" element={<PendingTickets />} />
            <Route path="/resolved" element={<ResolvedTickets />} />
          </Routes>
        </Router>
      </main>
    </div>
  );
}

export default App;
