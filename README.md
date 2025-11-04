#  Knowledge Graph API

A **backend-only API** that builds a smart knowledge graph connecting **skills**, **resources**, and **topics** — powered by **GraphQL** and **Neo4j**.

It enables authenticated users to add and explore relationships between learning resources and skills (e.g., `GraphQL → API Design → Backend Development`).

---

##  Features

-  **GraphQL API** — Flexible data querying and relationship mapping  
-  **Neo4j Graph DB** — Stores and connects nodes (Skills, Topics, Resources)  
-  **JWT Authentication** — Secures mutations and user-specific actions  
-  **Knowledge Linking** — Users can link skills, connect related topics, and attach resources  
-  **Rate Limiting** — Prevents API abuse *(max 50 requests / 15 min per client)*  
-  **Redis Caching** — Caches popular queries for faster responses  
-  **Expandable Design** — Easily scalable into a full learning recommendation backend  

---

##  Tech Stack

| Layer | Technology |
|-------|-------------|
| **Backend** | Node.js, Express.js |
| **GraphQL Server** | Apollo Server |
| **Database** | Neo4j (AuraDB / Local) |
| **Authentication** | JWT + bcrypt |
| **Cache** | Redis |
| **Rate Limiting** | express-rate-limit |
| **Environment Management** | dotenv |

---


### Prerequisites
- Node.js **(v16 or higher)**  
- Neo4j Database **(AuraDB or Local)**  
- Redis Server  

---

###  1. Clone & Install

git clone <repository-url>
cd knowledge-graph-api
npm install

###  Future Enhancements

- AI-based skill recommendation engine
- Resource tagging by difficulty & type
- User progress tracking system
-  Analytics dashboard for learning insights



