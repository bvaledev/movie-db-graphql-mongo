const genreResolver = {
    Query: {
        genres: (_, __, {dataSources}) => dataSources.genreDB.getGenresWithMoviesCount()
    },
    Movie: {
        genreIds: ({genreIds}, _, {dataSources}) => {
            return dataSources.genreDB.findGenres(genreIds)
        }
    },
    Genre: {

    }
}

module.exports = genreResolver