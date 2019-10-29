import {Model} from "objection";

export class Products extends Model {
    static get tableName() {
        return 'products';
    }

    // static get relationMappings() {
    //     return {
    //         children: {
    //             relation: Model.HasManyRelation,
    //             modelClass: Person,
    //             join: {
    //                 from: 'persons.id',
    //                 to: 'persons.parentId'
    //             }
    //         }
    //     };
    // }
}
