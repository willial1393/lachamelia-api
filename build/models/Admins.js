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
var Admins = /** @class */ (function (_super) {
    __extends(Admins, _super);
    function Admins() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Admins, "tableName", {
        get: function () {
            return 'admins';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Admins, "relationMappings", {
        get: function () {
            return {
                users: {
                    relation: objection_1.Model.HasOneRelation,
                    modelClass: users_1.Users,
                    join: {
                        from: 'admins.users_idUsers',
                        to: 'users.id'
                    }
                }
            };
        },
        enumerable: true,
        configurable: true
    });
    return Admins;
}(objection_1.Model));
exports.Admins = Admins;
//# sourceMappingURL=admins.js.map