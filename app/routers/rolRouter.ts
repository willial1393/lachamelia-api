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
        router.post('/insert', function (req, res) {
            Roles.query().insertAndFetch(req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        router.post('/delete', function (req, res) {
            Roles.query().deleteById(req.body.id).then(value => res.status(200).send('{"status":"deleted"}'))
                .catch(reason => res.status(403).send(reason));
        });
        router.put('/update', function (req, res) {
            Roles.query().updateAndFetchById(req.body.id, req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        return router;
    }
}
