const request = require('supertest')
const MongoHelper = require('../database/mongo-helper')
const startApolloServer = require('../apolloServer')
const {ObjectId} = require("mongodb");
let movieCollection
let genreCollection

const mockInsertMovie = async (genres = []) => {
    const movie = await movieCollection.insertOne({
        originalLanguage: 'any_data',
        originalTitle: 'any_data',
        genreIds: genres,
        title: 'any_data',
        overview: 'any_data',
        popularity: 199.999,
        poster: 'any_data',
        backdrop: 'any_data',
        releaseDate: '2020-10-14',
        trailer: 'any_data',
        voteAverage: 'any_data',
        voteCount: 'any_data',
        numberOfViews: 2,
    })
    return movie.insertedId
}

const mockInsertManyMovies = async () => {
    await movieCollection.insertMany([{
        originalLanguage: 'any_data',
        originalTitle: 'any_data',
        title: 'any_data',
        overview: 'any_data',
        popularity: 199.999,
        poster: 'any_data',
        backdrop: 'any_data',
        releaseDate: '2020-10-14',
        trailer: 'any_data',
        voteAverage: 'any_data',
        voteCount: 'any_data',
        numberOfViews: 2,
    }, {
        originalLanguage: 'any_data',
        originalTitle: 'any_data',
        title: 'any_data',
        overview: 'any_data',
        popularity: 199.999,
        poster: 'any_data',
        backdrop: 'any_data',
        releaseDate: '2020-10-14',
        trailer: 'any_data',
        voteAverage: 'any_data',
        voteCount: 'any_data',
        numberOfViews: 2,
    }, {
        originalLanguage: 'any_data',
        originalTitle: 'any_data',
        title: 'any_data',
        overview: 'any_data',
        popularity: 199.999,
        poster: 'any_data',
        backdrop: 'any_data',
        releaseDate: '2020-10-14',
        trailer: 'any_data',
        voteAverage: 'any_data',
        voteCount: 'any_data',
        numberOfViews: 2,
    }])
}

const mockInsertGenre = async () => {
    const movie = await genreCollection.insertOne({
        name: 'any_genre',
    })
    return movie.insertedId
}

let app

describe('Movie Graphql', () => {
    beforeAll(async () => {
        process.env.PORT = Math.floor(3500 + Math.random() * 6000)
        app = await startApolloServer()
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        movieCollection = await MongoHelper.getCollection('movies')
        await movieCollection.deleteMany({})
        genreCollection = await MongoHelper.getCollection('genres')
        await genreCollection.deleteMany({})
    })

    it('Should list movies', async () => {
        await mockInsertManyMovies()
        const query = `query ListMovies {
          movies {
            id
            title
            genreIds {
              id
              name
            }
            numberOfViews
          }
        } `

        const response = await request(app).post('/graphql').send({query})

        expect(response.body.data.movies).toBeTruthy()
        expect(response.body.data.movies.length).toBe(3)
    })

    it('Should return a movie if id exists', async () => {
        await mockInsertManyMovies()
        const movieId = (await mockInsertMovie()).toString()
        const query = `query GetMovie{
          movie(id: "${movieId}") {
            id
            title
            genreIds {
              id
              name
            }
          }
        }`

        const response = await request(app).post('/graphql').send({query})

        expect(response.body.data.movie.id).toBe(movieId)
    })

    it('Should get movie by genre list', async () => {
        await mockInsertManyMovies()
        const genreId = await mockInsertGenre()
        await mockInsertMovie([genreId])
        const query = `query MovieByGenres($ids: [ID!]) {
          movieByGenres(ids: $ids) {
            title
            genreIds {
              name
            }
          }
        }`
        const variables = {
            ids: [genreId]
        }

        const response = await request(app).post('/graphql').send({query, variables})

        expect(response.body.data.movieByGenres.length).toBe(1)
        expect(response.body.data.movieByGenres).toBeTruthy()
    })

    it('Should return 200 on increment movie views if movie id exists', async () => {
        await mockInsertManyMovies()
        const movieId = await mockInsertMovie()
        const query = `mutation IncrementView($incrementViewId: ID!) {
          incrementViews(id: $incrementViewId) {
            code
            success
            message
          }
        }`
        const variables = {
            incrementViewId: movieId
        }

        const response = await request(app).post('/graphql').send({query, variables})

        expect(response.body.data).toMatchInlineSnapshot(`
            Object {
              "incrementViews": Object {
                "code": 200,
                "message": "Number of views incremented",
                "success": true,
              },
            }
        `)
    })

    it('Should return 500 on increment movie views if movie id not exists', async () => {
        await mockInsertManyMovies()
        await mockInsertMovie()
        const query = `mutation IncrementView($incrementViewId: ID!) {
          incrementViews(id: $incrementViewId) {
            code
            success
            message
          }
        }`
        const variables = {
            incrementViewId: ObjectId("507f1f77bcf86cd799439011")
        }

        const response = await request(app).post('/graphql').send({query, variables})

        expect(response.body.data).toMatchInlineSnapshot(`
        Object {
          "incrementViews": Object {
            "code": 500,
            "message": "Movie does not exists",
            "success": false,
          },
        }
        `)
    })
})