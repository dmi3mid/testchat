import React, { useEffect, useState } from 'react'

import useChat from '../hooks/useChat'

import Message from './Message';
import SendMsgFrom from './SendMsgFrom'
import Button from './UI/Button';

export default function Chat() {
    const {
        messages, setMessages,
        getMessage,
    } = useChat();

    const [start, setStart] = useState(false)

    // Automatically update start state based on messages
    useEffect(() => {
        setStart(messages.length > 0);
    }, [messages]);

    return (
        <div className="flex flex-col justify-end h-[504px]">
            {start
                ? <>
                    <div className="flex-1 overflow-y-auto">
                        {messages.map((msg, id) => (
                            <Message key={id} from={msg.username} text={msg.text} isAdmin={msg.from_admin} />
                        ))}
                    </div>
                    <SendMsgFrom getMessage={getMessage} />
                </>
                : <Button onClick={() => getMessage(
                    {
                        text: 'start',
                        from_admin: false,
                        date: Date.now(),
                    }
                )} styles={'text-[25px] text-[#0f0d0f] font-[Ubuntu] font-[500] w-[100%] bg-[#00e4d8] duration-300 hover:opacity-80'}>Start</Button>
            }
        </div>
    )
}
