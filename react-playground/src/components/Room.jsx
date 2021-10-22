import { useHistory } from 'react-router';
import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router'
import UserContext from '../contexts/user';
import Game from './Game';
import axios from 'axios';

const Room = () => {
  let history = useHistory();
  const { id } = useParams();
  const { user, setUser } = useContext(UserContext);
  const [room, setRoom] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchRoom = async () => {
    setLoading(true);

    try {
      const roomURL = `http://localhost:4000/api/v1/rooms/${id}`

      const response = await axios.get(roomURL, { withCredentials: true });

      const newRoom = response.data.room;

      setLoading(false);
      return newRoom;
    } catch (error) {
      setLoading(false);
      
      return false;
    }
  };

  const checkForAuth = async () => {
    setLoading(true);
    if (user.auth) {
      setLoading(false);
      return { ...user, auth: true };
    }

    try {
      const userAuthURL = "http://localhost:4000/api/v1/auth/user";
      
      const response = await axios.get(userAuthURL, { withCredentials: true });
        
      const newUser = { ...response.data.user, auth: true };
    
      setLoading(false);
      return newUser;
    } catch (error) {
      const newUser = { auth: false };

      setLoading(false);
      return newUser;
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      const newUser = await checkForAuth();
      setUser(newUser);
    }

    fetchData(); 
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const newRoom = await fetchRoom();
      setRoom(newRoom);
    }

    fetchData();
  }, []);

  const deleteRoom = async () => {
    const deleteRoomURL = `http://localhost:4000/api/v1/rooms/${id}`;

    const result = await axios.delete(deleteRoomURL, { data: user });

    setUser({ ...user, room: null });
    if (result.data.status === "success") return history.push('/lobby');
  };

  if (`${user.username}#${user.discriminator}` === room.owner) {
    return (
      <div>
        <h1>{room.owner}'s Room</h1>
        <button onClick={deleteRoom}>Delete room</button>

        <Game user={user} setUser={setUser} room={room} setRoom={setRoom} />
      </div>
    )
  }

  if (room.whitelist) {
    const whitelist = room.whitelist || [];
    if (whitelist.includes(`${user.username}#${user.discriminator}`)) {
      return (
        <div>
          <h1>{room.owner}'s Room</h1>
          <Game user={user} setUser={setUser} room={room} setRoom={setRoom} />
        </div>
      )
    }
  }

  return <div>You don't have access to this room.</div>;
}

export default Room
