import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const accounts = new Map();
accounts.set("Alex", "alex");
accounts.set("Joe", "joe");

const generateToken = (accountName) => {
  return jwt.sign(
    {
      name: accountName,
    },
    process.env.JWT_SECRET || "somethingsecret",
    {
      expiresIn: "30d",
    }
  );
};

app.post("/api/authenticate", async (req, res) => {
  res.send("Test endpoint");
});

app.post(
  "/api/signin",
  expressAsyncHandler(async (req, res) => {
    const accountName = req.body.name;
    if (accounts.has(accountName)) {
      if (req.body.password == accounts.get(accountName)) {
        res.send({
          name: accountName,
          token: generateToken(accountName),
        });
        return;
      }
    }
    res.status(401).send({ message: "Invalid username or password" });
  })
);

const port = process.env.PORT || 5000;
const httpServer = http.Server(app);

httpServer.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
