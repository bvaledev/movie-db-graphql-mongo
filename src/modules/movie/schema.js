const {gql} = require("apollo-server");

const movieTypeDefs = gql`
    type Query {
        "Return a list of movies"
        movies: [Movie]
        "Return a single movie"
        movie(id: ID!): Movie
        "Filter movie by array of genre id"
        movieByGenres(ids: [ID!]): [Movie]
    }
    
    type Mutation {
        "Increment movie total views count"
        incrementViews(id: ID!): IncrementViewResponse
    }

    type IncrementViewResponse {
        code: Int
        success: Boolean
        message: String!
    }

    type Movie {
        id: ID!
        "Original movie language"
        originalLanguage: String
        "The movie title in original language"
        originalTitle: String
        "Translated title to pt-BR"
        title: String
        "Overview resume of the movie"
        overview: String
        "Total count of popularity"
        popularity: Float
        "Poster image url"
        poster: String
        "Background image url for page"
        backdrop: String
        "Date of release"
        releaseDate: String
        "Youtube movie trailer"
        trailer: String
        "Vote Average"
        voteAverage: String
        "Total votes count"
        voteCount: String
        "Total clicks on this movie"
        numberOfViews: Int
    }
`;

module.exports = movieTypeDefs;
