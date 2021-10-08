import './App.css';

function App() {
  const redirect = () => {
    window.location.href = 'http://localhost:4000/api/v1/login/discord';
  }

  return (
    <div className="App">
      <h1>Welcome to Yoink or Share!</h1>
      <button onClick={redirect}>Login with Discord</button>
    </div>
  );
}

export default App;
