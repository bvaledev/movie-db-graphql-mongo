const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const express = require('express');
const http = require('http');

const {mergeTypeDefs} = require('@graphql-tools/merge');

const {movieSchema, movieResolver, movieDataSource} = require("./modules/movie")
const {genreSchema, genreResolver, genreDataSource} = require("./modules/genre")

const typeDefs = mergeTypeDefs([movieSchema, genreSchema])
const resolvers = [movieResolver, genreResolver]
const dataSources = {
    movieDB: movieDataSource,
    genreDB: genreDataSource,
}

const startApolloServer = (typeDefs, resolvers, dataSources) => async () =>  {
    const app = express();
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        dataSources: () => dataSources,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer, stopGracePeriodMillis: 0 })],
    });
    await server.start();
    server.applyMiddleware({ app });
    await new Promise(resolve => httpServer.listen({ port: process.env.PORT || 3000 }, resolve));
    console.log(`🚀 http://localhost:${server.port}${server.graphqlPath}`);
    return app
}

module.exports = startApolloServer(typeDefs, resolvers, dataSources)