import {Model} from "objection";
import {Products} from "./products";

export class Categories extends Model {
    static get tableName() {
        return 'categories';
    }

    static get relationMappings() {
        return {
            products: {
                relation: Model.HasManyRelation,
                modelClass: Products,
                join: {
                    from: 'categories.id',
                    to: 'products.categoryId'
                }
            }
        };
    }
}
