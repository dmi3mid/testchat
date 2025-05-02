import React, { use, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client';
import axios from 'axios';

// Create singleton instances for both sockets
let apiSocketInstance = null;
// let ownSocketInstance = null;

export default function useChat() {
    const [messages, setMessages] = useState([]);
    const [key, setKey] = useState('');
    const [defaultUser, setDefaultUser] = useState({
        _id: 101010110001,
        username: "default_user",
        isOpened: true,
    });

    // Initialize own socket connection once
    // useEffect(() => {
    //     if (!ownSocketInstance) {
    //         ownSocketInstance = io("http://localhost:2300");
            
    //         ownSocketInstance.on('connect', () => {
    //             console.log('Connected to own server with ID:', ownSocketInstance.id);
    //         });

    //         ownSocketInstance.on('connect_error', (err) => {
    //             console.error('Own server connection error:', err.message);
    //         });
    //     }
    // }, []);
    
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
            apiSocketInstance = io("http://localhost:2800");

            // apiSocketInstance.on('admin-message', (data) => {
            //     const parsedData = JSON.parse(data);
            //     console.log(parsedData);
            //     setMessages(prev => [...prev, parsedData]);
            // });

            // apiSocketInstance.on('admin-closed-chat', (data) => {
            //     const parsedData = JSON.parse(data);
            //     console.log(parsedData);
            //     setMessages(prev => [...prev, parsedData]);
            // })
            // apiSocketInstance.on('connect', () => {
            //     console.log('Connected to API server with ID:', apiSocketInstance.id);
            // });

            // apiSocketInstance.on('connect_error', (err) => {
            //     console.error('API server connection error:', err.message);
            // });
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
        
        // if (ownSocketInstance?.connected) {
        //     ownSocketInstance.emit('user-message', JSON.stringify(message));
        // } else {
        //     console.warn("Own socket is not connected");
        // }
        
        if (apiSocketInstance?.connected) {
            if (message.text === "start") {
                apiSocketInstance.emit('start', JSON.stringify(defaultUser));
            } else {
                apiSocketInstance.emit('user-message', JSON.stringify({...message, username: defaultUser.username, room_id: defaultUser._id}));
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
