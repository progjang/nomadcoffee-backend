require("dotenv").config();
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import express from "express";
import logger from "morgan";
import {typeDefs, resolvers} from "./schema";
import { getUser } from "./users/users.utils";

// The GraphQL schema


// A map of functions which return data for the schema.
const PORT = process.env.PORT;

const startServer = async () => {
  const server = new ApolloServer({
    //schema,
    typeDefs,
    resolvers,
    context: async({req}) => {
      return {
        loggedInUser: await getUser(req.headers.token),
      };
    },
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  await server.start();
  const app = express();
  app.use(logger("tiny"));
  app.use("/static", express.static("uploads"));
  app.use(graphqlUploadExpress());
  server.applyMiddleware({ app });
  await new Promise((func) => app.listen({ port: PORT }, func));
  console.log(`🚀 Server: http://localhost:${PORT}${server.graphqlPath}`);
}
startServer();