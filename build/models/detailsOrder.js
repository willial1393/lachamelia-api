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
var orders_1 = require("./orders");
var DetailsOrder = /** @class */ (function (_super) {
    __extends(DetailsOrder, _super);
    function DetailsOrder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(DetailsOrder, "tableName", {
        get: function () {
            return 'detailsOrder';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsOrder, "relationMappings", {
        get: function () {
            return {
                products: {
                    relation: objection_1.Model.HasOneRelation,
                    modelClass: products_1.Products,
                    join: {
                        from: 'detailsOrder.productId',
                        to: 'products.id'
                    }
                },
                orders: {
                    relation: objection_1.Model.HasOneRelation,
                    modelClass: orders_1.Orders,
                    join: {
                        from: 'detailsOrder.orderId',
                        to: 'orders.id'
                    }
                }
            };
        },
        enumerable: true,
        configurable: true
    });
    return DetailsOrder;
}(objection_1.Model));
exports.DetailsOrder = DetailsOrder;
//# sourceMappingURL=detailsOrder.js.map