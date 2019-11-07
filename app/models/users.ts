import {Model} from "objection";
import {Employees} from "./employees";
import {Clients} from "./clients";

export class Users extends Model {
    static get tableName() {
        return 'users';
    }

    static get relationMappings() {
        return {
            employees: {
                relation: Model.HasOneRelation,
                modelClass: Employees,
                join: {
                    from: 'users.id',
                    to: 'employees.userId'
                }
            },
            clients: {
                relation: Model.HasOneRelation,
                modelClass: Clients,
                join: {
                    from: 'users.id',
                    to: 'clients.userId'
                }
            }
        };
    }
}
