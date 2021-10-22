import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './components/Login';
import LoginSuccess from './components/LoginSuccess';
import Home from './components/Home';
import { UserProvider } from './contexts/user';
import { SocketProvider, socket } from './contexts/socket';
import React, { useState } from 'react';
import Lobby from './components/Lobby';
import Room from './components/Room';

function App() {
  const [user, setUser] = useState({});

  return (
    <Router>
      <SocketProvider value={socket}>
        <UserProvider value={{ user, setUser }}>
          <Switch>
            <Route path="/login" exact>
              <Login />
            </Route>
            <Route path="/login/success">
              <LoginSuccess />
            </Route>
            <Route path="/home">
              <Home />
            </Route>
            <Route path="/lobby">
              <Lobby />
            </Route>
            <Route path="/rooms/:id">
              <Room />            
            </Route>
          </Switch>
        </UserProvider>
      </SocketProvider>
    </Router>
  );
}

export default App;
