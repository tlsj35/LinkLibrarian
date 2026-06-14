require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./db");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174"
    "https://main.d11lmsuut6qkjv.amplifyapp.com/login"
  ],
  credentials: true,
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("LinkLibrarian Backend Running");
});

function requireLogin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hashedPassword],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Registration failed" });
      }

      res.json({ message: "User registered successfully" });
    }
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Login failed" });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.SESSION_SECRET,
        { expiresIn: "2h" }
      );

      res.json({
        message: "Login successful",
        token,
        userId: user.id,
      });
    }
  );
});

app.post("/logout", (req, res) => {
  res.json({ message: "Logged out" });
});

app.get("/links", requireLogin, (req, res) => {
  db.query(
    "SELECT * FROM links WHERE user_id = ? ORDER BY created_at DESC",
    [req.userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Failed to load links" });
      res.json(results);
    }
  );
});

app.post("/links", requireLogin, (req, res) => {
  const { title, url, notes, tags } = req.body;

  db.query(
    "INSERT INTO links (user_id, title, url, notes, tags) VALUES (?, ?, ?, ?, ?)",
    [req.userId, title, url, notes, tags],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Failed to add link" });
      res.json({ message: "Link added", id: result.insertId });
    }
  );
});

app.put("/links/:id", requireLogin, (req, res) => {
  const { title, url, notes, tags } = req.body;

  db.query(
    "UPDATE links SET title = ?, url = ?, notes = ?, tags = ? WHERE id = ? AND user_id = ?",
    [title, url, notes, tags, req.params.id, req.userId],
    (err) => {
      if (err) return res.status(500).json({ message: "Failed to update link" });
      res.json({ message: "Link updated" });
    }
  );
});

app.delete("/links/:id", requireLogin, (req, res) => {
  db.query(
    "DELETE FROM links WHERE id = ? AND user_id = ?",
    [req.params.id, req.userId],
    (err) => {
      if (err) return res.status(500).json({ message: "Failed to delete link" });
      res.json({ message: "Link deleted" });
    }
  );
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});