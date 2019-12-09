import {Model} from "objection";
import {Products} from "./products";
import {Roles} from "./roles";

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
            }, roles: {
                relation: Model.HasOneRelation,
                modelClass: Roles,
                join: {
                    from: 'categories.rolId',
                    to: 'roles.id'
                }
            }
        };
    }
}
