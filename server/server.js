const express = require('express');
const path = require('path');
const db = require('./config/connection');

// Import the Apollo Server
const { ApolloServer } = require('apollo-server-express');
// Import the typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');

// Set up express server
const app = express();
const PORT = process.env.PORT || 3001;

// Set up the apollo server and pass in the schema
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

// Integrate the Apollo server and pass in the schema
server.applyMiddleware({ app });

// Express middleware for parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// GraphQL and express server start

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});