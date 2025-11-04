import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema/schema.js";
import { resolvers } from "./servicee/resolvers.js";

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const token = req.headers.authorization || "";
        if (token) {
            try {
                const decoded = jwt.verify(token.replace("Bearer ", ""), "SUPER_SECRET_KEY");
                return { user: decoded };
            } catch (err) {
                console.warn("Invalid token");
            }
        }
        return {};
    },
});
server.listen({ port: process.env.PORT }).then(({ url }) => {
    console.log(` Server ready at ${url}`);
});
