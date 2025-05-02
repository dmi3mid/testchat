import React from 'react'

export default function Message({from, text, isAdmin}) {
    const userMessage = 'w-[250px] rounded-tl-[10px] rounded-tr-[10px] rounded-br-[10px] break-words inline-block ml-[15px] mt-[10px] mb-[10px] p-[10px] bg-[#281d2e]';
    const adminMessage = 'w-[250px] rounded-tl-[10px] rounded-tr-[10px] rounded-br-[10px] break-words inline-block ml-[15px] mt-[10px] mb-[10px] p-[10px] bg-[#242424]';

    return (
        <div className={isAdmin ? adminMessage : userMessage}>
            <h2 className='text-[18px] text-[#aa00d4]'>{from}</h2>
            <p className='text-[15px] text-[#aa00d4]'>{text}</p>
        </div>
    )
}
