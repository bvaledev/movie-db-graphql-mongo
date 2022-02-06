const MongoHelper = require("../../../database/mongo-helper");
const MovieDataSource = require('../datasource')

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

const sut = new MovieDataSource()

describe('MovieDataSource', () => {
    beforeAll(async () => {
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

    it('should load all movies', async () => {
        await mockInsertManyMovies()

        const movies = await sut.getMovies()

        expect(movies.length).toBe(3)
    })

    it('should rethrow if getMovies throw', async () => {
        await mockInsertManyMovies()
        jest.spyOn(sut, 'getMovies').mockRejectedValueOnce(() => {
            throw  new Error('any error')
        })
        const promise =  sut.getMovies()

        await expect(promise).rejects.toThrowError(new Error('any error'))
    })

    it('should return a correct movie on findMovie', async () => {
        const id = await mockInsertMovie()

        const movies = await sut.findMovie(id)

        expect(movies.id).toEqual(id)
        expect(movies.backdrop).toBe('any_data')
    })

    it('should rethrow if findMovie throw', async () => {
        const id = await mockInsertMovie()
        await mockInsertManyMovies()
        jest.spyOn(sut, 'findMovie').mockRejectedValueOnce(() => {
            throw  new Error('any error')
        })

        const promise =  sut.findMovie(id)

        await expect(promise).rejects.toThrowError(new Error('any error'))
    })

    it('should return a list of movie on findMovieByGenreIds succeeds', async () => {
        const genreId = (await mockInsertGenre())
        await mockInsertManyMovies()
        await mockInsertMovie([genreId])
        const sut = new MovieDataSource()

        const movies = await sut.findMovieByGenreIds([genreId])

        expect(movies.length).toBe(1)
        expect(movies[0].genreIds[0]).toEqual(genreId)
    })

    it('should rethrow if findMovieByGenreIds throw', async () => {
        const genreId = (await mockInsertGenre())
        await mockInsertManyMovies()
        await mockInsertMovie([genreId])
        jest.spyOn(sut, 'findMovieByGenreIds').mockRejectedValueOnce(() => {
            throw  new Error('any error')
        })

        const promise = sut.findMovieByGenreIds([genreId])

        await expect(promise).rejects.toThrowError(new Error('any error'))
    })

    it('should incrementViews', async () => {
        const id = await mockInsertMovie()
        const movieInitCount = await sut.findMovie(id)
        expect(movieInitCount.numberOfViews).toBe(2)

        await sut.incrementViews(id)

        const movieSecondCount = await sut.findMovie(id)
        expect(movieSecondCount.numberOfViews).toBe(3)
    })

    it('should rethrow if incrementViews throws', async () => {
        const id = await mockInsertMovie()
        jest.spyOn(sut, 'incrementViews').mockRejectedValueOnce(() => {
            throw  new Error('any error')
        })

        const promise =  sut.incrementViews(id)

        await expect(promise).rejects.toThrowError(new Error('any error'))
    })
})