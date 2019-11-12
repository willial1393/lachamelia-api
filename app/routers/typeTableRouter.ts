import {TypeTable} from "../models/typeTable";

const express = require('express');
const router = express.Router();

export class TypeTableRouter {
    static get() {
        router.get('/', function (req, res) {
            TypeTable.query()
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        router.get('/table', function (req, res) {
            TypeTable.query()
                .eager('[tables]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });

        router.post('/insert', function (req, res) {
            TypeTable.query().insertAndFetch(req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        router.post('/delete', function (req, res) {
            TypeTable.query().deleteById(req.body.id).then(value => res.status(200).send('{"status":"deleted"}'))
                .catch(reason => res.status(403).send(reason));
        });
        router.put('/update', function (req, res) {
            TypeTable.query().updateAndFetchById(req.body.id, req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        return router;
    }
}
