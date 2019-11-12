import {Model} from "objection";
import {Roles} from "./roles";
import {Products} from "./products";

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
            },
            employees: {
                relation: Model.HasManyRelation,
                modelClass: Products,
                join: {
                    from: 'users.id',
                    to: 'employees.userId'
                }
            }
        };
    }
}
