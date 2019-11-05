import {Users} from "../models/users";
import {Tables} from "../models/tables";

const express = require('express');
const router = express.Router();

export class UserRouter {
    static get() {
        router.get('/', function (req, res) {
            Users.query()
                .eager('[employees]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(200).send(reason));
        });
        router.get('/:id', function (req, res) {
            Users.query()
                .findById(req.params.id)
                .eager('[employees]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(200).send(reason));
        });
        router.get('/role/:role', function (req, res) {
            Users.query()
                .where('role', req.params.role)
                .eager('[employees]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(200).send(reason));
        });
        router.post('/insert', function (req, res) {
            Users.query().insertAndFetch(req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(200).send(reason));
        });
        router.post('/delete', function (req, res) {
            Users.query().deleteById(req.body.id).then(value => res.status(200).send('{"status":"deleted"}'))
                .catch(reason => res.status(200).send(reason));
        });
        router.put('/update', function (req, res) {
            Users.query().updateAndFetchById(req.body.id, req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(200).send(reason));
        });
        return router;
    }
}
