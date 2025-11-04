import { session } from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const resolvers = {

    Query: {


        getAllResources: async () => {
            const result = await session.run(`MATCH (r:Resource) RETURN r`);
            return result.records.map(r => r.get("r").properties);
        },

        getResourceById: async (_, { id }) => {
            const result = await session.run(`MATCH (r:Resource {id: $id}) RETURN r`, { id });
            return result.records[0]?.get("r").properties || null;
        },

        getAllTopics: async () => {
            const result = await session.run(`MATCH (t:Topic) RETURN t`);
            return result.records.map(r => r.get("t").properties);
        },

        getTopicByName: async (_, { name }) => {
            const result = await session.run(`MATCH (t:Topic {name: $name}) RETURN t`, { name });
            return result.records[0]?.get("t").properties || null;
        },

        searchResources: async (_, { keyword }) => {
            const result = await session.run(
                `MATCH (r:Resource)
         WHERE toLower(r.title) CONTAINS toLower($keyword)
            OR toLower(r.description) CONTAINS toLower($keyword)
         RETURN r`,
                { keyword }
            );
            return result.records.map(r => r.get("r").properties);
        },
    },

    Mutation: {

        register: async (_, { username, password }) => {
            const existing = await session.run(
                `MATCH (u:User {username: $username}) RETURN u`,
                { username }
            );
            if (existing.records.length > 0) {
                throw new Error("User already exists");
            }

            const hashed = await bcrypt.hash(password, 10);
            const id = `${Date.now()}`;
            await session.run(
                `CREATE (u:User {id: $id, username: $username, password: $hashed})`,
                { id, username, hashed }
            );

            return { id, username };
        },

        login: async (_, { username, password }) => {
            const result = await session.run(
                `MATCH (u:User {username: $username}) RETURN u`,
                { username }
            );

            if (result.records.length === 0) throw new Error("User not found");
            const user = result.records[0].get("u").properties;

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) throw new Error("Invalid credentials");

            const token = jwt.sign(
                { id: user.id, username: user.username },
                "SUPER_SECRET_KEY",
                { expiresIn: "1h" }
            );

            return { token, user };
        },

        addResource: async (_, { title, description, url, topics }) => {
            const id = `${Date.now()}`;
            await session.run(
                `CREATE (r:Resource {id: $id, title: $title, description: $description, url: $url})`,
                { id, title, description, url }
            );

            if (topics?.length) {
                for (const name of topics) {
                    await session.run(
                        `MERGE (t:Topic {name: $name})
             MERGE (r:Resource {id: $id})-[:BELONGS_TO]->(t)`,
                        { id, name }
                    );
                }
            }

            return { id, title, description, url };
        },

        addTopic: async (_, { name, description }) => {
            const id = `${Date.now()}`;
            await session.run(`CREATE (t:Topic {id: $id, name: $name, description: $description})`, {
                id,
                name,
                description,
            });
            return { id, name, description };
        },

        linkTopics: async (_, { source, target }) => {
            await session.run(
                `MATCH (a:Topic {name: $source}), (b:Topic {name: $target})
         MERGE (a)-[:RELATED_TO]->(b)`,
                { source, target }
            );
            return `Linked topic ${source} → ${target}`;
        },

        linkResources: async (_, { sourceId, targetId }) => {
            await session.run(
                `MATCH (a:Resource {id: $sourceId}), (b:Resource {id: $targetId})
         MERGE (a)-[:RELATED_TO]->(b)`,
                { sourceId, targetId }
            );
            return `Linked resource ${sourceId} → ${targetId}`;
        },
    },
};
