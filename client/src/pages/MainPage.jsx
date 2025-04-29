import React from 'react'

import Chat from '../components/Chat'

export default function MainPage() {
    return (
        <div className='flex flex-col items-center h-screen bg-gradient-to-r from-[#100017] via-[#180021] to-[#22002e]'>
            <h2 className='flex justify-center text-[50px] text-[#6bfff8]'>{"Settings ---->>"}</h2>
            <div className='flex justify-end items-end w-screen h-full'>
                <div className='h-[550px] w-[450px] bg-[#100017]'>
                    <header className='flex justify-center rounded-tl-[20px] bg-[#281d2e]'>
                        <h2 className='text-[30px] text-[#6bfff8]'>Support</h2>
                    </header>
                    <Chat/>
                </div>
            </div>
        </div>
    )
}
