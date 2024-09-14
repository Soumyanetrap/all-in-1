import React from 'react';
import './TicketSections.css'; // Import custom styles if needed

const TicketSections = ({ activeSection, newTickets, ticketsUnderway, handleSectionToggle, handleTicketClick }) => {
    return (
        <>
            <section className="ticket-section">
                <h2 
                    className={`section-header ${activeSection === 'New' ? 'active' : ''}`} 
                    onClick={() => handleSectionToggle('New')}
                >
                    New Tickets
                </h2>
                <div className={`section-content ${activeSection === 'New' ? 'show' : ''}`}>
                    <ul>
                        {newTickets.length > 0 ? (
                            newTickets.map(ticket => (
                                <li 
                                    key={ticket.ticket_id} 
                                    className="tickets" 
                                    onClick={() => handleTicketClick(ticket)}
                                >
                                    <span className="subject">{ticket.subject}</span>
                                    <span className="status">{ticket.username}</span>
                                </li>
                            ))
                        ) : (
                            <li className="tickets">No New Tickets</li>
                        )}
                    </ul>
                </div>
            </section>

            <section className="ticket-section">
                <h2 
                    className={`section-header ${activeSection === 'Underway' ? 'active' : ''}`} 
                    onClick={() => handleSectionToggle('Underway')}
                >
                    Tickets Underway
                </h2>
                <div className={`section-content ${activeSection === 'Underway' ? 'show' : ''}`}>
                    <ul>
                        {ticketsUnderway.length > 0 ? (
                            ticketsUnderway.map(ticket => (
                                <li 
                                    key={ticket.ticket_id} 
                                    className="tickets" 
                                    onClick={() => handleTicketClick(ticket)}
                                >
                                    <span className="subject">{ticket.subject}</span>
                                    <span className="status">{ticket.username}</span>
                                </li>
                            ))
                        ) : (
                            <li className="tickets">No Tickets Underway</li>
                        )}
                    </ul>
                </div>
            </section>
        </>
    );
};

export default TicketSections;
