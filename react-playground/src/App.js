import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './components/Login';
import LoginSuccess from './components/LoginSuccess';
import Home from './components/Home';
import { UserProvider } from './contexts/user';
import React, { useState } from 'react';

function App() {
  const [user, setUser] = useState({});

  return (
    <Router>
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
        </Switch>
      </UserProvider>
    </Router>
  );
}

export default App;
