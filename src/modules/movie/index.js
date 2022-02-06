const movieSchema = require("./schema")
const MovieDataSource = require("./datasource")
const movieResolvers = require("./resolver")

module.exports = {
    movieSchema: movieSchema,
    movieDataSource: new MovieDataSource(),
    movieResolver: movieResolvers
}
