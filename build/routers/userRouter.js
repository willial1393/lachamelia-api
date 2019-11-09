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
        router.post('/register', function (req, req1, res) {
            bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(req.body.password, salt, function (err, hash) {
                    return __awaiter(this, void 0, void 0, function () {
                        var transaction, scrappy, err_1;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    req.body.password = hash;
                                    transaction = require('objection').transaction;
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, transaction(req, req1, function (Person, Animal) { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: 
                                                    // Person and Animal inside this function are bound to a newly
                                                    // created transaction. The Person and Animal outside this function
                                                    // are not! Even if you do `require('./models/Person')` inside this
                                                    // function and start a query using the required `Person` it will
                                                    // NOT take part in the transaction. Only the actual objects passed
                                                    // to this function are bound to the transaction.
                                                    return [4 /*yield*/, Person
                                                            .query()
                                                            .insert({ firstName: 'Jennifer', lastName: 'Lawrence' })];
                                                    case 1:
                                                        // Person and Animal inside this function are bound to a newly
                                                        // created transaction. The Person and Animal outside this function
                                                        // are not! Even if you do `require('./models/Person')` inside this
                                                        // function and start a query using the required `Person` it will
                                                        // NOT take part in the transaction. Only the actual objects passed
                                                        // to this function are bound to the transaction.
                                                        _a.sent();
                                                        return [2 /*return*/, Animal
                                                                .query()
                                                                .insert({ name: 'Scrappy' })];
                                                }
                                            });
                                        }); })];
                                case 2:
                                    scrappy = _a.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_1 = _a.sent();
                                    console.log('Something went wrong. Neither Jennifer nor Scrappy were inserted');
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
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
                        delete value.password;
                        res.status(200).send(value);
                    }
                    else {
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