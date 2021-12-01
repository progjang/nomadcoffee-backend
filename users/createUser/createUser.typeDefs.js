import { gql } from "apollo-server";

export default gql`
    type CreateUserResult {
        ok: Boolean!
        error: String
    }
    type Mutation {
        createUser(username:String! password:String! name:String! email:String!):CreateUserResult!
    }
`;