"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tables_1 = require("../models/tables");
var express = require('express');
var router = express.Router();
var TableRouter = /** @class */ (function () {
    function TableRouter() {
    }
    TableRouter.get = function () {
        router.get('/', function (req, res) {
            tables_1.Tables.query()
                .eager('[orders]')
                .then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(200).send(reason); });
        });
        router.post('/insert', function (req, res) {
            tables_1.Tables.query().insertAndFetch(req.body).then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(200).send(reason); });
        });
        router.post('/delete', function (req, res) {
            tables_1.Tables.query().deleteById(req.body.id).then(function (value) { return res.status(200).send('{"status":"deleted"}'); })
                .catch(function (reason) { return res.status(200).send(reason); });
        });
        router.put('/update', function (req, res) {
            tables_1.Tables.query().updateAndFetchById(req.body.id, req.body).then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(200).send(reason); });
        });
        return router;
    };
    return TableRouter;
}());
exports.TableRouter = TableRouter;
//# sourceMappingURL=tableRouter.js.map