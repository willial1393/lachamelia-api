import {Model} from "objection";

export class Categories extends Model {
    static get tableName() {
        return 'categories';
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
