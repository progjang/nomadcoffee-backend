import client from "../../client";

export default {
    Query:{
        seeUser: (_, {username}) => client.user.findUnique({where: {username}}),
    }
}