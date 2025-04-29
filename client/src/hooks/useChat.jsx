import React, { useState } from 'react'

export default function useChat() {
    const [messages, setMessages] = useState([
        {
            from: "admin",
            text: "text 1",
            isAdmin: true,
        },
        {
            from: "admin",
            text: "text 2",
            isAdmin: true,
        },
        {
            from: "user",
            text: "text 3",
            isAdmin: false,
        },
        {
            from: "user",
            text: "text 4",
            isAdmin: false,
        }
    ]);
    
    const getMessage = (message) => {
        console.log(message);
        setMessages(prev => [...prev, message])
    }


    return {
        messages, setMessages,
        getMessage,
    }
}
