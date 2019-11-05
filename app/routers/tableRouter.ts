import {Tables} from "../models/tables";

const express = require('express');
const router = express.Router();

export class TableRouter {
    static get() {
        router.get('/', function (req, res) {
            Tables.query()
                .eager('[orders]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(200).send(reason));
        });
        router.get('/:id', function (req, res) {
            Tables.query()
                .findById(req.params.id)
                .eager('[orders]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(200).send(reason));
        });
        router.get('/name/:name', function (req, res) {
            Tables.query()
                .where('name', req.params.name)
                .eager('[orders]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(200).send(reason));
        });
        router.get('/status/:status', function (req, res) {
            Tables.query()
                .where('status', req.params.status)
                .eager('[orders]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(200).send(reason));
        });
        router.post('/insert', function (req, res) {
            Tables.query().insertAndFetch(req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(200).send(reason));
        });
        router.post('/delete', function (req, res) {
            Tables.query().deleteById(req.body.id).then(value => res.status(200).send('{"status":"deleted"}'))
                .catch(reason => res.status(200).send(reason));
        });
        router.put('/update', function (req, res) {
            Tables.query().updateAndFetchById(req.body.id, req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(200).send(reason));
        });
        return router;
    }
}
