import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client';
import axios from 'axios';

// Create singleton instance for socket
let apiSocketInstance = null;

export default function useChat() {
    const [messages, setMessages] = useState(() => {
        // Initialize messages from localStorage if available
        const savedMessages = localStorage.getItem('chatMessages');
        return savedMessages ? JSON.parse(savedMessages) : [];
    });
    const [key, setKey] = useState('');
    const [defaultUser] = useState({
        _id: 101010110001,
        username: "default_user",
        isOpened: true,
    });

    // Save messages to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }, [messages]);
    
    // Handle API socket connection
    useEffect(() => {
        // If we already have a socket instance and the key hasn't changed, don't create a new one
        if (apiSocketInstance && apiSocketInstance.connected) {
            return;
        }

        // Create new socket connection
        apiSocketInstance = io("http://localhost:2800");

        // Set up event listeners
        apiSocketInstance.on('connect', () => {
            console.log('Connected to API server with ID:', apiSocketInstance.id);
        });

        apiSocketInstance.on('connect_error', (err) => {
            console.error('API server connection error:', err.message);
        });

        apiSocketInstance.on('admin-message', (data) => {
            try {
                const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
                setMessages(prev => [...prev, parsedData]);
            } catch (error) {
                console.error('Error parsing admin message:', error);
            }
        });

        // Cleanup function
        return () => {
            if (apiSocketInstance) {
                apiSocketInstance.disconnect();
            }
        };
    }, []);

    // Fetch initial key
    useEffect(() => {
        const getKey = async () => {
            try {
                const response = await axios.get('http://localhost:2300/getKey');
                const keyData = response.data;
                if (keyData.length > 0) {
                    setKey(keyData[0].token);
                }
            } catch (error) {
                console.error('Error fetching key:', error);
            }
        }
        getKey();
    }, []);

    const sendKey = async (key) => {
        try {
            setKey(key);
            await axios.post('http://localhost:2300/auth', { token: key });
        } catch (error) {
            console.error('Error sending key:', error);
        }
    }

    const getMessage = (message) => {
        setMessages(prev => [...prev, message]);
        
        if (apiSocketInstance?.connected) {
            if (message.text === "start") {
                apiSocketInstance.emit('start', JSON.stringify(defaultUser));
            } else {
                apiSocketInstance.emit('user-message', JSON.stringify({
                    ...message,
                    username: defaultUser.username,
                    room_id: defaultUser._id
                }));
            }
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
