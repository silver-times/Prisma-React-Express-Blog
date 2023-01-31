import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import cors from "cors";

const PORT = 5000;
const app = express();
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cors());

// //@ts-ignore
// prisma.$on("query", (e) => {
//   //@ts-ignore
//   console.debug(`Query. Duration: ${e.duration}ms`, {
//     //@ts-ignore
//     query: e.query,
//     //@ts-ignore
//     params: e.params,
//   });
// });

// Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const token = req.headers["authorization"];

  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    console.log("Token verification successful!");
    next();
  });
};

app.get("/", async (req, res, next) => {
  try {
    res.send("Blog Home Page");
  } catch (error) {
    next(error);
  }
});

app.get("/users", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

app.get("/posts", async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany();
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

app.get("/posts/:slug", authenticateToken, async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const singlePost = await prisma.post.findFirst({
      where: {
        slug,
      },
    });
    res.json(singlePost);
  } catch (error) {
    next(error);
  }
});

app.post("/users", async (req, res, next) => {
  try {
    const user = await prisma.user.create({
      data: req.body,
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

app.post("/posts", async (req, res, next) => {
  try {
    const data = req.body;
    const post = await prisma.post.create({
      data: req.body,
    });
    res.json(post);
  } catch (error) {
    next(error);
  }
});

app.post("/login", async (req, res, next) => {
  try {
    const username = req.body.username;
    const user = { name: username };
    const accessToken = jwt.sign(user, process.env.SECRET_ACCESS_TOKEN);
    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on PORT ${PORT}`);
});
