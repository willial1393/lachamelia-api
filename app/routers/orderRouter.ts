import {Orders} from "../models/orders";

const express = require('express');
const router = express.Router();

export class OrderRouter {
    static get() {
        router.get('/', function (req, res) {
            Orders.query()
                .eager('[tables, employees]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(200).send(reason));
        });
        router.get('/:id', function (req, res) {
            Orders.query()
                .findById(req.params.id)
                .eager('[tables, employees, detailsOrder]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(200).send(reason));
        });
        router.get('/name/:name', function (req, res) {
            Orders.query()
                .eager('[employees]')
                .modifyEager('employees', builder => {
                    builder.where('name', '=', req.params.name);
                })
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(200).send(reason));
        });

        router.post('/insert', function (req, res) {
            Orders.query().insertAndFetch(req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(200).send(reason));
        });
        router.post('/delete', function (req, res) {
            Orders.query().deleteById(req.body.id).then(value => res.status(200).send('{"status":"deleted"}'))
                .catch(reason => res.status(200).send(reason));
        });
        router.put('/update', function (req, res) {
            Orders.query().updateAndFetchById(req.body.id, req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(200).send(reason));
        });
        return router;
    }
}
