import React from 'react'

const Users = ({ room, setRoom, socket }) => {
  if (socket) {
    socket.on("user_leave", (newRoom) => {
      setRoom(newRoom);
    });
  }
  
  const users = room.users;

  return (
    <div>
      <h2>Users:</h2>
      <ul>
        {users.map(user => <li key={user}>{user}</li>)}
      </ul>
    </div>
  )
}

export default Users
