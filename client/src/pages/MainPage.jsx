import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircleQuestion } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Chat from '../components/Chat';
import Button from '../components/UI/Button';

export default function MainPage() {
    const navigate = useNavigate();
    const goToSettings = () => {
        navigate('/settings');
    }
    const [isOpen, setIsOpen] = useState(false);
    const toggleChat = () => {
        setIsOpen(!isOpen);
    }
    return (
        <div className='flex flex-col items-center h-screen bg-gradient-to-r from-[#100017] via-[#180021] to-[#22002e]'>
            <h2 onClick={goToSettings} className='text-[50px] text-[#00ddd2] duration-300 hover:text-[#39a7a1]'>Settings</h2>
            <div className='flex justify-end items-end w-screen h-full'>
                <Button>
                    <MessageCircleQuestion className='text-[#00ddd2] duration-300 hover:text-[#39a7a1]' onClick={toggleChat} size={60} />
                </Button>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            transition={{ duration: 0.3 }}
                            className='h-[550px] w-[450px] rounded-tl-[20px] bg-[#100017] absolute bottom-[60px]'
                        >
                            <header className='flex justify-center rounded-tl-[20px] bg-[#281d2e]'>
                                <h2 className='text-[30px] text-[#6bfff8]'>Support</h2>
                            </header>
                            <Chat />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
