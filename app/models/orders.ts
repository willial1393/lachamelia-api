import {Model} from "objection";
import {Tables} from "./tables";
import {Employees} from "./employees";
import {DetailsOrder} from "./detailsOrder";
import * as moment from "moment";

export class Orders extends Model {
    static get tableName() {
        return 'orders';
    }

    $parseDatabaseJson(db) {
        const json = super.$parseDatabaseJson(db);
        if (json.start) {
            json.start = moment(new Date(json.start)).format('YYYY-MM-DD HH:mm:ss');
        }
        if (json.end) {
            json.end = moment(new Date(json.end)).format('YYYY-MM-DD HH:mm:ss');
        }
        return json;
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
                    from: 'orders.employeeId',
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
