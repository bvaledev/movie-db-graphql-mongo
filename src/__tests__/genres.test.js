const request = require('supertest')
const MongoHelper = require('../database/mongo-helper')
const startApolloServer = require('../apolloServer')

let genreCollection

const mockInsertGenre = async () => {
    const movie = await genreCollection.insertOne({
        name: 'any_genre',
    })
    return movie.insertedId
}

const mockInsertManyGenre = async () => {
    await mockInsertGenre()
    await mockInsertGenre()
    await mockInsertGenre()
}

let app

describe('Genre Graphql', () => {
    beforeAll(async () => {
        process.env.PORT = Math.floor(3500 + Math.random() * 6000)
        app = await startApolloServer()
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        genreCollection = await MongoHelper.getCollection('genres')
        await genreCollection.deleteMany({})
    })

    it('Should list of genres', async () => {
        await mockInsertManyGenre()
        const query = `query ListGenres {
          genres {
            id
            moviesCount
            name
          }
        }`

        const response = await request(app).post('/graphql').send({query})

        expect(response.body.data.genres).toBeTruthy()
        expect(response.body.data.genres.length).toBe(3)
    })
})