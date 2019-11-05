import {Model} from "objection";
import {Categories} from "./categories";
import {DetailsOrder} from "./detailsOrder";

export class Products extends Model {
    static get tableName() {
        return 'products';
    }

    static get relationMappings() {
        return {
            categories: {
                relation: Model.HasOneRelation,
                modelClass: Categories,
                join: {
                    from: 'products.categoryId',
                    to: 'categories.id'
                }
            },
            detailsOrder: {
                relation: Model.HasManyRelation,
                modelClass: DetailsOrder,
                join: {
                    from: 'products.id',
                    to: 'detailsOrder.productId'
                }
            },
        };
    }
}
