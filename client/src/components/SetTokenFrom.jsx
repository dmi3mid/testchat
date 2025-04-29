import React, {useState} from 'react';

import useChat from '../hooks/useChat';

import Input from './UI/Input';
import Button from './UI/Button';


export default function SetTokenFrom() {
    const { sendKey } = useChat();

    const [inputKey, setInputKey] = useState('');

    const connect = (ev) => {
        ev.preventDefault();
        sendKey(inputKey);
        setInputKey('');
    }
    return (
        <form onSubmit={connect} className='flex justify-center h-[30px] w-[80%]'>
            <Input
                placeholder="Type..."
                value={inputKey}
                onChange={(ev) => setInputKey(ev.target.value)}
                styles="rounded-tl-[10px] rounded-bl-[10px] text-[20px] text-[#AAAAAA] font-[Ubuntu] font-[500] w-[90%] pl-[10px] bg-[#222222]"

            />
            <Button styles="rounded-tr-[10px] rounded-br-[10px] text-[20px] text-[#0f0d0f] font-[Ubuntu] font-[500] w-[10%] bg-[#00e4d8] duration-300 hover:opacity-80">connect</Button>
        </form>
    )
}
