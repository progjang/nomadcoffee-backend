import client from "../../client";
import bcrypt from "bcrypt";

export default {
    Mutation: {
        createUser: async(_,{username, password, name, email}) => {
            //find user which have same username or email
            try{
                const existingUser = await client.user.findFirst({where: {
                    OR: [
                        {username},
                        {email}
                    ]
                }});
                if(existingUser) {
                    return {
                        ok: false,
                        error: "the username/password already taken."
                    }
                    // throw new Error("the username/password already taken.")
                }
                //make uglyPassword (hashing)
                const uglyPassword = await bcrypt.hash(password, 9);
                await client.user.create({
                    data:{
                        username,
                        name,
                        email,
                        password: uglyPassword
                    }
                });
            } catch(e){
                console.log(e);
                return {
                    ok: false,
                    error: e
                }
            }
            return {
                ok:true
            }
        },
    },
}