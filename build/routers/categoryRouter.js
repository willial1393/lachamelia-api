"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var categories_1 = require("../models/categories");
var express = require('express');
var router = express.Router();
var CategoryRouter = /** @class */ (function () {
    function CategoryRouter() {
    }
    CategoryRouter.get = function () {
        router.get('/', function (req, res) {
            categories_1.Categories.query()
                .then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(403).send(reason); });
        });
        router.get('/prod', function (req, res) {
            categories_1.Categories.query()
                .eager('[products]')
                .then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(403).send(reason); });
        });
        router.get('/price/:price', function (req, res) {
            categories_1.Categories.query()
                .eager('[products]')
                .modifyEager('products', function (builder) {
                builder.where('price', '<=', req.params.price);
            })
                .then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(403).send(reason); });
        });
        router.get('/:id', function (req, res) {
            categories_1.Categories.query()
                .findById(req.params.id)
                .eager('[products]')
                .then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(403).send(reason); });
        });
        router.get('/name/:name', function (req, res) {
            categories_1.Categories.query()
                .where('name', req.params.name)
                .eager('[products]')
                .then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(403).send(reason); });
        });
        router.post('/insert', function (req, res) {
            categories_1.Categories.query().insertAndFetch(req.body).then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(200).send(reason); });
        });
        router.post('/delete', function (req, res) {
            categories_1.Categories.query().deleteById(req.body.id).then(function (value) { return res.status(200).send('{"status":"deleted"}'); })
                .catch(function (reason) { return res.status(403).send(reason); });
        });
        router.put('/update', function (req, res) {
            categories_1.Categories.query().updateAndFetchById(req.body.id, req.body).then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(403).send(reason); });
        });
        return router;
    };
    return CategoryRouter;
}());
exports.CategoryRouter = CategoryRouter;
//# sourceMappingURL=categoryRouter.js.map