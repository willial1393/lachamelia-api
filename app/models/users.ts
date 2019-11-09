import {Model} from "objection";
import {Roles} from "./roles";

export class Users extends Model {
    static get tableName() {
        return 'users';
    }

    static get relationMappings() {
        return {
            roles: {
                relation: Model.HasOneRelation,
                modelClass: Roles,
                join: {
                    from: 'users.rolId',
                    to: 'roles.id'
                }
            }
        };
    }
}
