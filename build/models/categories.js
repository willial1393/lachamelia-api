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
var products_1 = require("./products");
var Categories = /** @class */ (function (_super) {
    __extends(Categories, _super);
    function Categories() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Categories, "tableName", {
        get: function () {
            return 'categories';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Categories, "relationMappings", {
        get: function () {
            return {
                products: {
                    relation: objection_1.Model.HasManyRelation,
                    modelClass: products_1.Products,
                    join: {
                        from: 'categories.id',
                        to: 'products.categoryId'
                    }
                }
            };
        },
        enumerable: true,
        configurable: true
    });
    return Categories;
}(objection_1.Model));
exports.Categories = Categories;
//# sourceMappingURL=categories.js.map