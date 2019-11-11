"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var objection_1 = require("objection");
var orders_1 = require("./orders");
var typeTable_1 = require("./typeTable");
var Tables = /** @class */ (function (_super) {
    __extends(Tables, _super);
    function Tables() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Tables, "tableName", {
        get: function () {
            return 'tables';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tables, "relationMappings", {
        get: function () {
            return {
                orders: {
                    relation: objection_1.Model.HasManyRelation,
                    modelClass: orders_1.Orders,
                    join: {
                        from: 'tables.id',
                        to: 'orders.tableId'
                    }
                },
                typeTables: {
                    relation: objection_1.Model.HasOneRelation,
                    modelClass: typeTable_1.TypeTable,
                    join: {
                        from: 'tables.typeTableId',
                        to: 'typetable.id'
                    }
                },
            };
        },
        enumerable: true,
        configurable: true
    });
    return Tables;
}(objection_1.Model));
exports.Tables = Tables;
//# sourceMappingURL=tables.js.map