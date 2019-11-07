import {Model} from "objection";

export class Clients extends Model {
    static get tableName() {
        return 'clients';
    }
}
