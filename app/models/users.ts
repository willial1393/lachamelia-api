import {Model} from "objection";
import {Employees} from "./employees";
import {Admins} from "./admins";

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
                    to: 'employees.users_idUsers'
                }
            },
            admins: {
                relation: Model.HasOneRelation,
                modelClass: Admins,
                join: {
                    from: 'users.id',
                    to: 'admins.users_idUsers'
                }
            }
        };
    }
}
