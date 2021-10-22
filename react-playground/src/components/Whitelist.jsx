import React, { useState } from 'react'
import axios from 'axios';

const Whitelist = ({ room, setRoom, user, setUser, socket }) => {
  const [newUser, setNewUser] = useState("");

  const whitelistUser = async (e) => {
    e.preventDefault();

    const newRoom = { ...room, whitelist: [...room.whitelist, newUser] };

    setRoom(newRoom)
    setNewUser("");

    console.log(socket);
    socket.emit("whitelist_change", newRoom);
  };

  const unwhitelistUser = async (wUser) => {
    const unwhitelistedUser = wUser;

    if (unwhitelistedUser === room.owner) return alert("Can't unwhitelist the owner");

    const newRoom = { ...room, whitelist: room.whitelist.filter(user => user !== unwhitelistedUser)}
    setRoom(newRoom);

    socket.emit("whitelist_change", newRoom);
  };

  return (
    <div>
      <form>
        <input value={newUser} type="text" name="user" id="user" placeholder="John#1234" onChange={(e) => setNewUser(e.target.value)} />
        <button type="submit" onClick={whitelistUser}>Whitelist user</button>
      </form>

      <p>Whitelist:</p>
      <ul>
        {room.whitelist.map(wUser => <li key={wUser} onClick={() => unwhitelistUser(wUser)}>{wUser}</li>)}
      </ul>
    </div>
  )
}

export default Whitelist
