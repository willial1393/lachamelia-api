"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var users_1 = require("../models/users");
var express = require('express');
var router = express.Router();
var UserRouter = /** @class */ (function () {
    function UserRouter() {
    }
    UserRouter.get = function () {
        router.get('/', function (req, res) {
            users_1.Users.query()
                .eager('[employees, admins]')
                .then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(200).send(reason); });
        });
        router.post('/insert', function (req, res) {
            users_1.Users.query().insertAndFetch(req.body).then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(200).send(reason); });
        });
        router.post('/delete', function (req, res) {
            users_1.Users.query().deleteById(req.body.id).then(function (value) { return res.status(200).send('{"status":"deleted"}'); })
                .catch(function (reason) { return res.status(200).send(reason); });
        });
        router.put('/update', function (req, res) {
            users_1.Users.query().updateAndFetchById(req.body.id, req.body).then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(200).send(reason); });
        });
        return router;
    };
    return UserRouter;
}());
exports.UserRouter = UserRouter;
//# sourceMappingURL=userRouter.js.map