import client from "../../client"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default {
    Mutation: {
        login: async(_, {username, password:inputPassword}) => {
            const okUser = await client.user.findUnique({where:{username}});
            if(!okUser){
                return {
                    ok: false,
                    error: "user not found"
                }
            };
            const okPassword = await bcrypt.compare(inputPassword, okUser.password);
            if(!okPassword){
                return {
                    ok:false,
                    error: "wrong password written"
                }
            }
            const jwt_token = jwt.sign({id: okUser.id}, process.env.SECRET_KEY);
            return {
                ok:true,
                token:jwt_token
            };
        },
    },
}