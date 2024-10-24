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
import PendingTickets from './components/PendingTickets/PendingTickets';
import ResolveRequests from './components/Resolved_Requests/ResolveRequests';
import ResolvedTickets from './components/Resolved_Tickets/ResolvedTickets';
import Travel from './components/Travel/Travel';
import Trips from './components/Trip/Trips';
import PlanTrips from './components/Plan_Trips/PlanTrips';
import UcTrips from './components/Uc_Trips/UcTrips';
import TripContainer from './components/Trip_Container/TripContainer';
import Vacation from './components/Vacation/Vacation';
import PlanVacation from './components/Plan_Vacation/PlanVacation';
import UcVacations from './components/Uc_Vacations/UcVacations';
import VacationContainer from './components/Vacation_Container/VacationContainer';
import WorkInProgress from './components/WIP/progress'; // Import the new component
import './App.css'

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
            <Route path="/iresolved" element={<ResolveRequests />} />
            <Route path="/pending" element={<PendingTickets />} />
            <Route path="/resolved" element={<ResolvedTickets />} />
            <Route path="/travel" element={<Travel />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/plan_trip" element={<PlanTrips />} />
            <Route path="/uc_trips" element={<UcTrips />} />
            <Route path="/trip_container" element={<TripContainer />} />
            <Route path="/vacation" element={<Vacation />} />
            <Route path="/plan_vac" element={<PlanVacation />} />
            <Route path="/uc_vac" element={<UcVacations />} />
            <Route path="/vacation_container" element={<VacationContainer />} />
            <Route path="*" element={<WorkInProgress />} />  {/*Catch-all route */}
          </Routes>
        </Router>
      </main>
    </div>
  );
}

export default App;
