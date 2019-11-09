import {Roles} from "../models/roles";

const express = require('express');
const router = express.Router();

export class RolRouter {
    static get() {
        router.get('/', function (req, res) {
            Roles.query()
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        return router;
    }
}
