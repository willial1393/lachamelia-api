"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var products_1 = require("../models/products");
var express = require('express');
var router = express.Router();
var ProductRouter = /** @class */ (function () {
    function ProductRouter() {
    }
    ProductRouter.get = function () {
        router.get('/', function (req, res) {
            products_1.Products.query()
                .eager('[categories]')
                .then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(403).send(reason); });
        });
        router.get('/:id', function (req, res) {
            products_1.Products.query()
                .findById(req.params.id)
                .eager('[categories]')
                .then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(403).send(reason); });
        });
        router.post('/insert', function (req, res) {
            products_1.Products.query().insertAndFetch(req.body).then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(403).send(reason); });
        });
        router.post('/delete', function (req, res) {
            products_1.Products.query().deleteById(req.body.id).then(function (value) { return res.status(200).send('{"status":"deleted"}'); })
                .catch(function (reason) { return res.status(403).send(reason); });
        });
        router.put('/update', function (req, res) {
            products_1.Products.query().updateAndFetchById(req.body.id, req.body).then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(403).send(reason); });
        });
        return router;
    };
    return ProductRouter;
}());
exports.ProductRouter = ProductRouter;
//# sourceMappingURL=productRouter.js.map