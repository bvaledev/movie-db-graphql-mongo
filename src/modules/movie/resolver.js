const movieResolver = {
    Query: {
        movies: (_, __, {dataSources}) => dataSources.movieDB.getMovies(),
        movie: (_, {id}, {dataSources}) => dataSources.movieDB.findMovie(id),
        movieByGenres: (_, {ids}, {dataSources}) => dataSources.movieDB.findMovieByGenreIds(ids),
    },
    Mutation: {
        incrementViews: (_, {id}, {dataSources}) => {

               return dataSources.movieDB.incrementViews(id).then(() => {
                    return {
                        code: 200,
                        success: true,
                        message: "Number of views incremented"
                    }
                }).catch((error) =>{
                   return {
                       code: 500,
                       success: false,
                       message: error.message
                   }
               })

        }
    }
}

module.exports = movieResolver