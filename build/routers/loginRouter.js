"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var objection_1 = require("objection");
var express = require('express');
var router = express.Router();
var LoginRouter = /** @class */ (function () {
    function LoginRouter() {
    }
    LoginRouter.get = function () {
        router.get('/', function (req, res) {
            objection_1.Model.knexQuery().select(objection_1.Model.raw('CALL `login`("willia@univoyaca", "fda143");'))
                .then(function (value) { return res.status(200).send(value); })
                .catch(function (reason) { return res.status(200).send(reason); });
        });
        return router;
    };
    return LoginRouter;
}());
exports.LoginRouter = LoginRouter;
//# sourceMappingURL=loginRouter.js.map