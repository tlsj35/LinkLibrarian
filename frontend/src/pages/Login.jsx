import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://linklibrarian-backend-env.eba-fnyxdkdp.us-west-2.elasticbeanstalk.com";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/links");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div className="app-shell">
      <main className="page">
        <div className="form-card">
          <h1>Login</h1>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Login</button>
          </form>

          <p>
            Need an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </main>
    </div>
  );
}