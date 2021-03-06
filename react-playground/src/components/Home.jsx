import { Link } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import UserContext from '../contexts/user'
import { useHistory } from 'react-router';

const Home = () => {
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  let history = useHistory();

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

  if (!loading && !user.auth && user.auth !== undefined) history.push('/login');

  return (
    <div>
      <h1>Welcome to Yoink or Share! Thanks for signing in.</h1>
      <a href="http://localhost:4000/api/v1/logout">Logout</a>
      <Link to="/lobby">Go to rooms</Link>
    </div>
  )
}

export default Home
