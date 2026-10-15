import { useState } from "react";
import { useAuth } from "../Hooks/Auth";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const auth = useAuth();
  const navigate = useNavigate();

  const location = useLocation();
  const fromLocation = (location.state as { from?: Location })?.from?.pathname || '/home';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await auth.login(username, password, false);
    if (success) {
      navigate(fromLocation, { replace: true });
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <>
      <form onSubmit={handleLogin}>
        <label>Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <br />
        <label>Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <hr />
        <button type="submit">Login</button>
      </form>
    </>
  )
};
export default Login;
