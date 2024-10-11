import React, { useState } from 'react';
import './ChatMessage.css';
import { encrypt } from '../../utils/decryptor';
import {REACT_APP_API_URL, REACT_APP_MASTER_KEY} from '../../config'


const ChatMessage = ({ msg, userid, onReply, messages, setMessages, setEditChat }) => {
    const apiUrl = REACT_APP_API_URL
    const masterKey = REACT_APP_MASTER_KEY;

    const messageClass = msg.sender_id === userid ? 'sent' : 'received';
    const [menuVisible, setMenuVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(msg.content);

    const handleToggleMenu = () => {
        setMenuVisible(prev => !prev);
    };

    const handleReply = () => {
        onReply(msg); // Trigger reply action
        setMenuVisible(false); // Hide the menu after replying
    };

    const handleEdit = () => {
        setEditChat(true);
        setIsEditing(true);
        setMenuVisible(false); // Hide the menu after selecting edit
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(apiUrl + "/chat/delete", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trp_msg_id: msg.trp_msg_id })
            });
    
            if (!response.ok) {
                throw new Error("Failed to Delete Chat");
            }
    
            // Remove the deleted message from the messages array
            setMessages(prevMessages => prevMessages.filter(message => message.trp_msg_id !== msg.trp_msg_id));
            setMenuVisible(false);
            
        } catch (error) {
            console.error(error);
        }
    };
    

    const handleInputChange = (e) => {
        setEditedContent(e.target.value);
    };

    const updateChanges = async (content) => {
        try {
            const response = await fetch(apiUrl + "/chat/edit", {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    trp_msg_id: msg.trp_msg_id,
                    content: encrypt(content, masterKey, msg.auth_key)['encryptedData']
                })
            })
            if (!response.ok) {
                throw new Error('Failed to Edit Chat');
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                // Prevent the default action (adding a new line) when Shift is pressed
                e.preventDefault();
                setEditedContent(prev => prev + '\n'); // Add a newline character
            } else {
                // When Enter is pressed without Shift
                if (editedContent !== msg.content) {
                    await updateChanges(editedContent)
                }
                setIsEditing(false);
                setEditChat(false);
            }
        }
    };
    

    const replyMessage = messages.find(message => message.trp_msg_id === msg.reply_of);

    return (
        <div className={`chat-message ${messageClass}`}>
            {replyMessage && (
                <div className="reply-message">
                    <strong>{replyMessage.username}:</strong>
                    <pre>{replyMessage.content}</pre>
                </div>
            )}
            <div className="message-content">
                <strong className="username">{msg.username}</strong>
                <button className="toggle-menu" onClick={handleToggleMenu}>
                    {menuVisible ? '^' : 'v'}
                </button>
            </div>
            <div className={`context-menu ${menuVisible ? 'show' : ''}`}>
            {messageClass === 'sent'?
                <ul>
                    <li onClick={handleReply}>Reply</li>
                    <li onClick={handleEdit}>Edit</li>
                    <li onClick={handleDelete}>Delete</li>
                    </ul> :
                    <ul>
                        <li onClick={handleReply}>Reply</li>
                    </ul> 
            }
            </div>
            {isEditing ? (
                <textarea 
                    value={editedContent} 
                    onChange={handleInputChange} 
                    onKeyDown={handleKeyDown} 
                    autoFocus 
                />
            ) : (
                <pre>{msg.content}</pre>
            )}
        </div>
    );
};

export default ChatMessage;
