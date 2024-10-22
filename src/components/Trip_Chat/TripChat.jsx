import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegPaperPlane } from 'react-icons/fa';
import ChatMessage from '../Chat/ChatMessage';
import './TripChat.css';
import { encrypt, decrypt } from '../../utils/decryptor';
import {REACT_APP_API_URL,REACT_APP_WEBSOCKET_URL,REACT_APP_MASTER_KEY} from '../../config'


const TripChat = ({ trip, onWsOpen, showChat }) => {
    const apiUrl = REACT_APP_API_URL;
    const wsUrl = REACT_APP_WEBSOCKET_URL;
    const masterKey = REACT_APP_MASTER_KEY;
    const navigate = useNavigate();
    const [userid, setUserid] = useState('');
    const [auth_key, setAuthKey] = useState('');
    const [messages, setMessages] = useState([]);
    const [replyOf, setReploOf] = useState(null);
    const [ws, setWebsocket] = useState();
    const [editChat, setEditChat] = useState(false);
    const messageRef = useRef();
    const chatContainerRef = useRef(); // Ref for the chat container

    // Scroll to bottom function
    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    // Scroll to bottom on initial load
    useEffect(() => {
        if(showChat)
            scrollToBottom();
    }, [showChat]);

    useEffect(() => {
        if(showChat)
            scrollToBottom();
    }, [messages, showChat]);

    // WebSocket setup
    useEffect(() => {
        const websocket = new WebSocket(wsUrl+`?trip_id=${trip.trip_id}`);
        setWebsocket(websocket);
    }, [wsUrl, trip.trip_id]);
    
    useEffect(() => {
        if (ws) {
            ws.onopen = () => {
                console.log('Connected to WebSocket server');
                if (onWsOpen) {
                    onWsOpen(ws); // Pass the WebSocket instance to the parent
                }
            };
    
            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    if (message.action === 'new_chat') {
                        // const inner = JSON.parse(message.payload);
                        // console.log(typeof (message.payload))
                        const inner = message.payload
                        const newMessage = {
                            trp_msg_id: inner.trp_msg_id,
                            trip_id: inner.trip_id,
                            sender_id: inner.sender_id,
                            content: decrypt(inner.content, masterKey, inner.auth_key),
                            created_at: inner.created_at,
                            reply_of: inner.reply_of,
                            username: inner.username,
                            auth_key: inner.auth_key
                        };
                        setMessages((prevMessages) => {
                            const existingMessageIndex = prevMessages.findIndex(msg => msg.trp_msg_id === newMessage.trp_msg_id);
                            
                            if (existingMessageIndex > -1) {
                                // If the message exists, replace it
                                const updatedMessages = [...prevMessages];
                                updatedMessages[existingMessageIndex] = newMessage;
                                return updatedMessages;
                            } else {
                                // If the message does not exist, add it
                                return [...prevMessages, newMessage];
                            }
                        });
                    }
                } catch (error) {
                    console.error('Error parsing message', error);
                }
            };
        }
    }, [ws, onWsOpen, masterKey]);
    
    const readMessages = useCallback(async () => {
        const response = await fetch(`${apiUrl}/chat/read_messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ trip_id: trip.trip_id })
        });
    
        const msgs = await response.json();
        const decryptedMessages = msgs.map(msg => ({
            ...msg,
            content: decrypt(msg.content, masterKey, msg.auth_key)
        }));
    
        // Sort decrypted messages by created_at timestamp
        const sortedMessages = decryptedMessages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        setMessages(sortedMessages);
    }, [apiUrl, trip.trip_id, masterKey]);
    
    useEffect(() => {
        const storedState = localStorage.getItem('authState');
        if (storedState) {
            const { user_id, flag, expirationTime, auth_key } = JSON.parse(storedState);
            const currentTime = new Date().getTime();
            if (currentTime > expirationTime || !flag) {
                localStorage.removeItem('authState');
                navigate('/');
            } else {
                setUserid(user_id);
                setAuthKey(auth_key);
            }
        }
    }, [navigate]);

    useEffect(() => {
        readMessages();
    }, [readMessages]);

    const handleSendMessage = async () => {
        const message = messageRef.current.value.trim();
        if (message) {
            const enc_message = encrypt(message, masterKey, auth_key)['encryptedData'];
            const response = await fetch(`${apiUrl}/chat/send_text`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    trip_id: trip.trip_id,
                    sender_id: userid,
                    content: enc_message,
                    reply_of: replyOf
                }),
            });

            if (!response.ok) {
                throw new Error('Trip creation request failed');
            }

            setReploOf(null); // Reset reply state after sending
            messageRef.current.value = ''; // Clear the input after sending
            messageRef.current.focus(); // Keep focus on the textarea
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default behavior of the Enter key
            if (event.shiftKey) {
                // Allow newline if Shift + Enter is pressed
                messageRef.current.value += '\n';
            } else {
                // Call send message if Enter is pressed
                handleSendMessage();
            }
        }
    };

    const handleReply = (msg) => {
        setReploOf(msg.trp_msg_id);
    };

    const handleCancelReply = () => {
        setReploOf(null); // Reset reply state
    };
    

    // Find the message to reply to
    const replyMessage = messages.find(msg => msg.trp_msg_id === replyOf);

    useEffect(() => {
        if (!editChat) {
            const handleClick = (event) => {
                // Prevent focus loss on the textarea
                messageRef.current.focus();
            };
    
            document.addEventListener('click', handleClick);
            return () => {
                document.removeEventListener('click', handleClick);
            };   
        } else {
            const handleBlur = () => {
                messageRef.current.blur(); // Remove focus from the textarea
            };
    
            document.addEventListener('click', handleBlur);
            return () => {
                document.removeEventListener('click', handleBlur);
            };
        }
    }, [editChat]);
    
    useEffect(() => {
        if (!editChat) {
            messageRef.current.focus(); // Bring focus back to textarea when editChat is false
        }
    }, [editChat]);
    
    return (
        <div className="trip-chat">
            <main>
                <h1 className="chat-trips-title">Chat</h1>
                <div className="container">
                    <div className="all-chats" ref={chatContainerRef}>
                        {messages.map((msg, index) => (
                            <ChatMessage key={index} msg={msg} userid={userid} onReply={handleReply} messages={messages} setMessages={setMessages} setEditChat={setEditChat} />
                        ))}
                    </div>
                    <div className='reply-preview'>
                        {replyMessage && (
                            <div className="reply-message-preview">
                                <div>
                                    <strong>{replyMessage.username}:</strong>
                                    <pre>{replyMessage.content}</pre>
                                </div>
                                <button className="cancel-reply" onClick={handleCancelReply}>
                                    &times; {/* This represents the cross icon */}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className='send-chat'>
                        <textarea
                            ref={messageRef}
                            placeholder="Type a message..."
                            className="chat-input"
                            onKeyDown={handleKeyDown} // Attach the key down event handler
                        />
                        <button 
                            onClick={handleSendMessage} 
                            className="send-button"
                        >
                            <FaRegPaperPlane className="send-icon" />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TripChat;
