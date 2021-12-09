import {createWriteStream, write} from "fs";
import { protectedResolver } from "../users.utils";
import bcrypt from "bcrypt";
import client from "../../client";
import { handlePhoto, handlePhotoS3 } from "../../common/common.utils";
export default {
    Mutation: {
        editProfile: protectedResolver(async(_, {username, email, password:newPassword, name, location, avatar, githubUsername}, {loggedInUser}) => {
            let avatarURL = null;
            if(avatar){
                avatarURL = await handlePhotoS3(avatar, loggedInUser.id);
                console.log(avatarURL);
            //    const {filename, createReadStream} = await avatar;
            //    const readStream = createReadStream();
            //    const newFilename = loggedInUser.id + Date.now() + filename;
            //    const writeStream = createWriteStream(process.cwd() + '/uploads/' + newFilename);
            //    readStream.pipe(writeStream);
            //    avatarURL = `http://localhost:3000/static/${newFilename}`;
            }
            try{
                const user = await client.user.findUnique({where:{id: loggedInUser.id}});
                if(!user){
                    return {
                        ok: false,
                        error: "only owner can edit this photo"
                    }
                }
                let uglyPassword = null;
                if(newPassword) {
                    uglyPassword = await bcrypt.hash(newPassword, 9);
                }
                const updatedUser = await client.user.update({
                    where: {id: loggedInUser.id},
                    data:{
                        username,
                        email,
                        name,
                        location,
                        avatarURL,
                        githubUsername,
                        ...(avatarURL && {avatarURL}),
                        ...(uglyPassword && {password:uglyPassword})
                    },
                    select:{id:true}
                });
                if(updatedUser.id){
                    return{
                        ok:true,
                    }
                } else{
                    return {
                        ok:false,
                        error: "failed to update"
                    }
                }
    
            } catch(e){
                return {
                    ok: false,
                    error: e
                }
            }
        }),
    },
}