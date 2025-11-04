import { gql } from "apollo-server";

export const typeDefs = gql`
  type Resource {
    id: ID!
    title: String!
    description: String
    url: String
    topics: [Topic]
    relatedResources: [Resource]
  }

  type Topic {
    id: ID!
    name: String!
    description: String
    resources: [Resource]
    relatedTopics: [Topic]
  }

  type Query {
    getAllResources: [Resource]
    getResourceById(id: ID!): Resource
    getAllTopics: [Topic]
    getTopicByName(name: String!): Topic
    searchResources(keyword: String!): [Resource]
  }

  type Mutation {
    addResource(title: String!, description: String, url: String, topics: [String]): Resource
    addTopic(name: String!, description: String): Topic
    linkTopics(source: String!, target: String!): String
    linkResources(sourceId: ID!, targetId: ID!): String
  }
  
  type User {
  id: ID!
  username: String!
  password: String
}

type AuthPayload {
  token: String!
  user: User!
}

extend type Mutation {
  register(username: String!, password: String!): User
  login(username: String!, password: String!): AuthPayload
}

`;
