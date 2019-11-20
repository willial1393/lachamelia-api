import {Model} from "objection";

export class Tariffs extends Model {
    static get tableName() {
        return 'tariffs';
    }
}
