import {Model} from "objection";
import {Users} from "./users";
import {Orders} from "./orders";

export class Employees extends Model {
    static get tableName() {
        return 'employees';
    }

    static get relationMappings() {
        return {
            users: {
                relation: Model.HasOneRelation,
                modelClass: Users,
                join: {
                    from: 'employees.users_idUsers',
                    to: 'users.id'
                }
            },
            orders: {
                relation: Model.HasManyRelation,
                modelClass: Orders,
                join: {
                    from: 'employees.id',
                    to: 'orders.employee_idPersons'
                }
            }
        };
    }
}
