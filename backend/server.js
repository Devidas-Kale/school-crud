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

const getUserName = (req) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET || "somethingsecret");
  return verify.name;
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
    if (accounts.has(String(accountName))) {
      if (req.body.password == accounts.get(String(accountName))) {
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
  "/api/schools/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (
      req.body.schoolId !== "" &&
      req.body.schoolName !== "" &&
      req.body.schoolAddress !== ""
    ) {
      const userName = getUserName(req);
      if (accounts.has(String(userName))) {
        (String(userName) === "Alex" ? alexSchools : joeSchools).set(
          String(req.body.schoolId),
          req.body
        );
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
  "/api/schools",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userName = getUserName(req);
    if (accounts.has(String(userName))) {
      res.send({
        arr: Array.from(
          String(userName) === "Alex" ? alexSchools : joeSchools
        ).map(([name, value]) => ({
          name,
          value,
        })),
      });
      return;
    }
    res.status(404).send({ message: "Error while fetching schools." });
  })
);

app.delete(
  "/api/schools/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userName = getUserName(req);
    if (accounts.has(String(userName))) {
      (String(userName) === "Alex" ? alexSchools : joeSchools).delete(
        String(req.params.id)
      );
      res.send({
        data: "deleted",
      });
      return;
    }
    res.status(404).send({ message: "Error while deleting school." });
  })
);

const port = process.env.PORT || 5000;
const httpServer = http.Server(app);

httpServer.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
