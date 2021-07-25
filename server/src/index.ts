
//import { Post } from './entities/Post'

import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
//import { HelloResolver } from './resolvers/hello';
import "reflect-metadata";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { COOKIE_NAME, __prod__ } from "./constants";
import {createConnection} from 'typeorm'

import cors from "cors";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import path from "path";

declare module "express-session" {
  export interface SessionData {
    userId: number;
  }
}

const main = async () => {
  const conn=await createConnection({
    type:"postgres",
    database:"lireddit2",
    username:"postgres",
    password:"serenity",
    logging:true,
    migrations: [path.join(__dirname, "./migrations/*")],
    // synchronize:true,
    entities:[Post,User]
  })

 
  // const orm = await MikroORM.init(mikroOrmConfig);

  // await orm.getMigrator().up();
  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        secure: __prod__,
        sameSite: "lax",
      },
      secret: "cat",
      resave: false,
      saveUninitialized: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res, redis }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};
main().catch((err) => {
  console.error(err);
});
