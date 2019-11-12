import {Orders} from "../models/orders";
import {Model, transaction} from "objection";
import {Users} from "../models/users";
import {Employees} from "../models/employees";

const express = require('express');
const router = express.Router();

export class OrderRouter {
    static get() {
        router.get('/', function (req, res) {
            Orders.query()
                .whereNull('end')
                .eager('[tables, employees, detailsOrder.[products]]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        router.get('/:id', function (req, res) {
            Orders.query()
                .findById(req.params.id)
                .eager('[tables, employees, detailsOrder]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });

        router.post('/insert', function (req, res) {
            Orders.query().insertAndFetch(req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        router.post('/delete', function (req, res) {
            Orders.query().deleteById(req.body.id).then(value => res.status(200).send('{"status":"deleted"}'))
                .catch(reason => res.status(403).send(reason));
        });
        router.put('/update', function (req, res) {
            Orders.query().updateAndFetchById(req.body.id, req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        return router;
    }
}
