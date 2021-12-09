import client from "../../client"
import { handlePhotoS3, processCategory } from "../../common/common.utils";

import { protectedResolver } from "../../users/users.utils"


export default {
    Mutation: {
        createCoffeeShop: protectedResolver(async(_, {name, latitude, longitude, photos, categories}, {loggedInUser}) => {
            const existingName = await client.coffeeShop.findFirst({where: {name}});
            if(existingName){
                return {
                    ok:false,
                    error:"already this name taken"
                }
            }
            let photosObj = [];
            if(photos){
                const urlList = await handlePhotoS3(photos, loggedInUser.id)
                urlList.map((url) => photosObj.push({
                    where: {url}, create:{url}
                }));
            }
            console.log(photosObj);

            let categoriesObj = [];
            if (categories) {
                categoriesObj = processCategory(categories)
            }
            try{
                await client.coffeeShop.create({
                        data:{
                            name,
                            latitude,
                            longitude,
                            user: {
                                connect:{
                                    id: loggedInUser.id
                                }
                            },
                            ...(photosObj.length > 0 && {
                                photos: {
                                    connectOrCreate: photosObj,
                                }
                            }),
                            ...(categoriesObj.length > 0 && {
                                categories: {
                                    connectOrCreate: categoriesObj,
                                },
                            }),
                        }
                });
            } catch(e) {
                return {
                    ok: false,
                    error: e
                }
            }

            return {
                ok: true
            }
        }),
    },
}