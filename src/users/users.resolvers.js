import client from "../client"

export default {
    User: {
        followings: ({id},{page=1}) => {
            return client.user.findUnique({where:{id}}).followings({take:3, skip:(page-1)*3})
        },
        followers: ({id},{page=1}) => {
            return client.user.findUnique({where:{id}}).followers({take:3, skip:(page-1)*3})
        }
    }
}