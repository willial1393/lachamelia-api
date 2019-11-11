import {Model} from "objection";
import {Orders} from "./orders";
import {Categories} from "./categories";
import {TypeTable} from "./typeTable";

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
            },
            typeTables: {
                relation: Model.HasOneRelation,
                modelClass: TypeTable,
                join: {
                    from: 'tables.typeTableId',
                    to: 'typetable.id'
                }
            },
        };
    }
}
