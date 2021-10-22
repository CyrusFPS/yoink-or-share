import { useHistory } from 'react-router';
import { useEffect, useContext } from 'react';
import Whitelist from './Whitelist';
import Users from './Users';
import React from 'react';
import SocketContext from '../contexts/socket';

const Game = ({ user, setUser, room, setRoom }) => {
  let history = useHistory();
  const socket = useContext(SocketContext);

  useEffect(() => {
    const unlisten = history.listen((location, action) => {
      socket.disconnect();
      unlisten();
    });

    const newRoom = { ...room, users: [...room.users, `${user.username}#${user.discriminator}`] };
    setRoom(newRoom);

    console.log("ROOM JOIN");
    socket.emit("room_join", newRoom);

    socket.on("user_leave", (newRoom) => {
      console.log(`USER LEAVE: ${newRoom}`);
      setRoom(newRoom);
    });

    socket.on("user_join", (newRoom) => {
      console.log(`NEW USER: ${newRoom}`);
      setRoom(newRoom)
    });
  }, []);

  if (room.owner === `${user.username}#${user.discriminator}`) {
    return (
      <div>
        <h1>Game</h1>
        <Whitelist room={room} setRoom={setRoom} user={user} setUser={setUser} socket={socket}/>
        <Users room={room} setRoom={setRoom} socket={socket}/>
      </div>
    )
  }

  return (
    <div>
      <h1>Game</h1>
      <Users room={room} setRoom={setRoom} socket={socket}/>
    </div>
  )
}

export default Game
