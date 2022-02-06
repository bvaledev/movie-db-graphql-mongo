const genreSchema = require("./schema")
const GenreDataSource = require("./datasource")
const genreResolvers = require("./resolver")

module.exports = {
    genreSchema: genreSchema,
    genreDataSource: new GenreDataSource(),
    genreResolver: genreResolvers
}
