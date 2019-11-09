"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var users_1 = require("../models/users");
var objection_1 = require("objection");
var employees_1 = require("../models/employees");
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var saltRounds = 10;
var transaction = require('objection').transaction;
var UserRouter = /** @class */ (function () {
    function UserRouter() {
    }
    UserRouter.get = function () {
        router.get('/', function (req, res) {
            users_1.Users.query()
                .eager('[employees]')
                .then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) {
                    return res.status(403).send(reason);
                });
        });
        router.get('/:id', function (req, res) {
            users_1.Users.query()
                .findById(req.params.id)
                .eager('[employees]')
                .then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) {
                    return res.status(403).send(reason);
                });
        });
        router.get('/role/:role', function (req, res) {
            users_1.Users.query()
                .where('role', req.params.role)
                .eager('[employees]')
                .then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) {
                    return res.status(403).send(reason);
                });
        });
        // router.post('/register/employee', function (req, res) {
        //     bcrypt.genSalt(saltRounds, function (err, salt) {
        //         bcrypt.hash(req.body.password, salt, async function (err, hash) {
        //             req.body.password = hash;
        //             try {
        //                 const trans = await transaction(Model.knex(), async (trx) => {
        //                     return (await Users.query(trx)
        //                         .insertGraphAndFetch(req.body));
        //                 });
        //                 res.status(200).send(trans);
        //             } catch (err) {
        //                 res.status(403).send(err);
        //             }
        //         });
        //     });
        // });
        router.post('/register/employee', function (req, res) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            return [4 /*yield*/, bcrypt.genSalt(saltRounds, function (err, salt) {
                                bcrypt.hash(req.body.users.password, salt, function (err, hash) {
                                    return __awaiter(this, void 0, void 0, function () {
                                        var trans, err_1;
                                        var _this = this;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    _a.trys.push([0, 2, , 3]);
                                                    return [4 /*yield*/, transaction(objection_1.Model.knex(), function (trx) {
                                                        return __awaiter(_this, void 0, void 0, function () {
                                                            var user, employee;
                                                            return __generator(this, function (_a) {
                                                                switch (_a.label) {
                                                                    case 0:
                                                                        req.body.users.password = hash;
                                                                        return [4 /*yield*/, users_1.Users.query(trx)
                                                                            .insertAndFetch(req.body.users)];
                                                                    case 1:
                                                                        user = _a.sent();
                                                                        delete req.body.users;
                                                                        req.body.userId = user.id;
                                                                        return [4 /*yield*/, employees_1.Employees.query(trx)
                                                                            .insertAndFetch(req.body)];
                                                                    case 2:
                                                                        employee = _a.sent();
                                                                        return [4 /*yield*/, employees_1.Employees.query(trx)
                                                                            .findById(employee.id)
                                                                            .eager('[users.roles]')];
                                                                    case 3:
                                                                        return [2 /*return*/, (_a.sent())];
                                                                }
                                                            });
                                                        });
                                                    })];
                                                case 1:
                                                    trans = _a.sent();
                                                    res.status(200).send(trans);
                                                    return [3 /*break*/, 3];
                                                case 2:
                                                    err_1 = _a.sent();
                                                    res.status(403).send(err_1);
                                                    return [3 /*break*/, 3];
                                                case 3:
                                                    return [2 /*return*/];
                                            }
                                        });
                                    });
                                });
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        });
        router.post('/login/employee', function (req, res) {
            users_1.Users.query()
                .where('email', req.body.email)
                .first()
                .then(function (value) {
                bcrypt.compare(req.body.password, value.password).then(function (value1) {
                    if (value1) {
                        var employee = employees_1.Employees.query()
                            .where('userId', value1.id)
                            .eager('[users.roles]');
                        res.status(200).send(employee);
                    }
                    else {
                        res.status(403).send('{"status":false}');
                    }
                });
            })
                .catch(function (reason) {
                    return res.status(403).send(reason);
                });
        });
        router.post('/delete', function (req, res) {
            users_1.Users.query().deleteById(req.body.id).then(function (value) { return res.status(200).send('{"status":"deleted"}'); })
                .catch(function (reason) {
                    return res.status(403).send(reason);
                });
        });
        router.put('/update', function (req, res) {
            users_1.Users.query().updateAndFetchById(req.body.id, req.body).then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) {
                    return res.status(403).send(reason);
                });
        });
        return router;
    };
    return UserRouter;
}());
exports.UserRouter = UserRouter;
//# sourceMappingURL=userRouter.js.map
