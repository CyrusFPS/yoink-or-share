import { useHistory } from 'react-router';
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import UserContext from '../contexts/user';

const Lobby = () => {
  let history = useHistory();
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  const checkForAuth = async () => {
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

  const createNewRoom = async () => {
    const roomsCreateURL = "http://localhost:4000/api/v1/rooms/create"
    const result = await axios.post(roomsCreateURL, { user });

    if (!result.data.room) return alert("Unable to create new room. You can't have more than one room open at a time.");
    setUser({ ...user, room: result.data.room });
    history.push(`/rooms/${result.data.room._id}`);
  }

  const joinUserRoom = () => {
    history.push(`/rooms/${user.room}`)
  }
  
  if (!loading && !user.auth && user.auth !== undefined) history.push('/login');

  return (
    <div>
      <h1 onClick={() => console.log(user)}>Welcome to the lobby</h1>
      <button onClick={createNewRoom}>New room</button>
      { user.room ? <button onClick={joinUserRoom}>Join my room</button> : ""}
    </div>
  )
}

export default Lobby
