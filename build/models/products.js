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
var Products = /** @class */ (function (_super) {
    __extends(Products, _super);
    function Products() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Products, "tableName", {
        get: function () {
            return 'products';
        },
        enumerable: true,
        configurable: true
    });
    return Products;
}(objection_1.Model));
exports.Products = Products;
//# sourceMappingURL=products.js.map