import { io } from 'socket.io-client';

let socket = null;

export const initSocket = (token) => {
    if (!socket) {
        socket = io('http://localhost:2500', {
            auth: { token }
        });

        socket.on('connect', () => {
            console.log('✅ Підключено до сокета з ID:', socket.id);
        });

        socket.on('connect_error', (err) => {
            console.error('❌ Помилка підключення:', err.message);
        });
    }

    return socket;
};

export const getSocket = () => socket;