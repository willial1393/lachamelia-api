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
var tables_1 = require("./tables");
var employees_1 = require("./employees");
var detailsOrder_1 = require("./detailsOrder");
var Orders = /** @class */ (function (_super) {
    __extends(Orders, _super);
    function Orders() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Orders, "tableName", {
        get: function () {
            return 'orders';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Orders, "relationMappings", {
        get: function () {
            return {
                tables: {
                    relation: objection_1.Model.HasOneRelation,
                    modelClass: tables_1.Tables,
                    join: {
                        from: 'orders.tableId',
                        to: 'tables.id'
                    }
                },
                employees: {
                    relation: objection_1.Model.HasOneRelation,
                    modelClass: employees_1.Employees,
                    join: {
                        from: 'orders.employeeId',
                        to: 'employees.id'
                    }
                },
                detailsOrder: {
                    relation: objection_1.Model.HasManyRelation,
                    modelClass: detailsOrder_1.DetailsOrder,
                    join: {
                        from: 'orders.id',
                        to: 'detailsOrder.orderId'
                    }
                }
            };
        },
        enumerable: true,
        configurable: true
    });
    return Orders;
}(objection_1.Model));
exports.Orders = Orders;
//# sourceMappingURL=orders.js.map