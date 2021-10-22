import React from 'react';
import socketio from 'socket.io-client';

const socketURL = "http://localhost:4001";

export const socket = socketio(socketURL, {
  withCredentials: true
});

const SocketContext = React.createContext(socket);

export const SocketProvider = SocketContext.Provider;

export default SocketContext;