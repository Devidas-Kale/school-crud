import express from "express";
import http from "http";
import dotenv from "dotenv";
import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const accounts = new Map();
accounts.set("Alex", "alex");
accounts.set("Joe", "joe");

const alexSchools = new Map();
const joeSchools = new Map();

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

const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(
      token,
      process.env.JWT_SECRET || "somethingsecret",
      (err, decode) => {
        if (err) {
          res.status(401).send({ message: "Invalid Token" });
        } else {
          req.user = decode;
          next();
        }
      }
    );
  } else {
    res.status(401).send({ message: "No Token" });
  }
};

app.post(
  "/api/login",
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

app.put(
  "/api/schools/:name",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (
      accounts.has(req.params.name) &&
      req.body.schoolId !== "" &&
      req.body.schoolName !== "" &&
      req.body.schoolAddress !== ""
    ) {
      if (req.params.name === "Alex") {
        alexSchools.set(req.body.schoolId, req.body);
        res.send({
          data: "success",
        });
        return;
      } else {
        joeSchools.set(req.body.schoolId, req.body);
        res.send({
          data: "success",
        });
        return;
      }
    }
    res.status(401).send({ message: "Error while creating school." });
  })
);

app.get(
  "/api/schools/:name",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (accounts.has(req.params.name)) {
      if (req.params.name === "Alex") {
        res.send({
          arr: Array.from(alexSchools).map(([name, value]) => ({
            name,
            value,
          })),
        });
        return;
      } else {
        res.send({
          arr: Array.from(joeSchools).map(([name, value]) => ({
            name,
            value,
          })),
        });
        return;
      }
    }
    res.status(401).send({ message: "Error while fetching schools." });
  })
);

app.delete(
  "/api/schools/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (accounts.has(req.body.name)) {
      if (req.body.name === "Alex") {
        alexSchools.delete(req.params.id);
        res.send({
          data: "deleted",
        });
        return;
      } else {
        joeSchools.delete(req.params.id);
        res.send({
          data: "deleted",
        });
        return;
      }
    }
    res.status(401).send({ message: "Error while deleting school." });
  })
);

const port = process.env.PORT || 5000;
const httpServer = http.Server(app);

httpServer.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
