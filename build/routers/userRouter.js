"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var users_1 = require("../models/users");
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var saltRounds = 10;
var key = 's0/\/\P4$$w0rD';
var UserRouter = /** @class */ (function () {
    function UserRouter() {
    }
    UserRouter.get = function () {
        router.get('/', function (req, res) {
            users_1.Users.query()
                .eager('[employees]')
                .then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(200).send(reason); });
        });
        router.get('/:id', function (req, res) {
            users_1.Users.query()
                .findById(req.params.id)
                .eager('[employees]')
                .then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(200).send(reason); });
        });
        router.get('/role/:role', function (req, res) {
            users_1.Users.query()
                .where('role', req.params.role)
                .eager('[employees]')
                .then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(200).send(reason); });
        });
        router.post('/register', function (req, res) {
            bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(req.body.password, salt, function (err, hash) {
                    req.body.password = hash;
                    users_1.Users.query().insertAndFetch(req.body).then(function (value) {
                        return res.status(200).send(value);
                    })
                        .catch(function (reason) {
                            return res.status(200).send(reason);
                        });
                });
            });
        });
        router.post('/login', function (req, res) {
            users_1.Users.query()
                .where('email', req.body.email)
                .eager('[employees,clients]')
                .first()
                .then(function (value) {
                    bcrypt.compare(req.body.password, value.password).then(function (value1) {
                        if (value1) {
                            res.status(200).send(value);
                        } else {
                            res.status(200).send('{"status":false}');
                        }
                    });
                })
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
