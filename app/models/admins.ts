import {Model} from "objection";
import {Users} from "./users";

export class Admins extends Model {
    static get tableName() {
        return 'admins';
    }

    static get relationMappings() {
        return {
            users: {
                relation: Model.HasOneRelation,
                modelClass: Users,
                join: {
                    from: 'admins.users_idUsers',
                    to: 'users.id'
                }
            }
        };
    }
}
