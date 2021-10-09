import { Redirect } from 'react-router-dom';
import React, { useContext, useEffect } from 'react'
import axios from 'axios';
import UserContext from '../contexts/user'

const Home = () => {
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    // Async function to call API cause useEffect doesn't allow async
    const fetchUserData = async () => {
      const userAuthURL = "http://localhost:4000/api/v1/auth/user";
      // Check if user is authenticated with credentials (cookie/session)
      const isUserAuthed = await axios.get(userAuthURL, { withCredentials: true });
      // Set the authentication status on frontend to what it is on backend
      setUser({ ...isUserAuthed.data.user, auth: isUserAuthed.data.auth });
      console.log(user);
    }

    // Call the function! 
    fetchUserData();
  }, []);

  if (!user.auth) return <Redirect to="/login" />

  return (
    <div>
      <h1>Welcome to Yoink or Share! Thanks for signing in.</h1>
    </div>
  )
}

export default Home
