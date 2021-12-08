import client from "../../client";
import { processCategory } from "../../common/utils";
import { protectedResolver } from "../../users/users.utils";

const resolverFn =  async(_,{id, name, latitude, longitude, categories}, {loggedInUser})=> {
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
    await client.coffeeShop.update({
        where:{id},
        data: {
            name,
            latitude,
            longitude,
            ...(categories && 
              { categories: {
                disconnect: shop.categories,
                connectOrCreate: processCategory(categories),
              }}),
        }
    });
    return {
        ok: true,
    }
}

export default {
    Mutation:{
        editCoffeeShop: protectedResolver(resolverFn),
    }
}