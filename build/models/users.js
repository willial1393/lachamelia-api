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
var employees_1 = require("./employees");
var clients_1 = require("./clients");
var Users = /** @class */ (function (_super) {
    __extends(Users, _super);
    function Users() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Users, "tableName", {
        get: function () {
            return 'users';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Users, "relationMappings", {
        get: function () {
            return {
                employees: {
                    relation: objection_1.Model.HasOneRelation,
                    modelClass: employees_1.Employees,
                    join: {
                        from: 'users.id',
                        to: 'employees.userId'
                    }
                },
                clients: {
                    relation: objection_1.Model.HasOneRelation,
                    modelClass: clients_1.Clients,
                    join: {
                        from: 'users.id',
                        to: 'clients.userId'
                    }
                }
            };
        },
        enumerable: true,
        configurable: true
    });
    return Users;
}(objection_1.Model));
exports.Users = Users;
//# sourceMappingURL=users.js.map