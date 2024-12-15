import { io } from "socket.io-client"

export const socket = io("https://api-queue.nudriin.space", {
    transports: ["websocket", "polling"],
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    secure: true,
    rejectUnauthorized: false,
})
