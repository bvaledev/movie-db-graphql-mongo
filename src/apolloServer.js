const {ApolloServer} = require("apollo-server");
const {mergeTypeDefs} = require('@graphql-tools/merge');

const {movieSchema, movieResolver, movieDataSource} = require("./modules/movie")
const {genreSchema, genreResolver, genreDataSource} = require("./modules/genre")

const typeDefs = mergeTypeDefs([movieSchema, genreSchema])
const resolvers = [movieResolver, genreResolver]
const dataSources = {
    movieDB: movieDataSource,
    genreDB: genreDataSource,
}

const startApolloServer = (typeDefs, resolvers, dataSources) => async () => {
    const server = new ApolloServer({typeDefs, resolvers, dataSources: () => dataSources, cors: {origin: "*"}, });
    const {url} = await server.listen({port: process.env.PORT || 3000});
    console.log(`Apollo server is running at ${url}`);
}

module.exports = startApolloServer(typeDefs, resolvers, dataSources)