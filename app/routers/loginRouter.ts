import {Model, raw} from "objection";
const express = require('express');
const router = express.Router();

export class LoginRouter {
    static get() {
        router.get('/', function (req, res) {
            Model.knexQuery().select(Model.raw('CALL `login`("willia@univoyaca", "fda143");'))
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(200).send(reason));
        });
        return router;
    }
}
