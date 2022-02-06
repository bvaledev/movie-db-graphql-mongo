const MongoHelper = require("../../../database/mongo-helper");
const GenreDataSource = require('../datasource')

let genreCollection
let movieCollection

const mockInsertGenre = async () => {
    const movie = await genreCollection.insertOne({
        name: 'any_genre',
    })
    return movie.insertedId
}
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
const sut = new GenreDataSource()

describe('GenreDataSource', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        genreCollection = await MongoHelper.getCollection('genres')
        await genreCollection.deleteMany({})
        movieCollection = await MongoHelper.getCollection('movies')
        await movieCollection.deleteMany({})
    })

    it('should return a list of genres', async () => {
        await mockInsertGenre()
        await mockInsertGenre()

        const genres = await sut.getGenresWithMoviesCount()

        expect(genres.length).toBe(2)
        expect(genres[0].moviesCount).toBe(0)
    })

    it('should return a list of genres with correct number of moviesCount', async () => {
        const genreId = await mockInsertGenre()
        await mockInsertGenre()
        await mockInsertMovie([genreId])

        const genres = await sut.getGenresWithMoviesCount()

        expect(genres.length).toBe(2)
        expect(genres[0].moviesCount).toBe(1)
        expect(genres[1].moviesCount).toBe(0)
    })

    it('should rethrow if getGenresWithMoviesCount throws', async () => {
        jest.spyOn(sut, 'getGenresWithMoviesCount').mockRejectedValueOnce(() => {
            throw new Error('any_error')
        })

        const promise =  sut.getGenresWithMoviesCount()

        await expect(promise).rejects.toThrowError(new Error('any_error'))
    })

    it('should return a list of genres on find successfully', async () => {
        const genreId1 = await mockInsertGenre()
        const genreId2 = await mockInsertGenre()

        const genres = await sut.findGenres([genreId1, genreId2])

        expect(genres.length).toBe(2)
        expect(genres[0].id).toEqual(genreId1)
        expect(genres[1].id).toEqual(genreId2)
    })

    it('should rethrow if findGenres throws', async () => {
        jest.spyOn(sut, 'findGenres').mockRejectedValueOnce(() => {
            throw new Error('any_error')
        })

        const promise =  sut.findGenres([])

        await expect(promise).rejects.toThrowError(new Error('any_error'))
    })
})