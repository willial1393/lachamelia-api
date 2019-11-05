"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var employees_1 = require("../models/employees");
var express = require('express');
var router = express.Router();
var EmployeeRouter = /** @class */ (function () {
    function EmployeeRouter() {
    }
    EmployeeRouter.get = function () {
        router.get('/', function (req, res) {
            employees_1.Employees.query()
                .eager('[users]')
                .then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(200).send(reason); });
        });
        router.post('/insert', function (req, res) {
            employees_1.Employees.query().insertAndFetch(req.body).then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(200).send(reason); });
        });
        router.post('/delete', function (req, res) {
            employees_1.Employees.query().deleteById(req.body.id).then(function (value) { return res.status(200).send('{"status":"deleted"}'); })
                .catch(function (reason) { return res.status(200).send(reason); });
        });
        router.put('/update', function (req, res) {
            employees_1.Employees.query().updateAndFetchById(req.body.id, req.body).then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(200).send(reason); });
        });
        return router;
    };
    return EmployeeRouter;
}());
exports.EmployeeRouter = EmployeeRouter;
//# sourceMappingURL=employeeRouter.js.map