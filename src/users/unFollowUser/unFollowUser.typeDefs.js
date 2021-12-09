import { gql } from "apollo-server-express";

export default gql`
    type UnFollowUserResult {
        ok:Boolean!
        error:String
    }

    type Mutation{
        unFollowUser(username:String!): UnFollowUserResult!
    }
`;
