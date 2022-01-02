import client from "../../client"

export default {
    Query: {
        searchCoffeeShops: async(_,{keyword}) => {
            return await client.coffeeShop.findMany({where:{
                name: {
                    startsWith: keyword,
                },
            }});
        },
    },
}