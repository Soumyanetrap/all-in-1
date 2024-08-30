// App.js

import React from 'react';

import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './components/Home'; // Make sure to adjust the path if necessary
import Dashboard from './components/Dashboard/Dashboard';
import Finance from './components/Finance/Finance';
import Banks from './components/Banks/Banks';


import './App.css'; // Import the CSS file for styling
import AddAccount from './components/Add_Accounts/Add_Accounts';
import Tickets from './components/Tickets/Tickets';
import RaiseTickets from './components/Raise_Tickets/RaiseTickets';
import Connections from './components/Connections/Connections';
import PendingRequests from './components/Pending_Requests/PendingRequests';


const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>All in 1</h1>
      </header>
      <main className="App-Main">
        <Router>
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
          </Routes>
        </Router>
      </main>
    </div>
  );
}

export default App;
