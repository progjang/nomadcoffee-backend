import client from "../client";

export default {
    CoffeeShop: {
        user: ({id}) => client.user.findFirst({
            where: {
                shops: {
                    some: {
                        id
                    }
                }
            },
        }),
        photos:({id}) => client.coffeeShop.findUnique({where:{id}}).photos(),
    },
    Category: {
        shops: ({id}, {page}) => client.category.findUnique({where:{id}}).shops({take:5, skip:(page-1)*5}),
        totalShops: ({id}) => client.coffeeShop.count({where:{
            categories:{
                some: {
                    id,
                }
            },
        }}),
    },
}