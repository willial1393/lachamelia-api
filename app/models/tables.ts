import {Model} from "objection";
import {Orders} from "./orders";

export class Tables extends Model {
    static get tableName() {
        return 'tables';
    }

    static get relationMappings() {
        return {
            orders: {
                relation: Model.HasManyRelation,
                modelClass: Orders,
                join: {
                    from: 'tables.id',
                    to: 'orders.tableId'
                }
            }
        };
    }
}
