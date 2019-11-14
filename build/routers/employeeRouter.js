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
                .eager('[users.[roles]]')
                .then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(403).send(reason); });
        });
        router.get('/:id', function (req, res) {
            employees_1.Employees.query()
                .findById(req.params.id)
                .eager('[orders]')
                .then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(403).send(reason); });
        });
        router.get('/name/:name', function (req, res) {
            employees_1.Employees.query()
                .where('name', req.params.name)
                .eager('[orders.[detailsOrder, tables]]')
                .then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(403).send(reason); });
        });
        router.get('/email/:email', function (req, res) {
            employees_1.Employees.query()
                .where('email', req.params.email)
                .eager('[users]')
                .then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(403).send(reason); });
        });
        router.get('/idUsers/:users_idUsers', function (req, res) {
            employees_1.Employees.query()
                .where('users_idUsers', req.params.users_idUsers)
                .eager('[users]')
                .then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(403).send(reason); });
        });
        router.post('/insert', function (req, res) {
            employees_1.Employees.query().insertAndFetch(req.body).then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(403).send(reason); });
        });
        router.post('/delete', function (req, res) {
            employees_1.Employees.query().deleteById(req.body.id).then(function (value) { return res.status(200).send('{"status":"deleted"}'); })
                .catch(function (reason) { return res.status(403).send(reason); });
        });
        router.put('/update', function (req, res) {
            employees_1.Employees.query().updateAndFetchById(req.body.id, req.body).then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(403).send(reason); });
        });
        return router;
    };
    return EmployeeRouter;
}());
exports.EmployeeRouter = EmployeeRouter;
//# sourceMappingURL=employeeRouter.js.map