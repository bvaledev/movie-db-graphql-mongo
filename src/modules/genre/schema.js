const {gql} = require("apollo-server");

const genreTypeDefs = gql`
    type Query {
        "Return a list of genres"
        genres: [Genre]
    }
    
    type Genre {
        "Genre identifier"
        id: ID!
        "Genre name"
        name: String!
        "Total of movies that genre contains"
        moviesCount: Int
    }
    
    extend type Movie {
        "Reference to genres that movie belong"
        genreIds: [Genre]  
    }
`;

module.exports = genreTypeDefs;
