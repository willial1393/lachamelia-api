import {Model} from "objection";
import {Users} from "./users";

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
            }
        };
    }
}
