"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Admins_1 = require("../models/Admins");
var express = require('express');
var router = express.Router();
var AdminRouter = /** @class */ (function () {
    function AdminRouter() {
    }
    AdminRouter.get = function () {
        router.get('/', function (req, res) {
            Admins_1.Admins.query()
                .eager('[users]')
                .then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(200).send(reason); });
        });
        router.post('/insert', function (req, res) {
            Admins_1.Admins.query().insertAndFetch(req.body).then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(200).send(reason); });
        });
        router.post('/delete', function (req, res) {
            Admins_1.Admins.query().deleteById(req.body.id).then(function (value) { return res.status(200).send('{"status":"deleted"}'); })
                .catch(function (reason) { return res.status(200).send(reason); });
        });
        router.put('/update', function (req, res) {
            Admins_1.Admins.query().updateAndFetchById(req.body.id, req.body).then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(200).send(reason); });
        });
        return router;
    };
    return AdminRouter;
}());
exports.AdminRouter = AdminRouter;
//# sourceMappingURL=adminRouter.js.map