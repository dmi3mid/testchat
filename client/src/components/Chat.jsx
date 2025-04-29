import React from 'react'

import useChat from '../hooks/useChat'

import Message from './Message';
import SendMsgFrom from './SendMsgFrom'

export default function Chat() {
    const {
        messages, setMessages,
        getMessage,
    } = useChat();
    return (
        <div className="flex flex-col justify-end h-[504px]">
            <div className="flex-1 overflow-y-auto">
                {messages.map((msg, id) => (
                    <Message key={id} from={msg.from} text={msg.text} isAdmin={msg.isAdmin} />
                ))}
            </div>
            <SendMsgFrom getMessage={getMessage} />
        </div>
    )
}
