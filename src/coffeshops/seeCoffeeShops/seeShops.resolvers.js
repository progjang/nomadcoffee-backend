import client from "../../client"

export default {
    Query: {
        seeCoffeeShops: async(_, {page}) => await client.coffeeShop.findMany({take:5, skip:(page-1)*5})
    }
}