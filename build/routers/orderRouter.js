"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var orders_1 = require("../models/orders");
var express = require('express');
var router = express.Router();
var OrderRouter = /** @class */ (function () {
    function OrderRouter() {
    }
    OrderRouter.get = function () {
        router.get('/', function (req, res) {
            orders_1.Orders.query()
                .eager('[tables, employees]')
                .then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(200).send(reason); });
        });
        router.get('/:id', function (req, res) {
            orders_1.Orders.query()
                .findById(req.params.id)
                .eager('[tables, employees]')
                .then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(200).send(reason); });
        });
        router.post('/insert', function (req, res) {
            orders_1.Orders.query().insertAndFetch(req.body).then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(200).send(reason); });
        });
        router.post('/delete', function (req, res) {
            orders_1.Orders.query().deleteById(req.body.id).then(function (value) { return res.status(200).send('{"status":"deleted"}'); })
                .catch(function (reason) { return res.status(200).send(reason); });
        });
        router.put('/update', function (req, res) {
            orders_1.Orders.query().updateAndFetchById(req.body.id, req.body).then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(200).send(reason); });
        });
        return router;
    };
    return OrderRouter;
}());
exports.OrderRouter = OrderRouter;
//# sourceMappingURL=orderRouter.js.map