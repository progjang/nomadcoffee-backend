import client from "../../client";
import { handlePhotoS3, processCategory } from "../../common/common.utils";
import { protectedResolver } from "../../users/users.utils";

const resolverFn =  async(_,{id, name, latitude, longitude, categories, photos}, {loggedInUser})=> {
    const shop = await client.coffeeShop.findFirst({
        where:{
            id,
            userId:loggedInUser.id
        }});
    if(!shop){
        return {
          ok:false,
          error: "Cant edit this shop."  
        }
    }
    let photosObj = [];
    if(photos){
        const urlList = await handlePhotoS3(photos, loggedInUser.id)
        urlList.map((url) => photosObj.push({
            where: {url}, create:{url}
        }));
    }
    try{
        await client.coffeeShop.update({
            where:{id},
            data: {
                name,
                latitude,
                longitude,
                ...(photosObj.length > 0 && {
                    photos: {
                        connectOrCreate: photosObj,
                    }
                }),
                ...(categories && 
                  { categories: {
                    disconnect: shop.categories,
                    connectOrCreate: processCategory(categories),
                  }}),
            }
        });
    } catch(e) {
        return {
            ok: false,
            error: e
        }
    }

    return {
        ok: true,
    }
}

export default {
    Mutation:{
        editCoffeeShop: protectedResolver(resolverFn),
    }
}