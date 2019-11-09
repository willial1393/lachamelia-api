import {Model} from "objection";

export class Roles extends Model {
    static get tableName() {
        return 'roles';
    }
}
