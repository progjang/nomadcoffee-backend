import client from "../../client";
import { protectedResolver } from "../users.utils";

const resolverFn = async(_, {username}, {loggedInUser}) => {
    const user = await client.user.findUnique({where:{username}});
    if(!user) {
        return {
            ok:false,
            error: "No user found."
        }
    }
    await client.user.update({
        where:{id: loggedInUser.id},
        data: {
            followings:{
                disconnect: {
                    username
                }
            }
        }
    });
    return {
        ok: true
    }
}

export default {
    Mutation: {
        unFollowUser: protectedResolver(resolverFn),
    },
};