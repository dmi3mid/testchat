import React, { useState } from 'react';

import SetTokenFrom from '../components/SetTokenFrom';

export default function SettingsPage() {
    return (
        <div className='flex flex-col items-center justify-center h-screen bg-gradient-to-r from-[#100017] via-[#180021] to-[#22002e]'>
            <SetTokenFrom />
        </div>
    )
}
