const MongoHelper = require('../../database/mongo-helper')
const {ObjectId} = require("mongodb");

class GenreDataSource {
    async getGenresWithMoviesCount() {
        const collection = await MongoHelper.getCollection('genres')
        const genres = await collection.aggregate([
            {
                $lookup: {
                    from: 'movies',
                    localField: '_id',
                    foreignField: 'genreIds',
                    as: 'movies'
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    moviesCount: {$size: "$movies"},
                }
            }
        ]).toArray()
        return MongoHelper.mapList(genres)
    }

    async findGenres(genreIds) {
        const collection = await MongoHelper.getCollection('genres')
        const genresToFind = genreIds.map(genreId => ObjectId(genreId))
        const result = await collection.find({_id: {$in: genresToFind}}).toArray()
        return MongoHelper.mapList(result)
    }
}

module.exports = GenreDataSource