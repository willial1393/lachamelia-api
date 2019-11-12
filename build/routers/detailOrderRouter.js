"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var detailsOrder_1 = require("../models/detailsOrder");
var express = require('express');
var router = express.Router();
var DetailOrderRouter = /** @class */ (function () {
    function DetailOrderRouter() {
    }
    DetailOrderRouter.get = function () {
        router.get('/', function (req, res) {
            detailsOrder_1.DetailsOrder.query()
                .eager('[products]')
                .then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(403).send(reason); });
        });
        router.get('/orderId/:orderId', function (req, res) {
            detailsOrder_1.DetailsOrder.query()
                .where('orderId', req.params.orderId)
                .eager('[products]')
                .then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(403).send(reason); });
        });
        router.post('/insert', function (req, res) {
            detailsOrder_1.DetailsOrder.query().insertAndFetch(req.body).then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(403).send(reason); });
        });
        router.post('/delete', function (req, res) {
            detailsOrder_1.DetailsOrder.query().deleteById(req.body.id).then(function (value) { return res.status(200).send('{"status":"deleted"}'); })
                .catch(function (reason) { return res.status(403).send(reason); });
        });
        router.put('/update', function (req, res) {
            detailsOrder_1.DetailsOrder.query().updateAndFetchById(req.body.id, req.body).then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(403).send(reason); });
        });
        return router;
    };
    return DetailOrderRouter;
}());
exports.DetailOrderRouter = DetailOrderRouter;
//# sourceMappingURL=detailOrderRouter.js.map