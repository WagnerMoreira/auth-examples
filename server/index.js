const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();
const ACCESS_SECRET = "quick-sauce";
const REFRESH_SECRET = "slow-cooking-sauce";

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const USERS = [{ username: "wagner", password: "1234", id: 1 }];

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const accessToken = jwt.sign({ userId: user.id }, ACCESS_SECRET, {
    expiresIn: "15s",
  });
  const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // true in production env with HTTPS
    sameSite: "Lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false, // true in production env with HTTPS
    sameSite: "Lax",
    maxAge: 15 * 1000, // 15 secs (for testing)
  });

  res.json({ success: true });
});

app.post("/refresh", (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ error: "Missing refresh token" });
  }

  try {
    const payload = jwt.verify(token, REFRESH_SECRET);
    const accessToken = jwt.sign({ userId: payload.userId }, ACCESS_SECRET, {
      expiresIn: "15s",
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // true in production env with HTTPS
      sameSite: "Lax",
      maxAge: 15 * 1000, // 15 secs (for testing)
    });

    res.json({ sucsess: true });
  } catch {
    res.status(403).json({ error: "Invalid refresh token" });
  }
});

app.get("/me", (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const payload = jwt.verify(token, ACCESS_SECRET);
    const user = USERS.find((u) => u.id === payload.userId);

    res.json({ user: { username: user.username } });
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  res.json({ success: true });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
