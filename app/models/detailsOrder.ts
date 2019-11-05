import {Model} from "objection";
import {Products} from "./products";
import {Orders} from "./orders";

export class DetailsOrder extends Model {
    static get tableName() {
        return 'detailsOrder';
    }

    static get relationMappings() {
        return {
            products: {
                relation: Model.HasOneRelation,
                modelClass: Products,
                join: {
                    from: 'detailsOrder.productId',
                    to: 'products.id'
                }
            },
            orders: {
                relation: Model.HasOneRelation,
                modelClass: Orders,
                join: {
                    from: 'detailsOrder.orderId',
                    to: 'orders.id'
                }
            }
        };
    }
}
