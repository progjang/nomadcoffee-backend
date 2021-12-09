import jwt from "jsonwebtoken";
import client from "../client";

export const getUser = async(token) => {
    try{
        const {id} = jwt.verify(token, process.env.SECRET_KEY);
        const user = await client.user.findUnique({where: {id}});
        if(user){
            return user;
        } else{
            return null;
        }
    } catch(e){
        return null;
    }


};

export const protectedResolver = (ourResolver) => (
    root,
    args,
    context,
    info
 ) => {
     if(!context.loggedInUser) {
         return {
             ok: false,
             error: "login required"
         }
     }
     return ourResolver(root, args, context, info);
 }