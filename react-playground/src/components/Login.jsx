import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import UserContext from '../contexts/user';
import '../App.css';

const Login = () => {
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

  const redirectToDiscordSSO = async () => {
    // Setup our timer for purpose stated below 
    let timer = null;

    // Set our discord login URL from our backend and make our new window to use SSO
    const discordLoginURL = "http://localhost:4000/api/v1/login/discord";
    const newWindow = window.open(discordLoginURL, "_blank", "width=700, height=800");

    // Timer to check if window is closed, then will redirect
    if (newWindow) {
      timer = setInterval(async () => {
        if (newWindow.closed) {
          const newUser = await checkForAuth();
          setUser(newUser);
          if (timer) clearInterval(timer);
        }
      }, 500);
    }
  }

  // If the user ever authenticates, whether via login or cookies, redirect them home
  if (!loading && user.auth) history.push('/home');

  return (
    <div className="App">
      <h1>Welcome to Yoink or Share!</h1>
      <button onClick={redirectToDiscordSSO}>Login with Discord</button>
    </div>
  )
}

export default Login
