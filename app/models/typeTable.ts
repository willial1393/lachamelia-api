import {Model} from "objection";
import {Tables} from "./tables";

export class TypeTable extends Model {
    static get tableName() {
        return 'typetable';
    }

    static get relationMappings() {
        return {
            tables: {
                relation: Model.HasManyRelation,
                modelClass: Tables,
                join: {
                    from: 'typetable.id',
                    to: 'tables.typeTableId'
                }
            }
        };
    }
}
