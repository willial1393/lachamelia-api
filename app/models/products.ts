import {Model} from "objection";
import {Categories} from "./categories";

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
            }
        };
    }
}
