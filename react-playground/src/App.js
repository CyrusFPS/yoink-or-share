import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './components/Login';
import LoginSuccess from './components/LoginSuccess';
import Home from './components/Home';

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
