import React, { use, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client';
import axios from 'axios';

export default function useChat() {
    const socketOwnRef = useRef(null);
    const socketApiRef = useRef(null);
    const [messages, setMessages] = useState([]);

    const [key, setKey] = useState('');


    useEffect(() => {
        const socketOwn = io("http://localhost:2300");
        socketOwnRef.current = socketOwn;
    }, []);
    
    useEffect(() => {
        const socketApi = io("http://localhost:2500", {
            auth: {
                token: key,
            },
        });
        socketApiRef.current = socketApi;
        
        socketApi.on('connect', () => {
            console.log('Підключено до сервера з ID:', socketApi.id);
            console.log(socketApiRef);
        });

        socketApi.on('connect_error', (err) => {
            console.error('Помилка підключення:', err.message);
        });
    }, [key]);

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
            console.log(keyData);
            setKey(keyData[0].token);
        }
        getKey();
    }, []);

    const sendKey = async (key) => {
        setKey(key);
        const response = await axios.post('http://localhost:2300/auth', { token: key });
    }
    

    const getMessage = (message) => {
        console.log(message);
        setMessages(prev => [...prev, message]);
        socketOwnRef.current.emit('user-message', JSON.stringify(message));
        console.log(key);
        if (socketApiRef.current?.connected) {
            socketApiRef.current.emit('webuser-message', JSON.stringify(message));
        } else {
            console.warn("Сокет API ще не підключено");
        }
    }


    return {
        messages, setMessages,
        key, setKey,
        sendKey,
        getMessage,
    }
}
