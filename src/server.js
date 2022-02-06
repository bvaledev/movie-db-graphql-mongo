const MongoHelper = require('./database/mongo-helper')
const startApolloServer = require('./apolloServer')

const mongoUrl = process.env.MONGO_CONNECTION || 'mongodb://localhost:27017/movie-catalog'
MongoHelper.connect(mongoUrl).then(async () => {
    await startApolloServer();
}).catch((err) => console.error(err.message))
