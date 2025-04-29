import React, { use, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client';
import axios from 'axios';

// Create singleton instances for both sockets
let apiSocketInstance = null;
let ownSocketInstance = null;

export default function useChat() {
    const [messages, setMessages] = useState([]);
    const [key, setKey] = useState('');

    // Initialize own socket connection once
    useEffect(() => {
        if (!ownSocketInstance) {
            ownSocketInstance = io("http://localhost:2300");
            
            ownSocketInstance.on('connect', () => {
                console.log('Connected to own server with ID:', ownSocketInstance.id);
            });

            ownSocketInstance.on('connect_error', (err) => {
                console.error('Own server connection error:', err.message);
            });
        }
    }, []);
    
    // Handle API socket connection
    useEffect(() => {
        // If we already have a socket instance and the key hasn't changed, don't create a new one
        if (apiSocketInstance && apiSocketInstance.connected) {
            return;
        }

        // If we have a key, create or reconnect the API socket
        if (key) {
            // Disconnect existing socket if it exists
            if (apiSocketInstance) {
                apiSocketInstance.disconnect();
            }

            // Create new socket connection
            apiSocketInstance = io("http://localhost:2500", {
                auth: {
                    token: key,
                },
            });

            apiSocketInstance.on('connect', () => {
                console.log('Connected to API server with ID:', apiSocketInstance.id);
            });

            apiSocketInstance.on('connect_error', (err) => {
                console.error('API server connection error:', err.message);
            });
        }

        // Cleanup function - only disconnect if the key is being cleared
        return () => {
            if (!key && apiSocketInstance) {
                apiSocketInstance.disconnect();
            }
        };
    }, [key]);

    // Fetch initial messages and key
    useEffect(() => {
        const getMessages = async () => {
            const response = await axios.get('http://localhost:2300/getMessages');
            const messagesData = response.data;
            messagesData.forEach(message => setMessages(prev => [...prev, message]))
        }
        getMessages();

        const getKey = async () => {
            const response = await axios.get('http://localhost:2300/getKey');
            const keyData = response.data;
            if (keyData.length > 0) {
                setKey(keyData[0].token);
            }
        }
        getKey();
    }, []);

    const sendKey = async (key) => {
        setKey(key);
        const response = await axios.post('http://localhost:2300/auth', { token: key });
    }

    const getMessage = (message) => {
        setMessages(prev => [...prev, message]);
        
        if (ownSocketInstance?.connected) {
            ownSocketInstance.emit('user-message', JSON.stringify(message));
        } else {
            console.warn("Own socket is not connected");
        }
        
        if (apiSocketInstance?.connected) {
            apiSocketInstance.emit('webuser-message', JSON.stringify(message));
        } else {
            console.warn("API socket is not connected");
        }
    }

    return {
        messages,
        setMessages,
        key,
        setKey,
        sendKey,
        getMessage,
    }
}
