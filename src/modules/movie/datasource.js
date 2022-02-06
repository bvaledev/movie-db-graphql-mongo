const MongoHelper = require('../../database/mongo-helper')
const {ObjectId} = require('mongodb')

class MovieDataSource {
    async getMovies() {
        const collection = await MongoHelper.getCollection('movies')
        const movies = await collection.find().toArray()
        return MongoHelper.mapList(movies)
    }

    async findMovie(id) {
        const collection = await MongoHelper.getCollection('movies')
        const movie = await collection.findOne({_id: ObjectId(id)})
        return MongoHelper.map(movie)
    }

    async findMovieByGenreIds(ids) {
        const collection = await MongoHelper.getCollection('movies')
        const findGenres = ids.map(genreId => ObjectId(genreId))
        const result = await collection.find({genreIds: {$in: findGenres}}).toArray()
        return MongoHelper.mapList(result)
    }

    async incrementViews(id) {
        const collection = await MongoHelper.getCollection('movies')
        await collection.updateOne(
            {_id: ObjectId(id)},
            {$inc: {numberOfViews: 1}}
        )
    }
}

module.exports = MovieDataSource