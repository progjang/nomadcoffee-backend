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
                connect: {
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
        followUser: protectedResolver(resolverFn),
    },
};