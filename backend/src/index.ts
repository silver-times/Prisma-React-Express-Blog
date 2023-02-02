import express, { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

interface RequestExtended extends express.Request {
  userId: number;
}

interface JWTPayload {
  userId: string;
}

const PORT = 5000;
const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error(`Environment variable "JWT_SECRET" not defined`);
}

app.use(express.json());
app.use(cors());

//@ts-ignore
prisma.$on('query', e => {
  //@ts-ignore
  console.debug(`Query. Duration: ${e.duration}ms`, {
    //@ts-ignore
    query: e.query,
    //@ts-ignore
    params: e.params,
  });
});

function getExtendedRequest(request: express.Request): RequestExtended {
  return request as unknown as RequestExtended;
}

// Middleware
const authMiddleware: RequestHandler = (request, res, next) => {
  const req = getExtendedRequest(request);
  const authorizationHeader = req.headers['authorization'];
  if (!authorizationHeader || typeof authorizationHeader !== 'string') {
    return res.sendStatus(401);
  }
  const token = authorizationHeader.replace('Bearer ', '');

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      console.error('Token verification failed', err);
      return res.sendStatus(401);
    }
    if (typeof payload !== 'object' || !payload['userId']) {
      console.error('Token payload is not string failed', { payload });
      return res.sendStatus(500);
    }
    const { userId } = payload as JWTPayload;
    req.userId = +userId;
    console.log('Token verification successful', { payload });
    next();
  });
};

app.get('/', async (req, res, next) => {
  try {
    res.send('Blog Home Page');
  } catch (error) {
    next(error);
  }
});

app.get('/users', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

app.get('/posts', async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany();
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

app.get('/posts/:slug', authMiddleware, async (req, res, next) => {
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

app.get('/tags', authMiddleware, async (req: any, res: any, next) => {
  try {
    const tags = await prisma.tag.findMany({
      where: {
        userId: req.user.id,
      },
    });
    res.json(tags);
  } catch (error) {
    next(error);
  }
});

app.post('/users', async (req, res, next) => {
  try {
    const user = await prisma.user.create({
      data: req.body,
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

app.post('/posts', authMiddleware, async (request, res, next) => {
  try {
    const req = getExtendedRequest(request);
    const userId = req.userId;
    const data = { ...req.body, userId };
    console.log('data', data);
    const post = await prisma.post.create({
      data,
    });
    res.json(post);
  } catch (error) {
    next(error);
  }
});

app.post('/sign-in', async (req, res, next) => {
  try {
    const name = req.body.name;
    if (typeof name !== 'string') {
      res.status(400).send(`Please provide a "name" filed!`);
      return;
    }
    const existingUser = await prisma.user.findUnique({
      where: {
        name,
      },
    });

    if (!existingUser) {
      res.status(404).send(`No such user found!`);
      return;
    }
    const payload: JWTPayload = { userId: existingUser.id.toString() };
    const accessToken = jwt.sign(payload, JWT_SECRET);
    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
});

app.listen(PORT, () => {
  console.log(`App listening on "http://localhost:${PORT}"`);
});
