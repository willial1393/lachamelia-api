import {Model} from "objection";
import {Products} from "./products";
import {Users} from "./users";

export class Roles extends Model {
    static get tableName() {
        return 'roles';
    }
    static get relationMappings() {
        return {
            users: {
                relation: Model.HasManyRelation,
                modelClass: Users,
                join: {
                    from: 'users.rolId',
                    to: 'roles.id'
                }
            }
        };
    }
}
