import {Model} from "objection";
import {Tables} from "./tables";
import {Employees} from "./employees";
import {DetailsOrder} from "./detailsOrder";

export class Orders extends Model {
    static get tableName() {
        return 'orders';
    }

    static get relationMappings() {
        return {
            tables: {
                relation: Model.HasOneRelation,
                modelClass: Tables,
                join: {
                    from: 'orders.tableId',
                    to: 'tables.id'
                }
            },
            employees: {
                relation: Model.HasOneRelation,
                modelClass: Employees,
                join: {
                    from: 'orders.employee_idPersons',
                    to: 'employees.id'
                }
            },
            detailsOrder: {
            relation: Model.HasManyRelation,
                modelClass: DetailsOrder,
                join: {
                    from: 'orders.id',
                    to: 'detailsOrder.orderId'
            }
        }
        };
    }
}
