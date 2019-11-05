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
var users_1 = require("./users");
var orders_1 = require("./orders");
var Employees = /** @class */ (function (_super) {
    __extends(Employees, _super);
    function Employees() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Employees, "tableName", {
        get: function () {
            return 'employees';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Employees, "relationMappings", {
        get: function () {
            return {
                users: {
                    relation: objection_1.Model.HasOneRelation,
                    modelClass: users_1.Users,
                    join: {
                        from: 'employees.users_idUsers',
                        to: 'users.id'
                    }
                },
                orders: {
                    relation: objection_1.Model.HasManyRelation,
                    modelClass: orders_1.Orders,
                    join: {
                        from: 'employees.id',
                        to: 'orders.employee_idPersons'
                    }
                }
            };
        },
        enumerable: true,
        configurable: true
    });
    return Employees;
}(objection_1.Model));
exports.Employees = Employees;
//# sourceMappingURL=employees.js.map