import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import '../App.css';

const Login = () => {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Async function to call API cause useEffect doesn't allow async
    const fetchUserData = async () => {
      const userAuthURL = "http://localhost:4000/api/v1/auth/user";
      // Check if user is authenticated with credentials (cookie/session)
      const isUserAuthed = await axios.get(userAuthURL, { withCredentials: true });
      // Set the authentication status on frontend to what it is on backend
      setIsAuth(isUserAuthed.data.auth);
    }

    // Call the function! 
    fetchUserData();
  }, []);

  const redirectToDiscordSSO = async () => {
    // Setup our timer for purpose stated below 
    let timer = null;

    // Set our discord login URL from our backend and make our new window to use SSO
    const discordLoginURL = "http://localhost:4000/api/v1/login/discord";
    const newWindow = window.open(discordLoginURL, "_blank", "width=700, height=800");

    // Timer to check if window is closed, then will redirect
    if (newWindow) {
      timer = setInterval(() => {
        if (newWindow.closed) {
          setIsAuth(true);
          if (timer) clearInterval(timer);
        }
      }, 500);
    }
  }

  // If the user ever authenticates, whether via login or cookies, redirect them home
  if (isAuth) return <Redirect to="/home" />

  return (
    <div className="App">
      <h1>Welcome to Yoink or Share!</h1>
      <button onClick={redirectToDiscordSSO}>Login with Discord</button>
    </div>
  )
}

export default Login
